import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, Sparkles, Radio, Send, Smile, Star, Heart } from 'lucide-react';
import { LiveAudioSession } from '../utils/audioManager';
import { GradeLevel } from '../types';

interface LiveVoiceTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGrade: GradeLevel;
  onAddStar: () => void;
}

export const LiveVoiceTeacherModal: React.FC<LiveVoiceTeacherModalProps> = ({
  isOpen,
  onClose,
  selectedGrade,
  onAddStar,
}) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'disconnected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Ready to talk live with your AI Teacher!');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<Array<{ role: 'user' | 'teacher' | 'system'; text: string; time: string }>>([
    {
      role: 'system',
      text: `Hello Superstar! I am Teacher Jarvis for ${selectedGrade}. Ask me anything, practice your ABCs, Math tables, or listen to a fun story!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [textInput, setTextInput] = useState('');
  const sessionRef = useRef<LiveAudioSession | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  useEffect(() => {
    if (!isOpen && sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
      setStatus('idle');
    }
  }, [isOpen]);

  const startSession = async () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
    }

    const session = new LiveAudioSession({
      onStatusChange: (newStatus, msg) => {
        console.log('[LiveVoiceTeacherModal status changed]:', newStatus, msg);
        setStatus(newStatus);
        if (msg) setStatusMessage(msg);
        if (newStatus === 'speaking') {
          onAddStar();
        }
      },
      onAudioLevel: (lvl) => {
        console.log('[LiveVoiceTeacherModal audio level]:', lvl);
        if (!isMuted) {
          setAudioLevel(lvl);
        } else {
          setAudioLevel(0);
        }
      },
    });

    sessionRef.current = session;
    await session.start();
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    setStatus('disconnected');
    setStatusMessage('Live voice class ended. Click below to start again!');
    setAudioLevel(0);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    if (sessionRef.current) {
      sessionRef.current.sendTextMessage(textInput);
      setTranscripts((prev) => [
        ...prev,
        {
          role: 'user',
          text: textInput,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setTextInput('');
    }
  };

  const quickQuestions = [
    'Teacher, please teach me A B C D!',
    'Why is the sky blue?',
    '5 times 8 kitna hota hai?',
    'Tell me a fun animal story!',
    'How do plants make food?',
  ];

  if (!isOpen) return null;

  const isLiveActive = status === 'listening' || status === 'speaking' || status === 'connected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border-3 border-emerald-400/50 rounded-3xl shadow-2xl shadow-emerald-950/60 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-slate-950 font-black text-xl shadow-md shadow-emerald-400/30">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-['Plus_Jakarta_Sans']">
                  Teacher Jarvis Live Voice Class
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-Time Voice Tutor for {selectedGrade} • Speak naturally in English or Hindi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Avatar + Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto">
          {/* Left Column: Animated Teacher Avatar */}
          <div className="lg:col-span-6 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950/30">
            {/* Live Indicator */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status === 'speaking'
                      ? 'bg-emerald-400 animate-ping'
                      : status === 'listening'
                      ? 'bg-cyan-400 animate-pulse'
                      : status === 'connecting'
                      ? 'bg-amber-400 animate-bounce'
                      : 'bg-slate-600'
                  }`}
                />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                  {status === 'speaking' ? 'Teacher is Speaking 🗣️' : status === 'listening' ? 'Listening to You 👂' : status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Active Learning</span>
              </div>
            </div>

            {/* Cartoon Teacher Avatar & Pulsing Voice Sphere */}
            <div className="relative flex items-center justify-center my-6 py-2">
              {/* Outer Energy Pulse Rings */}
              <div
                className="absolute rounded-full border-2 border-emerald-400/30 transition-all duration-300 pointer-events-none"
                style={{
                  width: `${170 + audioLevel * 130}px`,
                  height: `${170 + audioLevel * 130}px`,
                  opacity: isLiveActive ? 0.7 : 0.1,
                  transform: `scale(${1 + audioLevel * 0.2})`,
                }}
              />
              <div
                className="absolute rounded-full border border-teal-300/40 transition-all duration-200 pointer-events-none"
                style={{
                  width: `${130 + audioLevel * 90}px`,
                  height: `${130 + audioLevel * 90}px`,
                  opacity: isLiveActive ? 0.8 : 0.2,
                }}
              />

              {/* Central Glowing Avatar Circle */}
              <div
                onClick={isLiveActive ? stopSession : startSession}
                className={`relative flex items-center justify-center w-36 h-36 rounded-full cursor-pointer transition-all duration-300 shadow-2xl border-4 ${
                  status === 'speaking'
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 border-white shadow-emerald-400/50 scale-105'
                    : status === 'listening'
                    ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 border-amber-200 shadow-orange-500/50 scale-100'
                    : 'bg-gradient-to-tr from-slate-800 to-slate-700 border-slate-600'
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-6xl animate-bounce">
                    {status === 'speaking' ? '🧑‍🏫' : status === 'listening' ? '😃' : '🤖'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="w-full text-center px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 my-2">
              <p className="text-xs text-slate-200 font-medium">
                {statusMessage}
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="w-full flex items-center justify-center gap-3 mt-4">
              {!isLiveActive ? (
                <button
                  onClick={startSession}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-400/25 transition-all active:scale-95"
                >
                  <Mic className="w-5 h-5 text-slate-950" />
                  <span>Start Live Voice Class</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isMuted
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-200 border-slate-700'
                    }`}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={stopSession}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <span>Pause Class</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Questions & Live Transcript */}
          <div className="lg:col-span-6 p-6 flex flex-col justify-between bg-slate-950/40">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CLASS CONVERSATION TRANSCRIPT</span>
                </span>
                <button
                  onClick={() => setTranscripts([])}
                  className="text-[11px] text-slate-500 hover:text-slate-300 font-mono"
                >
                  Clear
                </button>
              </div>

              {/* Transcripts Stream */}
              <div className="space-y-3 h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
                {transcripts.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      t.role === 'system'
                        ? 'bg-slate-900/80 border border-slate-800 text-slate-300'
                        : t.role === 'user'
                        ? 'bg-cyan-950/60 border border-cyan-800/80 text-cyan-200 ml-4'
                        : 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span className="font-bold">
                        {t.role === 'user' ? '👧 You (Child)' : t.role === 'teacher' ? '👩‍🏫 Teacher Jarvis' : '🎒 Classroom'}
                      </span>
                      <span>{t.time}</span>
                    </div>
                    <div>{t.text}</div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            </div>

            {/* Quick Questions & Input Box */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (sessionRef.current) {
                        sessionRef.current.sendTextMessage(q);
                        setTranscripts((prev) => [
                          ...prev,
                          {
                            role: 'user',
                            text: q,
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          },
                        ]);
                      }
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-emerald-950 hover:text-emerald-300 border border-slate-800 text-[11px] text-slate-400 whitespace-nowrap transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendText} className="flex items-center gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type a question or speak into your microphone..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!isLiveActive || !textInput.trim()}
                  className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

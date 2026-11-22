import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, CheckCircle2, Sparkles, Star, Volume2, RotateCcw, PenTool, BookOpen, Loader2 } from 'lucide-react';
import { safeFetchJson } from '../utils/safeFetch';

interface WritingPracticePadModalProps {
  initialWord?: string;
  onClose: () => void;
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar?: () => void;
}

const COMMON_PRACTICE_TARGETS = [
  // Class 1 & 2 Book Words
  { label: 'झूला', category: 'Class 1 Hindi', word: 'झूला', hint: 'अम्मा आज लगा दे झूला' },
  { label: 'आम', category: 'Class 1 Hindi', word: 'आम', hint: 'आम की टोकरी' },
  { label: 'पतंग', category: 'Class 1 Hindi', word: 'पतंग', hint: 'सर-सर उड़ी पतंग' },
  { label: 'CAT', category: 'English Phonics', word: 'CAT', hint: 'C - A - T = CAT 🐱' },
  { label: 'APPLE', category: 'English Phonics', word: 'APPLE', hint: 'A for Apple 🍎' },
  { label: 'BALL', category: 'English Phonics', word: 'BALL', hint: 'B for Ball ⚽' },
  { label: 'ऊँट', category: 'Class 2 Hindi', word: 'ऊँट', hint: 'ऊँट चला भाई ऊँट चला' },
  { label: 'भालू', category: 'Class 2 Hindi', word: 'भालू', hint: 'भालू ने खेली फुटबॉल ⚽' },
  // Numbers
  { label: '1 to 5', category: 'Numbers', word: '1 2 3 4 5', hint: 'Ginti 1 se 5' },
  { label: '10', category: 'Numbers', word: '10', hint: 'Number 10 (Ten)' },
  { label: '15', category: 'Numbers', word: '15', hint: 'Number 15 (Fifteen)' },
  // Hindi Varnamala
  { label: 'अ', category: 'Hindi Varnamala', word: 'अ', hint: 'अ से अनार' },
  { label: 'आ', category: 'Hindi Varnamala', word: 'आ', hint: 'आ से आम' },
  { label: 'क', category: 'Hindi Varnamala', word: 'क', hint: 'क से कमल' }
];

export const WritingPracticePadModal: React.FC<WritingPracticePadModalProps> = ({
  initialWord = 'झूला',
  onClose,
  onSpeakText,
  onAddStar
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>(initialWord);
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff'); // Default white chalk
  const [brushSize, setBrushSize] = useState<number>(6);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(true);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setHasDrawn(true);
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    setAiFeedback('');
  };

  const handleInspectWithAi = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsInspecting(true);
    setAiFeedback('');

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const data = await safeFetchJson('/api/kids/inspect-drawing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl })
      });
      if (data?.success && data.result) {
        const fb = data.result.feedback || `Wah! Bahut sundar likha hai! ⭐⭐⭐⭐⭐`;
        setAiFeedback(fb);
        const speech = data.result.speechText || `Shabash! Aapne '${currentWord}' bahut sundar likha hai! Aise hi practice karte raho!`;
        onSpeakText(speech, 'Kore');
        if (onAddStar) onAddStar();
      } else {
        setAiFeedback('Shabash! Bahut badhiya koshish! Keep practicing! ⭐⭐⭐');
      }
    } catch (e) {
      setAiFeedback('Bahut accha prayas kiya aapne! Agla shabd likhein!');
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSpeakTargetWord = () => {
    onSpeakText(`Dekho aur likho: ${currentWord}. Chalo board par ungli se likh kar dikhao!`, 'Kore');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl h-[92vh] bg-[#07111e] border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.25)] flex flex-col text-slate-100 overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-emerald-500/30 bg-[#09172a]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Likhna Sikhein (लिखना सीखें व अभ्यास)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-400/50 text-emerald-300">
                  Writing & Tracing
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                अगर लिखना नहीं आता तो यहाँ देखकर व हाथ से फेरकर लिखना सीखें • AI शिक्षक जाँचेंगे
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Practice Words Shelf (Pills) */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#050c17] border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-mono font-bold text-emerald-400 whitespace-nowrap mr-1">
            Chunein (Choose Word):
          </span>
          {COMMON_PRACTICE_TARGETS.map((target, idx) => {
            const isSelected = currentWord === target.word;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentWord(target.word);
                  clearCanvas();
                  onSpeakText(`Chalo likhte hain: ${target.word}`, 'Kore');
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{target.label}</span>
                <span className="text-[9px] opacity-70 ml-1">({target.category})</span>
              </button>
            );
          })}
        </div>

        {/* Tools Control Bar */}
        <div className="px-4 sm:px-6 py-2 bg-[#091524] border-b border-emerald-900/40 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          
          {/* Chalk Colors */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">Chalk:</span>
            {['#ffffff', '#fde047', '#38bdf8', '#f472b6', '#fb923c', '#4ade80'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`w-6 h-6 rounded-full transition-all cursor-pointer ${
                  selectedColor === color ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-80'
                }`}
              />
            ))}
          </div>

          {/* Guidelines Toggle & Clear Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                showGuidelines
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              {showGuidelines ? 'Dotted Guide: ON' : 'Guide: OFF'}
            </button>

            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all cursor-pointer active:scale-95"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Mitao (Clear)</span>
            </button>
          </div>

        </div>

        {/* Main Writing Blackboard Area */}
        <div className="flex-1 relative bg-[#091611] overflow-hidden flex flex-col justify-between p-3 select-none">
          
          {/* Subtle slate grid texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#1a3828_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />
          
          {/* Notebook Lines Background (4-line rule for writing practice) */}
          <div className="absolute inset-0 flex flex-col justify-around py-8 pointer-events-none opacity-20">
            <div className="w-full h-px bg-cyan-400" />
            <div className="w-full h-px bg-rose-400 dashed border-b border-rose-400" />
            <div className="w-full h-px bg-rose-400 dashed border-b border-rose-400" />
            <div className="w-full h-px bg-cyan-400" />
          </div>

          {/* Dotted Guide Silhouette for Tracing */}
          {showGuidelines && currentWord && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <span className="font-mono text-7xl sm:text-9xl font-black text-white/[0.12] tracking-widest select-none">
                {currentWord}
              </span>
            </div>
          )}

          {/* Freehand Writing Canvas */}
          <canvas
            ref={canvasRef}
            onPointerDown={startDrawing}
            onPointerMove={draw}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
            onPointerCancel={stopDrawing}
            className="absolute inset-0 w-full h-full touch-none z-20 cursor-crosshair"
          />

          {/* Bottom Action Drawer inside Canvas */}
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto p-2 bg-[#05100c]/85 backdrop-blur-md rounded-2xl border border-emerald-500/30">
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSpeakTargetWord}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 transition-all cursor-pointer"
                title="Suniyega"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Shabd / Word:</span>
                <span className="text-base font-bold text-white font-mono">{currentWord}</span>
              </div>
            </div>

            {/* AI Inspect Handwriting Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleInspectWithAi}
                disabled={isInspecting || !hasDrawn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-40"
              >
                {isInspecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Teacher Jarvis dekh rahi hain...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>AI Teacher Se Check Karwayein (जाँचें ⭐)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* AI Teacher Feedback Toast / Banner */}
        {aiFeedback && (
          <div className="px-4 py-3 bg-emerald-950/80 border-t border-emerald-500/50 flex items-center justify-between gap-3 animate-in slide-in-from-bottom shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Teacher Jarvis:</strong> {aiFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setAiFeedback('')}
              className="text-emerald-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

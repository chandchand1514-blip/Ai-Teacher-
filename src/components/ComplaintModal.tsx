import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Send, CheckCheck, ShieldCheck, Paperclip, Copy, Trash2, Check, Bot, Sparkles } from 'lucide-react';
import { safeFetchJson } from '../utils/safeFetch';
import { getDeviceId } from '../utils/deviceId';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  grade: string;
}

interface ChatMessageItem {
  id: string;
  complaint?: string;
  imageUrl?: string;
  studentName?: string;
  grade?: string;
  timestamp: string;
  adminReply?: {
    message?: string;
    imageUrl?: string;
    timestamp: string;
    repliedBy?: string;
    isAiBot?: boolean;
  };
}

interface ChatBubble {
  id: string; // Unique per bubble (e.g. 123_s or 123_a)
  rawComplaintId: string;
  sender: 'student' | 'admin';
  text?: string;
  imageUrl?: string;
  timestamp: string;
  studentName?: string;
  isAiBot?: boolean;
  repliedBy?: string;
}

const SupportDeskIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    {/* Headset headband arc */}
    <path d="M12 2A9 9 0 0 0 3 11v3a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4.07A7 7 0 0 1 19.93 10H18a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1a2 2 0 0 0 2-2v-3a9 9 0 0 0-9-9z"/>
    {/* Microphone boom */}
    <path d="M20 15a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4h-2a1 1 0 1 1 0-2h2a2 2 0 0 0 2-2v-1a1 1 0 0 1 1-1z"/>
    {/* Center speech bubble with 3 dots */}
    <path d="M12 6.5a4.5 4.5 0 0 0-4.5 4.5c0 1.6.8 3 2 3.8L9 16.5l2.2-1.1c.3.1.5.1.8.1a4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 12 6.5zm-2 4.5a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm2 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"/>
  </svg>
);

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, studentName, grade }) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isWaitingForReply, setIsWaitingForReply] = useState<boolean>(false);
  const [previewFullImage, setPreviewFullImage] = useState<string | null>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [copiedToast, setCopiedToast] = useState(false);

  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchThread = React.useCallback(() => {
    if (!isOpen) return;
    const devId = getDeviceId();
    const query = new URLSearchParams({
      deviceId: devId,
      studentName: studentName || '',
    }).toString();

    safeFetchJson(`/api/complaints/thread?${query}`)
      .then(data => {
        if (data?.success && Array.isArray(data.thread)) {
          setMessages(data.thread);
          const latestItem = data.thread.length > 0 ? data.thread[data.thread.length - 1] : null;
          if (latestItem) {
            if (latestItem.adminReply || latestItem.sender === 'admin') {
              setIsWaitingForReply(false);
            } else {
              setIsWaitingForReply(true);
            }
          }
        }
      })
      .catch(() => {});
  }, [isOpen, studentName]);

  useEffect(() => {
    fetchThread();
    const intervalTime = isWaitingForReply ? 700 : 3000;
    const interval = setInterval(fetchThread, intervalTime);
    return () => clearInterval(interval);
  }, [fetchThread, isWaitingForReply]);

  // Flatten messages into discrete, individually selectable bubbles
  const chatBubbles: ChatBubble[] = useMemo(() => {
    const list: ChatBubble[] = [];
    messages.forEach((item) => {
      if ((item.complaint && item.complaint.trim()) || item.imageUrl) {
        list.push({
          id: item.adminReply ? `${item.id}_s` : item.id,
          rawComplaintId: item.id,
          sender: 'student',
          text: (item.complaint && item.complaint.trim() !== '[Photo Attachment]') ? item.complaint.trim() : undefined,
          imageUrl: item.imageUrl,
          timestamp: item.timestamp,
          studentName: item.studentName,
        });
      }
      if (item.adminReply && ((item.adminReply.message && item.adminReply.message.trim()) || item.adminReply.imageUrl)) {
        list.push({
          id: `${item.id}_a`,
          rawComplaintId: item.id,
          sender: 'admin',
          text: (item.adminReply.message && item.adminReply.message.trim() !== '[Photo Attachment]') ? item.adminReply.message.trim() : undefined,
          imageUrl: item.adminReply.imageUrl,
          timestamp: item.adminReply.timestamp,
          isAiBot: Boolean(item.adminReply.isAiBot || item.adminReply.repliedBy?.includes('AI') || item.adminReply.repliedBy?.includes('Bot')),
          repliedBy: item.adminReply.repliedBy,
        });
      }
    });

    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages]);

  const hasTextToCopy = useMemo(() => {
    return chatBubbles
      .filter((b) => selectedMessageIds.includes(b.id))
      .some((b) => Boolean(b.text && b.text.trim() && b.text.trim() !== '[Photo Attachment]'));
  }, [chatBubbles, selectedMessageIds]);

  useEffect(() => {
    if (chatScrollRef.current && selectedMessageIds.length === 0) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatBubbles.length, selectedMessageIds.length]);

  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const readPromises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (typeof event.target?.result === 'string') {
            resolve(event.target.result);
          } else {
            resolve('');
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((dataUrls) => {
      const valid = dataUrls.filter(Boolean);
      setSelectedImages((prev) => [...prev, ...valid]);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = inputText.trim();
    const imagesToSend = [...selectedImages];
    if (!textToSend && imagesToSend.length === 0) return;

    // Reset inputs instantly
    setInputText('');
    setSelectedImages([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsSending(true);
    setIsWaitingForReply(true);

    try {
      if (imagesToSend.length > 0) {
        for (let i = 0; i < imagesToSend.length; i++) {
          const img = imagesToSend[i];
          const textForThisMsg = (i === 0 && textToSend) ? textToSend : '[Photo Attachment]';
          await safeFetchJson('/api/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              complaint: textForThisMsg,
              imageUrl: img,
              studentName: studentName || 'Student',
              grade: grade || 'Class 1',
              deviceId: getDeviceId(),
            }),
          });
        }
      } else if (textToSend) {
        await safeFetchJson('/api/complaints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaint: textToSend,
            studentName: studentName || 'Student',
            grade: grade || 'Class 1',
            deviceId: getDeviceId(),
          }),
        });
      }

      fetchThread();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // WhatsApp-style Granular Bubble Selection
  const toggleSelectBubble = (bubbleId: string) => {
    setSelectedMessageIds((prev) =>
      prev.includes(bubbleId) ? prev.filter((item) => item !== bubbleId) : [...prev, bubbleId]
    );
  };

  const startPressTimer = (bubbleId: string) => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      toggleSelectBubble(bubbleId);
    }, 380);
  };

  const clearPressTimer = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleBubbleClick = (bubbleId: string) => {
    if (selectedMessageIds.length > 0) {
      toggleSelectBubble(bubbleId);
    }
  };

  // Copy Selected Messages (only for bubbles with text)
  const handleCopySelected = () => {
    const selectedTexts = chatBubbles
      .filter((b) => selectedMessageIds.includes(b.id) && b.text)
      .map((b) => b.text)
      .filter(Boolean)
      .join('\n');

    if (selectedTexts) {
      navigator.clipboard?.writeText(selectedTexts);
      setCopiedToast(true);
      setTimeout(() => {
        setCopiedToast(false);
        setSelectedMessageIds([]);
      }, 1500);
    }
  };

  // Delete Selected Messages
  const handleDeleteSelected = async () => {
    if (selectedMessageIds.length === 0) return;
    try {
      await safeFetchJson('/api/complaints/delete-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedMessageIds }),
      });
      fetchThread();
      setSelectedMessageIds([]);
    } catch (err) {
      console.error('Failed to delete messages:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
      {/* Compact Chat Container - Reduced width as requested (lambai theek hai, chaudai kam karo) */}
      <div className="relative w-[84vw] max-w-[280px] sm:max-w-[295px] h-[65vh] max-h-[440px] bg-[#0b141a] border border-cyan-500/30 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.2)] text-slate-100 flex flex-col overflow-hidden">
        
        {/* Main Header Bar - ALWAYS visible, never disappears when marking messages */}
        <div className="px-3 py-2 bg-[#17242d] border-b border-slate-700/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative shrink-0">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-sm">
                <SupportDeskIcon className="w-4 h-4 text-cyan-300" />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#17242d]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-white leading-tight truncate">Admin</h3>
              <p className="text-[9px] text-emerald-400 font-mono leading-tight flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Online • Live Chat</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Action Sub-Bar - Appears neatly below the Admin header when messages are marked */}
        {selectedMessageIds.length > 0 && (
          <div className="px-3 py-1.5 bg-[#005c4b] border-b border-emerald-500/50 flex items-center justify-between shrink-0 animate-in slide-in-from-top-1 duration-150">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedMessageIds([])}
                className="p-1 rounded-full hover:bg-emerald-900/60 text-white transition-all cursor-pointer"
                title="Cancel Selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-[11px] text-white">
                {selectedMessageIds.length} Selected
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {copiedToast && (
                <span className="text-[9px] font-bold text-emerald-200 bg-emerald-900/90 px-1.5 py-0.5 rounded-full animate-pulse">
                  Copied! 📋
                </span>
              )}
              {/* Only show Copy button if selected bubbles contain text (hidden for photo only) */}
              {hasTextToCopy && (
                <button
                  type="button"
                  onClick={handleCopySelected}
                  className="p-1 rounded-lg hover:bg-emerald-900/60 text-white transition-all cursor-pointer active:scale-95"
                  title="Copy Selected Text"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-100" />
                </button>
              )}

              <button
                type="button"
                onClick={handleDeleteSelected}
                className="p-1 rounded-lg hover:bg-rose-900/60 text-rose-200 transition-all cursor-pointer active:scale-95"
                title="Delete Selected Message"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-300" />
              </button>
            </div>
          </div>
        )}

        {/* Chat Body - Each bubble rendered independently */}
        <div
          ref={chatScrollRef}
          className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:20px_20px] scrollbar-thin"
        >
          {chatBubbles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-400 gap-2">
              <div className="w-10 h-10 rounded-full bg-[#17242d] border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">Live Chat with Admin</p>
              <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px]">
                Yahan aap apni koi bhi complaint ya sawal likh sakte hain aur photo bhi bhej sakte hain! Admin turant jawab denge.
              </p>
            </div>
          ) : (
            chatBubbles.map((bubble) => {
              const isSelected = selectedMessageIds.includes(bubble.id);
              const isStudent = bubble.sender === 'student';

              return (
                <div
                  key={bubble.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                  onMouseDown={() => startPressTimer(bubble.id)}
                  onMouseUp={clearPressTimer}
                  onTouchStart={() => startPressTimer(bubble.id)}
                  onTouchEnd={clearPressTimer}
                  onClick={() => handleBubbleClick(bubble.id)}
                >
                  <div
                    className={`relative max-w-[85%] rounded-xl p-2.5 shadow-sm space-y-1.5 transition-all cursor-pointer ${
                      isStudent
                        ? 'bg-[#005c4b] text-white rounded-tr-xs'
                        : 'bg-[#17242d] border border-cyan-500/30 text-white rounded-tl-xs'
                    } ${isSelected ? 'ring-2 ring-cyan-300 shadow-lg' : ''}`}
                  >
                    {/* Checkmark indicator when selected */}
                    {isSelected && (
                      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md z-10">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    {!isStudent && (
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-cyan-300 font-mono">
                        <div className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                          <SupportDeskIcon className="w-2.5 h-2.5 text-cyan-300" />
                        </div>
                        <span>Admin</span>
                      </div>
                    )}

                    {bubble.imageUrl && (
                      <img
                        src={bubble.imageUrl}
                        alt="Photo"
                        onClick={(e) => {
                          if (selectedMessageIds.length === 0) {
                            e.stopPropagation();
                            setPreviewFullImage(bubble.imageUrl || null);
                          }
                        }}
                        className="rounded-lg max-h-36 w-full object-cover border border-emerald-400/30 cursor-pointer hover:opacity-90"
                      />
                    )}

                    {bubble.text && (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{bubble.text}</p>
                    )}

                    <div className={`flex items-center justify-end gap-1 text-[9px] font-mono ${
                      isStudent ? 'text-emerald-200' : 'text-slate-400'
                    }`}>
                      <span>{new Date(bubble.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isStudent && <CheckCheck className="w-3 h-3 text-sky-300" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* WhatsApp-style 3 Bouncing Dots Typing Indicator */}
          {isWaitingForReply && (
            <div className="flex flex-col items-start animate-in fade-in space-y-1">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-cyan-300 font-mono">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                  <SupportDeskIcon className="w-2.5 h-2.5 text-cyan-300" />
                </div>
                <span>Admin</span>
              </div>
              <div className="bg-[#17242d] border border-cyan-500/30 rounded-xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Selected Image Preview Strip (Supports Multiple Photos) */}
        {selectedImages.length > 0 && (
          <div className="px-2.5 py-1.5 bg-[#17242d] border-t border-slate-700/60 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative shrink-0 group">
                <img src={img} alt={`Preview ${idx}`} className="w-9 h-9 rounded-lg object-cover border border-cyan-500 shadow-sm" />
                <button
                  type="button"
                  onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            <span className="text-[10px] text-cyan-300 font-mono font-bold shrink-0">
              {selectedImages.length} Photo{selectedImages.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Footer Input Bar - Auto-expanding Textarea & Multi-Image Support */}
        <form onSubmit={handleSend} className="p-2 bg-[#17242d] border-t border-slate-700/60 flex items-end gap-1.5 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Photos (Ek sath jitne chahe photo chunen)"
            className="p-2 rounded-full hover:bg-slate-800 text-cyan-300 transition-all cursor-pointer active:scale-95 shrink-0 bg-transparent mb-0.5"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Type a message or question..."
            className="flex-1 px-3 py-1.5 rounded-2xl bg-[#20303b] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-400 resize-none max-h-[100px] overflow-y-auto scrollbar-thin leading-relaxed"
          />

          <button
            type="submit"
            disabled={isSending || (!inputText.trim() && selectedImages.length === 0)}
            className="p-2 rounded-full hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer active:scale-90 disabled:opacity-30 shrink-0 bg-transparent mb-0.5"
            title="Send"
          >
            <Send className="w-4 h-4 text-cyan-400" />
          </button>
        </form>

      </div>

      {/* Full Image Preview Modal */}
      {previewFullImage && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 animate-in fade-in"
          onClick={() => setPreviewFullImage(null)}
        >
          <div className="relative max-w-lg max-h-[90vh]">
            <img src={previewFullImage} alt="Full View" className="rounded-xl max-h-[85vh] object-contain shadow-2xl" />
            <button
              onClick={() => setPreviewFullImage(null)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

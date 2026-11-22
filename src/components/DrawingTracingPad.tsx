import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, Download, Eraser, Sparkles, Volume2, Star, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrawingTracingPadProps {
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar: () => void;
}

export const DrawingTracingPad: React.FC<DrawingTracingPadProps> = ({
  onSpeakText,
  onAddStar,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#38bdf8');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [tracingGuide, setTracingGuide] = useState<string>('A');

  const colorPalette = [
    { color: '#38bdf8', label: 'Sky Blue' },
    { color: '#f43f5e', label: 'Rose Pink' },
    { color: '#fbbf24', label: 'Golden Sun' },
    { color: '#4ade80', label: 'Emerald Green' },
    { color: '#a855f7', label: 'Magic Purple' },
    { color: '#ffffff', label: 'Chalk White' },
  ];

  const guideOptions = ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5', 'अ', 'क', '⭐', '❤️', 'None'];

  useEffect(() => {
    clearCanvas();
  }, [tracingGuide]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Tracing Guide if selected
    if (tracingGuide && tracingGuide !== 'None') {
      ctx.font = 'bold 220px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tracingGuide, canvas.width / 2, canvas.height / 2 + 10);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handlePraiseDrawing = () => {
    onAddStar();
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
    onSpeakText(`Wah! Shabash! What a beautiful drawing of ${tracingGuide !== 'None' ? tracingGuide : 'art'}! You get a bonus gold star!`, 'Kore');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950/80 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-2xl shadow-lg shadow-cyan-400/30">
              🎨
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                Magic Letter Tracing & Doodling Canvas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Practice writing letters, numbers, Hindi characters, and draw colorful shapes with rainbow brushes!
              </p>
            </div>
          </div>

          <button
            onClick={handlePraiseDrawing}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-400/25 transition-all"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>Submit for Gold Star!</span>
          </button>
        </div>
      </div>

      {/* Tracing Guide Letter Picker */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-900 rounded-2xl border border-slate-800 scrollbar-none">
        <span className="text-xs font-bold text-cyan-400 font-mono whitespace-nowrap mr-2">
          Select Guide to Trace:
        </span>
        {guideOptions.map((guide) => (
          <button
            key={guide}
            onClick={() => setTracingGuide(guide)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm transition-all flex items-center justify-center ${
              tracingGuide === guide
                ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30 scale-105'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {guide}
          </button>
        ))}
      </div>

      {/* Canvas Area & Tool Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas */}
        <div className="lg:col-span-9 bg-slate-900 border-2 border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={720}
            height={440}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full max-w-full h-80 sm:h-96 rounded-2xl border-2 border-slate-800 bg-[#090d16] cursor-crosshair touch-none shadow-inner"
          />
          <p className="text-[11px] text-slate-500 font-mono mt-3">
            Use your mouse or touchscreen finger to trace over the letter guidelines.
          </p>
        </div>

        {/* Color Palette & Brush Controls */}
        <div className="lg:col-span-3 bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 block">
              Magic Colors:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {colorPalette.map((p) => (
                <button
                  key={p.color}
                  onClick={() => setCurrentColor(p.color)}
                  className={`h-11 rounded-xl border-2 transition-all flex items-center justify-center ${
                    currentColor === p.color
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: p.color }}
                  title={p.label}
                >
                  {currentColor === p.color && <Check className="w-4 h-4 text-slate-950 font-bold" />}
                </button>
              ))}
            </div>

            {/* Brush Size Slider */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Brush Size:</span>
                <span className="text-cyan-300 font-bold">{brushSize}px</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Canvas Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <button
              onClick={clearCanvas}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Clear Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

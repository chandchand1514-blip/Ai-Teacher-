import React, { useState } from 'react';
import { X, Check, Palette, Sparkles } from 'lucide-react';

export interface KidColor {
  name: string;
  hindiName: string;
  hex: string;
  category: 'bright' | 'nature' | 'pastel' | 'basic';
}

export const COLOR_PALETTE: KidColor[] = [
  // Basics & Primaries
  { name: 'Red', hindiName: 'लाल', hex: '#ef4444', category: 'bright' },
  { name: 'Orange', hindiName: 'नारंगी', hex: '#f97316', category: 'bright' },
  { name: 'Yellow', hindiName: 'पीला', hex: '#fde047', category: 'bright' },
  { name: 'Green', hindiName: 'हरा', hex: '#22c55e', category: 'nature' },
  { name: 'Sky Blue', hindiName: 'आसमानी', hex: '#38bdf8', category: 'bright' },
  { name: 'Royal Blue', hindiName: 'नीला', hex: '#2563eb', category: 'bright' },
  { name: 'Purple', hindiName: 'बैंगनी', hex: '#a855f7', category: 'bright' },
  { name: 'Pink', hindiName: 'गुलाबी', hex: '#ec4899', category: 'pastel' },

  // Vibrant & Warm
  { name: 'Crimson', hindiName: 'गहरा लाल', hex: '#be123c', category: 'bright' },
  { name: 'Coral', hindiName: 'मूंगा', hex: '#fb7185', category: 'pastel' },
  { name: 'Amber', hindiName: 'अंबर', hex: '#f59e0b', category: 'bright' },
  { name: 'Gold', hindiName: 'सुनहरा', hex: '#eab308', category: 'bright' },
  { name: 'Peach', hindiName: 'आड़ू', hex: '#fdba74', category: 'pastel' },
  { name: 'Rose', hindiName: 'गुलाबी', hex: '#f43f5e', category: 'bright' },

  // Nature & Cool
  { name: 'Lime', hindiName: 'नींबू जैसा', hex: '#84cc16', category: 'nature' },
  { name: 'Mint', hindiName: 'पुदीना', hex: '#4ade80', category: 'nature' },
  { name: 'Forest Green', hindiName: 'गहरा हरा', hex: '#15803d', category: 'nature' },
  { name: 'Teal', hindiName: 'नीला-हरा', hex: '#14b8a6', category: 'nature' },
  { name: 'Cyan', hindiName: 'फिरोजी', hex: '#06b6d4', category: 'bright' },
  { name: 'Indigo', hindiName: 'गहरा नीला', hex: '#4f46e5', category: 'bright' },
  { name: 'Lavender', hindiName: 'लैवेंडर', hex: '#c084fc', category: 'pastel' },
  { name: 'Magenta', hindiName: 'मैजेंटा', hex: '#d946ef', category: 'bright' },

  // Earth & Neutrals
  { name: 'Brown', hindiName: 'भूरा', hex: '#92400e', category: 'nature' },
  { name: 'Chocolate', hindiName: 'चॉकलेटी', hex: '#451a03', category: 'nature' },
  { name: 'Slate Gray', hindiName: 'स्लेटी', hex: '#64748b', category: 'basic' },
  { name: 'Silver Gray', hindiName: 'सिल्वर', hex: '#cbd5e1', category: 'basic' },
  { name: 'White', hindiName: 'सफेद', hex: '#ffffff', category: 'basic' },
  { name: 'Black', hindiName: 'काला', hex: '#000000', category: 'basic' }
];

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  onSelectColor: (hex: string) => void;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'bright' | 'nature' | 'pastel' | 'basic'>('all');

  if (!isOpen) return null;

  const filteredColors = activeTab === 'all'
    ? COLOR_PALETTE
    : COLOR_PALETTE.filter(c => c.category === activeTab);

  const selectedObj = COLOR_PALETTE.find(c => c.hex.toLowerCase() === selectedColor.toLowerCase());

  // Determine if checkmark should be light or dark based on luminance
  const isLightColor = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return false;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.65;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full sm:max-w-md bg-[#07131e] border-t sm:border border-cyan-500/40 rounded-t-3xl sm:rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col max-h-[85vh] overflow-hidden z-10 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-3.5 py-2.5 bg-[#0a1b2a] border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-sm">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Choose Color</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-white font-mono font-bold text-xs border border-amber-500/50 hover:bg-slate-800 cursor-pointer active:scale-95 transition-all"
            >
              Done ✓
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Color Grid */}
        <div className="p-3 overflow-y-auto max-h-[65vh] sm:max-h-[70vh] overscroll-contain">
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
            {COLOR_PALETTE.map((c) => {
              const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
              const light = isLightColor(c.hex);

              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    onSelectColor(c.hex);
                  }}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all cursor-pointer group active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.4)] scale-102'
                      : 'bg-[#081522] border-slate-800 hover:border-slate-600 hover:bg-[#0c1f32]'
                  }`}
                >
                  {/* Color Circle Swatch */}
                  <div
                    className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/80 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3 h-3 sm:w-4 sm:h-4 stroke-[3] ${
                          light ? 'text-slate-950' : 'text-white drop-shadow-md'
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span className="mt-1 text-[10px] sm:text-[11px] font-bold text-white leading-tight text-center">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer removed */}


      </div>
    </div>
  );
};

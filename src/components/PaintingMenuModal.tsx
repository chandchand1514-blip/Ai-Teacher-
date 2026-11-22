import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Check, Shuffle } from 'lucide-react';
import { ColoringSheet, SHEET_CATEGORIES } from '../data/coloringSheets';

interface PaintingMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheets: ColoringSheet[];
  activeSheetId: string;
  sheetFills: Record<string, Record<string, string>>;
  onSelectSheet: (sheetId: string) => void;
}

export const PaintingMenuModal: React.FC<PaintingMenuModalProps> = ({
  isOpen,
  onClose,
  sheets,
  activeSheetId,
  sheetFills,
  onSelectSheet
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter sheets by category and search
  const filteredSheets = useMemo(() => {
    return sheets.filter(sheet => {
      const matchesCategory =
        selectedCategory === 'all' || sheet.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = sheet.name.toLowerCase().includes(q);
      const inEmoji = sheet.emoji.includes(q);
      const inCategory = sheet.category.toLowerCase().includes(q);
      const inParts = sheet.parts.some(p => p.name.toLowerCase().includes(q));

      return inName || inEmoji || inCategory || inParts;
    });
  }, [sheets, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const handleSelect = (sheetId: string) => {
    onSelectSheet(sheetId);
    onClose();
  };

  const handlePickRandom = () => {
    const remaining = sheets.filter(s => s.id !== activeSheetId);
    const pool = remaining.length > 0 ? remaining : sheets;
    const randomSheet = pool[Math.floor(Math.random() * pool.length)];
    if (randomSheet) {
      handleSelect(randomSheet.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Dialog Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#07131e] border-2 border-cyan-500/50 rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.25)] flex flex-col overflow-hidden z-10 text-white">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#0a1a29] via-[#0b2438] to-[#0a1a29] border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🎨</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold font-mono text-cyan-200 flex items-center gap-1.5">
                  <span>Painting Menu (30 Beautiful Drawings)</span>
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  {sheets.length} Drawings
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Choose your favorite drawing and start coloring!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Random Pick Button */}
            <button
              type="button"
              onClick={handlePickRandom}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.35)] cursor-pointer active:scale-95 transition-all"
              title="Pick a random drawing"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Random Drawing 🎲</span>
              <span className="sm:hidden">Random</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="Close"
            >
              <X className="w-4 h-4 text-slate-300 hover:text-rose-400" />
            </button>
          </div>
        </div>

        {/* Filter Controls: Search and Categories */}
        <div className="px-3 sm:px-6 py-2.5 bg-[#050d18] border-b border-cyan-500/20 flex flex-col gap-2 shrink-0">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name (e.g., Elephant, Car, Apple, Lion)..."
              className="w-full bg-[#081726] border border-cyan-500/30 rounded-xl pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {SHEET_CATEGORIES.map(cat => {
              const count =
                cat.id === 'all'
                  ? sheets.length
                  : sheets.filter(s => s.category === cat.id).length;

              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                      : 'bg-[#081726] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? 'bg-slate-950/20 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid Area */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5">
          {filteredSheets.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-3xl">🔍</span>
              <p className="text-sm text-slate-400 font-sans">
                No painting found: &quot;{searchQuery}&quot;
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 rounded-xl text-xs font-mono hover:bg-cyan-500/30 cursor-pointer"
              >
                View all 30 paintings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
              {filteredSheets.map(sheet => {
                const isSelected = sheet.id === activeSheetId;
                const fills = sheetFills[sheet.id] || {};
                const filledCount = sheet.parts.filter(
                  p => Boolean(fills[p.id]) && fills[p.id] !== '#ffffff'
                ).length;
                const totalParts = sheet.parts.length;
                const isComplete = filledCount === totalParts && totalParts > 0;

                return (
                  <div
                    key={sheet.id}
                    onClick={() => handleSelect(sheet.id)}
                    className={`group relative flex flex-col p-2.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-950/80 to-[#0b2438] border-cyan-400 ring-2 ring-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.35)] scale-[1.02]'
                        : 'bg-[#091827] hover:bg-[#0c2033] border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:scale-[1.01]'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <span className="absolute top-2 right-2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-mono font-bold shadow-md">
                        <Check className="w-3 h-3" />
                        <span>Selected</span>
                      </span>
                    )}

                    {/* Completion Star */}
                    {!isSelected && isComplete && (
                      <span className="absolute top-2 right-2 z-20 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-mono font-bold shadow-md">
                        ⭐ Done
                      </span>
                    )}

                    {/* SVG Mini Preview Thumbnail */}
                    <div className="relative w-full aspect-square rounded-xl bg-[#06121d] border border-cyan-500/20 overflow-hidden flex items-center justify-center p-1 group-hover:border-cyan-400/40 transition-all">
                      <svg
                        viewBox="0 0 400 400"
                        className="w-full h-full drop-shadow-sm pointer-events-none"
                      >
                        <rect width="400" height="400" rx="20" fill="#0b1724" stroke="#162b3d" strokeWidth="3" />
                        {sheet.parts.map(part => {
                          const fill = fills[part.id] || part.defaultFill || '#ffffff';
                          return (
                            <path
                              key={part.id}
                              d={part.d}
                              fill={fill}
                              stroke="#050d14"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          );
                        })}
                      </svg>
                    </div>

                    {/* Info */}
                    <div className="mt-2 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-base shrink-0">{sheet.emoji}</span>
                        <span className="text-xs font-bold text-white font-sans truncate">
                          {sheet.name.split('(')[0].trim()}
                        </span>
                      </div>

                      {/* English secondary label */}
                      <span className="text-[11px] text-cyan-300 font-sans truncate">
                        {sheet.name.includes('(')
                          ? sheet.name.substring(sheet.name.indexOf('(') + 1, sheet.name.indexOf(')'))
                          : sheet.name}
                      </span>

                      {/* Progress / Status Tag */}
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                        {isComplete ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Finished ({totalParts}/{totalParts})
                          </span>
                        ) : filledCount > 0 ? (
                          <span className="text-amber-300 font-medium">
                            Filled: {filledCount}/{totalParts}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            {totalParts} parts to color
                          </span>
                        )}

                        <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform text-xs">
                          🎨
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info tip */}
        <div className="px-4 py-2.5 bg-[#050d18] border-t border-cyan-500/20 flex items-center justify-between text-[11px] text-slate-300 font-sans shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">💡</span>
            <span>Tap any drawing — it will open and teach you how to color it!</span>
          </div>
          <span className="hidden sm:inline font-mono text-cyan-400/80">
            Total: {sheets.length} paintings
          </span>
        </div>
      </div>
    </div>
  );
};

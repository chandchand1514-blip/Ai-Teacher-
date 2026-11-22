import React from 'react';
import { X, Check, Globe } from 'lucide-react';

export interface LanguageOption {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  greeting: string;
}

export const INDIAN_LANGUAGES: LanguageOption[] = [
  { id: 'Hinglish', name: 'Hinglish', nativeName: 'Hinglish (Default)', flag: '🇮🇳', greeting: 'Namaste! Kaise ho aap?' },
  { id: 'Hindi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', greeting: 'नमस्ते! आप कैसे हैं?' },
  { id: 'English', name: 'English', nativeName: 'English', flag: '🇬🇧', greeting: 'Hello! How are you?' },
  { id: 'Urdu', name: 'Urdu', nativeName: 'اردو (Urdu)', flag: '🕌', greeting: 'अस्सलाम वालेकुम! आप कैसे हैं?' },
  { id: 'Bhojpuri', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🌾', greeting: 'प्रणाम! कईसन बानी?' },
  { id: 'Khortha', name: 'Khortha', nativeName: 'खोरठा (Khortha - Jharkhand)', flag: '🌾', greeting: 'जोहार! केसन बाही?' },
  { id: 'Bengali', name: 'Bengali', nativeName: 'বাংলা (Bengali)', flag: '🇮🇳', greeting: 'নমস্কার! কেমন আছেন?' },
  { id: 'Marathi', name: 'Marathi', nativeName: 'मराठी (Marathi)', flag: '🇮🇳', greeting: 'नमस्कार! कसे आहात?' },
  { id: 'Tamil', name: 'Tamil', nativeName: 'தமிழ் (Tamil)', flag: '🇮🇳', greeting: 'வணக்கம்! எப்படி இருக்கிறீர்கள்?' },
  { id: 'Telugu', name: 'Telugu', nativeName: 'తెలుగు (Telugu)', flag: '🇮🇳', greeting: 'నమస్కారం! ఎలా ఉన్నారు?' },
  { id: 'Gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી (Gujarati)', flag: '🇮🇳', greeting: 'નમસ્તે! કેમ છો?' },
  { id: 'Kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳', greeting: 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರ?' },
  { id: 'Malayalam', name: 'Malayalam', nativeName: 'മലയാളം (Malayalam)', flag: '🇮🇳', greeting: 'നമസ്കാരം! സുഖമാണോ?' },
  { id: 'Punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳', greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਕੀ ਹਾਲ ਹੈ?' },
  { id: 'Odia', name: 'Odia', nativeName: 'ଓଡ଼ିଆ (Odia)', flag: '🇮🇳', greeting: 'ନମସ୍କାର! କେମିତି ଅଛନ୍ତି?' },
  { id: 'Assamese', name: 'Assamese', nativeName: 'অসমীয়া (Assamese)', flag: '🇮🇳', greeting: 'নমস্কাৰ! কেনেকুৱা আছে?' },
];

interface LanguageSelectionModalProps {
  isOpen: boolean;
  selectedLanguage: string;
  onClose: () => void;
  onSelectLanguage: (lang: string) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  selectedLanguage = 'Hinglish',
  onClose,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 bg-black/90 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200 select-none">
      <div className="relative w-full max-w-[245px] sm:max-w-[260px] max-h-[60vh] bg-[#071322] border-2 border-cyan-400/70 rounded-xl p-2.5 shadow-[0_0_50px_rgba(6,182,212,0.6)] text-slate-100 flex flex-col gap-2 overflow-hidden">
        {/* Pop-Up Header */}
        <div className="flex items-center justify-between pb-1 border-b border-cyan-500/30">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
              <Globe className="w-3 h-3 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-bold text-[10px] text-cyan-200 leading-tight">
                Select Language
              </h3>
              <p className="text-[8px] text-slate-400">
                AI Teacher bhasha chunein
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close Language Modal"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Scrollable Language List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
          <span className="text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-wider block mb-0.5">
            🌐 INDIAN LANGUAGES & HINGLISH:
          </span>

          <div className="grid grid-cols-1 gap-1">
            {INDIAN_LANGUAGES.map((lang) => {
              const isSelected =
                lang.name.toLowerCase() === (selectedLanguage || 'hinglish').toLowerCase();
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    onSelectLanguage(lang.name);
                    onClose();
                  }}
                  className={`p-1.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-cyan-500/25 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.35)] text-cyan-200 font-bold'
                      : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs shrink-0">{lang.flag}</span>
                    <span className="text-[10px] font-bold leading-tight truncate">
                      {lang.nativeName}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3 h-3 text-cyan-400 shrink-0 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

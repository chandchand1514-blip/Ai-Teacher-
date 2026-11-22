import React from 'react';
import { X, Smartphone, ShieldCheck, Camera, CheckCircle2, AlertCircle } from 'lucide-react';

interface ApkInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCamera: () => void;
  onMarkInstalled: () => void;
  apkUrl?: string;
}

export const APK_DOWNLOAD_URL = 'https://files.catbox.moe/odha8f.apk';

export const ApkInstallGuideModal: React.FC<ApkInstallGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenCamera,
  onMarkInstalled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md max-h-[90vh] bg-gradient-to-b from-[#091829] to-[#040b14] border border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-3.5 overflow-y-auto scrollbar-thin">
        {/* Ambient Corner Glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 blur-2xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/15 blur-2xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/30 to-cyan-400/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Smartphone className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide flex items-center gap-1.5">
                <span>AI Teacher App (APK)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Android
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Install karne ka simple tarika & error solve guide
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step-by-Step Installation Instructions */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider block">
            📋 3 Simple Steps to Install APK:
          </span>

          {/* Step 1 */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs">
              <strong className="text-white block font-semibold">Downloaded File Ko Kholein:</strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Chrome ke notification mein <span className="text-cyan-300 font-mono">'Open'</span> dabayein ya phone ke <span className="text-amber-300 font-medium">Downloads Folder</span> mein jakar <span className="font-mono text-cyan-200">odha8f.apk</span> par tap karein.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs">
              <strong className="text-white block font-semibold flex items-center gap-1">
                <span>Unknown Apps Setting Allow Karein:</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Agar phone bole <span className="text-rose-300 italic">"Not allowed to install unknown apps"</span>, toh <span className="text-amber-300 font-semibold">'Settings'</span> par tap karein aur <span className="text-emerald-300 font-semibold">'Allow from this source'</span> ko ON kar dein. Phir back aakar Install dabayein.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs">
              <strong className="text-white block font-semibold flex items-center gap-1">
                <span>Play Protect Warning (Agar Aaye):</span>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              </strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Agar Play Protect bole <span className="text-amber-300 italic">"Unrecognized app"</span>, toh neeche <span className="text-cyan-300 font-semibold">'More details'</span> (chhota arrow) par tap karein aur <span className="text-emerald-300 font-semibold">'Install anyway'</span> par click kar dein!
              </p>
            </div>
          </div>
        </div>

        {/* AI Camera Screenshot Diagnostic Helper */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-cyan-500/50 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="text-xs font-bold text-white">
              Install karne mein dikkat aa rahi hai?
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Apne phone ki screen ya error ka photo camera se AI Teacher ko dikhaiye! AI Teacher screenshot dekh kar turant bata degi ki kahan tap karna hai.
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenCamera();
            }}
            className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>Camera se Screenshot / Error ki Photo Bhejein</span>
          </button>
        </div>

        {/* User Confirmation Buttons */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onMarkInstalled();
              onClose();
            }}
            className="w-full sm:flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Maine App Install Kar Liya Hai ✅</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Band Karein
          </button>
        </div>
      </div>
    </div>
  );
};

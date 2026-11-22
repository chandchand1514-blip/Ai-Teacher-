import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Camera, RefreshCw, Check, Upload, Sparkles, AlertCircle } from 'lucide-react';

interface NotebookCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  grade?: string;
  onPhotoSubmit: (base64Image: string) => Promise<{ success: boolean; feedback?: string; isCorrect?: boolean }>;
  onCameraOpen?: () => void;
}

export function NotebookCameraModal({
  isOpen,
  onClose,
  studentName,
  grade,
  onPhotoSubmit,
  onCameraOpen,
}: NotebookCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasTriggeredOpenPromptRef = useRef<boolean>(false);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [feedbackResult, setFeedbackResult] = useState<{ feedback: string; isCorrect: boolean } | null>(null);

  // Stop video stream cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    stopStream();
    setCameraError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser or device.');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (_) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // Trigger prompt once when camera successfully opens
      if (!hasTriggeredOpenPromptRef.current) {
        hasTriggeredOpenPromptRef.current = true;
        onCameraOpen?.();
      }
    } catch (err: any) {
      console.warn('[Camera Access Note]:', err?.message || err);
      setCameraError('Camera access not granted or unavailable. You can also upload a photo of your copy directly.');
    }
  }, [stopStream, onCameraOpen]);

  // Manage camera lifecycle on modal open/close
  useEffect(() => {
    if (isOpen && !capturedImage) {
      hasTriggeredOpenPromptRef.current = false;
      startCamera(facingMode);
    } else {
      stopStream();
      hasTriggeredOpenPromptRef.current = false;
    }
    return () => {
      stopStream();
    };
  }, [isOpen, capturedImage, facingMode, startCamera, stopStream]);

  // Toggle between front and back camera
  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Capture snapshot from live video (optimized & compressed to 1024px for lightning fast send)
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const naturalW = video.videoWidth || 640;
      const naturalH = video.videoHeight || 480;
      const maxDim = 1024;
      const scale = Math.min(1, maxDim / Math.max(naturalW, naturalH));
      const targetW = Math.round(naturalW * scale);
      const targetH = Math.round(naturalH * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, targetW, targetH);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setCapturedImage(dataUrl);
        stopStream();
      }
    } catch (err) {
      console.error('Failed to capture frame from camera:', err);
    }
  };

  // Handle direct file upload / gallery fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1024;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            setCapturedImage(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            setCapturedImage(reader.result as string);
          }
          stopStream();
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setFeedbackResult(null);
    startCamera(facingMode);
  };

  // Submit photo to AI teacher with automatic timeout safeguard
  const handleSubmit = async () => {
    if (!capturedImage || isSubmitting) return;
    setIsSubmitting(true);
    setFeedbackResult(null);

    const safetyTimer = setTimeout(() => {
      setIsSubmitting(false);
      handleClose();
    }, 12000);

    try {
      const res = await onPhotoSubmit(capturedImage);
      clearTimeout(safetyTimer);
      if (res?.feedback) {
        setFeedbackResult({
          feedback: res.feedback,
          isCorrect: res.isCorrect ?? true,
        });
      }
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      clearTimeout(safetyTimer);
      console.error('Error submitting copy photo to AI Teacher:', err);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    setFeedbackResult(null);
    setCameraError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#0d1624] border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-3 overflow-hidden">
        {/* Top Header: Title & Close Button */}
        <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/40">
              <Camera className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Camera
              </h2>
              <p className="text-[11px] text-cyan-300/80">
                Copy ka photo khinchkar AI Teacher ko dikhayein
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl bg-black overflow-hidden border border-slate-700/80 flex items-center justify-center shadow-inner">
          {capturedImage ? (
            /* Captured Snapshot Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured Notebook Copy"
                className="w-full h-full object-cover"
              />
              {/* Overlay Feedback if available */}
              {feedbackResult && (
                <div className="absolute inset-x-2 bottom-2 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-400/50 text-white animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 mb-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>AI Teacher ne dekh liya!</span>
                  </div>
                  <p className="text-[11px] text-slate-200 line-clamp-3 leading-snug">
                    {feedbackResult.feedback}
                  </p>
                </div>
              )}
            </div>
          ) : cameraError ? (
            /* Error & Fallback View */
            <div className="p-4 text-center flex flex-col items-center gap-3">
              <AlertCircle className="w-10 h-10 text-amber-400" />
              <p className="text-xs text-slate-300 leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Gallery / File se Photo Chunein</span>
              </button>
            </div>
          ) : (
            /* Live Camera Feed */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />

              {/* Viewfinder Guide Overlay for Notebook */}
              <div className="absolute inset-4 rounded-xl border border-dashed border-cyan-400/35 pointer-events-none flex flex-col justify-between p-2">
                <span className="text-[10px] text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded self-start">
                  Copy ya Kitab yahan rakhein
                </span>
                <span className="text-[9px] text-slate-300/70 bg-black/60 px-2 py-0.5 rounded self-end">
                  {facingMode === 'environment' ? 'Back Camera (Copy)' : 'Front Camera'}
                </span>
              </div>

              {/* Camera Flip Button (Top Right) */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="Flip Camera (Front/Back)"
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-sm transition-all cursor-pointer active:scale-95 z-20 shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Hidden File Input for Gallery / Upload Fallback */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Action Controls Dock */}
        <div className="w-full flex items-center justify-center gap-6 pt-1 pb-1">
          {capturedImage ? (
            /* Pure Icon Buttons for Captured Image (No text labels) */
            <>
              <button
                type="button"
                onClick={handleRetake}
                disabled={isSubmitting}
                title="Dubara Photo Khincho"
                aria-label="Retake Photo"
                className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-600 flex items-center justify-center shadow-lg transition-all cursor-pointer active:scale-90 disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5 text-slate-200" />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                title="AI Teacher ko Bhejo"
                aria-label="Send Photo"
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-2 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center transition-all cursor-pointer active:scale-90 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <Check className="w-6 h-6 text-white stroke-[2.5]" />
                )}
              </button>
            </>
          ) : (
            /* Live Camera Shutter & Gallery Buttons */
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo from Gallery"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                <Upload className="w-4 h-4" />
              </button>

              {/* Central Shutter Button */}
              <button
                type="button"
                onClick={handleCapturePhoto}
                title="Photo Khinchein"
                className="w-14 h-14 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] border-4 border-cyan-400/70 transition-all cursor-pointer active:scale-90"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-600 border border-cyan-400 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={handleToggleFacingMode}
                title="Switch Camera (Front/Back)"
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

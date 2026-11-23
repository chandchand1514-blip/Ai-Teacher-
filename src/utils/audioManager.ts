/**
 * Audio helpers for Live API (PCM 16kHz input / 24kHz playback) and TTS WAV playback
 */

export function float32ToInt16PCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

export function resampleTo16kHz(inputData: Float32Array, originalSampleRate: number): Float32Array {
  if (!originalSampleRate || originalSampleRate === 16000) return inputData;
  const ratio = originalSampleRate / 16000;
  const newLength = Math.round(inputData.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const originIdx = Math.round(i * ratio);
    result[i] = inputData[originIdx] || 0;
  }
  return result;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToInt16Array(base64: string): Int16Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
}

export class LiveAudioSession {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private nextPlayTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isMuted = false;
  private pendingQueue: string[] = [];
  private resumeGestureHandler: (() => void) | null = null;
  private onStatusChange?: (status: 'connecting' | 'connected' | 'speaking' | 'listening' | 'disconnected' | 'error', message?: string) => void;
  private onAudioLevel?: (level: number) => void;
  private onProfileUpdated?: (profile: { name: string; grade: string; role?: string; islamicTitle?: string; lastTopic?: string; badges?: string[] }) => void;
  private onNameChangePending?: (data: any) => void;
  private onBoardUpdate?: (data: { content: string; caption?: string; clearFirst?: boolean; autoClearDelay?: number; practicePrompt?: string }) => void;
  private onExamReport?: (exam: any) => void;
  private onDrawingStudio?: (data: { open: boolean; topic?: string; instructions?: string; mode?: 'colorFill' | 'freehand' }) => void;
  private onDemonstrateDrawing?: (data: { topic: string; color?: string; message?: string }) => void;
  private onOpenColorFillBook?: (data: { sheetId?: string; guidance?: string }) => void;
  private onGuideColorStep?: (data: { partName: string; recommendedColor: string; colorsToAvoid?: string; interactiveQuestion?: string }) => void;
  private onAutoFillDrawing?: () => void;
  private onOpenWeeklyScheduleExam?: (data: { initialTab?: string; announcement?: string; userName?: string; password?: string; verified?: boolean }) => void;
  private onOpenExamReportModal?: (data: { announcement?: string; userName?: string }) => void;
  private onMicPermissionDenied?: (denied: boolean) => void;
  private onPresentLearningOptions?: (data: { previousTopic?: string; recommendedOption?: string; message?: string }) => void;
  private onHindiToEnglishLesson?: (data: { category?: string; hindiPhrase: string; englishPhrase: string; explanation?: string }) => void;
  private onTeachBodyParts?: (data: { hindiName: string; englishName: string; emoji?: string; quizQuestion?: string }) => void;
  private onBadgeAwarded?: (badge: { id: string; title: string; icon?: string; reason?: string }) => void;
  private onOpenStudentBadges?: () => void;
  private onAdminActionResult?: (data: any) => void;
  private onBoardZoomControl?: (data: { action: string; zoomLevel?: number }) => void;
  private onBoardScrollControl?: (data: { direction: string; amount?: number }) => void;
  private onBeQuiet?: () => void;
  private onPlayQuranRecitation?: (data: {
    audioUrl: string;
    surahId?: number;
    surahName?: string;
    surahNameArabic?: string;
    ayah?: number;
    reciter?: string;
    continuousMode?: boolean;
    fullQuran?: boolean;
    currentPara?: number;
    paraName?: string;
    paraNameArabic?: string;
    tracks?: Array<{
      type: 'surah' | 'ayah';
      paraId: number;
      surahId: number;
      surahName: string;
      surahNameArabic: string;
      ayah?: number;
      startAyah?: number;
      endAyah?: number;
      audioUrl: string;
    }>;
    trackIndex?: number;
    transLang?: string;
  }) => void;
  private onPlayMusicSong?: (data: {
    action: string;
    query?: string;
    track?: {
      id: string;
      title: string;
      artist: string;
      album?: string;
      duration?: number;
      image?: string;
      audioUrl: string;
      source?: string;
    };
    playlist?: Array<{
      id: string;
      title: string;
      artist: string;
      album?: string;
      duration?: number;
      image?: string;
      audioUrl: string;
      source?: string;
    }>;
    trackIndex?: number;
  }) => void;
  private onOpenComplaintModal?: (data: { complaintText?: string; studentName?: string; grade?: string }) => void;
  private onOpenExternalAppLink?: (data: { action: string; targetQuery?: string }) => void;
  private onMakePhoneCall?: (data: { phoneNumber: string; recipientName?: string }) => void;

  private isUserExplicitlyStarted = false;
  private isReconnecting = false;
  private reconnectTimer: any = null;
  private keepAliveInterval: any = null;
  private profileData: any = null;

  constructor(callbacks?: {
    onStatusChange?: (status: 'connecting' | 'connected' | 'speaking' | 'listening' | 'disconnected' | 'error', message?: string) => void;
    onAudioLevel?: (level: number) => void;
    onProfileUpdated?: (profile: { name: string; grade: string; role?: string; islamicTitle?: string; lastTopic?: string; badges?: string[] }) => void;
    onNameChangePending?: (data: any) => void;
    onBoardUpdate?: (data: { content: string; caption?: string; clearFirst?: boolean; autoClearDelay?: number; practicePrompt?: string }) => void;
    onExamReport?: (exam: any) => void;
    onDrawingStudio?: (data: { open: boolean; topic?: string; instructions?: string; mode?: 'colorFill' | 'freehand' }) => void;
    onDemonstrateDrawing?: (data: { topic: string; color?: string; message?: string }) => void;
    onOpenColorFillBook?: (data: { sheetId?: string; guidance?: string }) => void;
    onGuideColorStep?: (data: { partName: string; recommendedColor: string; colorsToAvoid?: string; interactiveQuestion?: string }) => void;
    onAutoFillDrawing?: () => void;
    onOpenWeeklyScheduleExam?: (data: { initialTab?: string; announcement?: string; userName?: string; password?: string; verified?: boolean }) => void;
    onOpenExamReportModal?: (data: { announcement?: string; userName?: string }) => void;
    onMicPermissionDenied?: (denied: boolean) => void;
    onPresentLearningOptions?: (data: { previousTopic?: string; recommendedOption?: string; message?: string }) => void;
    onHindiToEnglishLesson?: (data: { category?: string; hindiPhrase: string; englishPhrase: string; explanation?: string }) => void;
    onTeachBodyParts?: (data: { hindiName: string; englishName: string; emoji?: string; quizQuestion?: string }) => void;
    onBadgeAwarded?: (badge: { id: string; title: string; icon?: string; reason?: string }) => void;
    onOpenStudentBadges?: () => void;
    onAdminActionResult?: (data: any) => void;
    onBoardZoomControl?: (data: { action: string; zoomLevel?: number }) => void;
    onBoardScrollControl?: (data: { direction: string; amount?: number }) => void;
    onBeQuiet?: () => void;
    onPlayQuranRecitation?: (data: {
      audioUrl: string;
      surahId?: number;
      surahName?: string;
      surahNameArabic?: string;
      ayah?: number;
      reciter?: string;
      continuousMode?: boolean;
      fullQuran?: boolean;
      currentPara?: number;
      paraName?: string;
      paraNameArabic?: string;
      tracks?: Array<{
        type: 'surah' | 'ayah';
        paraId: number;
        surahId: number;
        surahName: string;
        surahNameArabic: string;
        ayah?: number;
        startAyah?: number;
        endAyah?: number;
        audioUrl: string;
      }>;
      trackIndex?: number;
      transLang?: string;
    }) => void;
    onPlayMusicSong?: (data: {
      action: string;
      query?: string;
      track?: {
        id: string;
        title: string;
        artist: string;
        album?: string;
        duration?: number;
        image?: string;
        audioUrl: string;
        source?: string;
      };
      playlist?: Array<{
        id: string;
        title: string;
        artist: string;
        album?: string;
        duration?: number;
        image?: string;
        audioUrl: string;
        source?: string;
      }>;
      trackIndex?: number;
    }) => void;
    onOpenComplaintModal?: (data: { complaintText?: string; studentName?: string; grade?: string }) => void;
    onOpenExternalAppLink?: (data: { action: string; targetQuery?: string }) => void;
    onMakePhoneCall?: (data: { phoneNumber: string; recipientName?: string }) => void;
  }) {
    this.onStatusChange = callbacks?.onStatusChange;
    this.onAudioLevel = callbacks?.onAudioLevel;
    this.onProfileUpdated = callbacks?.onProfileUpdated;
    this.onNameChangePending = callbacks?.onNameChangePending;
    this.onBoardUpdate = callbacks?.onBoardUpdate;
    this.onExamReport = callbacks?.onExamReport;
    this.onDrawingStudio = callbacks?.onDrawingStudio;
    this.onDemonstrateDrawing = callbacks?.onDemonstrateDrawing;
    this.onOpenColorFillBook = callbacks?.onOpenColorFillBook;
    this.onGuideColorStep = callbacks?.onGuideColorStep;
    this.onAutoFillDrawing = callbacks?.onAutoFillDrawing;
    this.onOpenWeeklyScheduleExam = callbacks?.onOpenWeeklyScheduleExam;
    this.onOpenExamReportModal = callbacks?.onOpenExamReportModal;
    this.onMicPermissionDenied = callbacks?.onMicPermissionDenied;
    this.onPresentLearningOptions = callbacks?.onPresentLearningOptions;
    this.onHindiToEnglishLesson = callbacks?.onHindiToEnglishLesson;
    this.onTeachBodyParts = callbacks?.onTeachBodyParts;
    this.onBadgeAwarded = callbacks?.onBadgeAwarded;
    this.onOpenStudentBadges = callbacks?.onOpenStudentBadges;
    this.onAdminActionResult = callbacks?.onAdminActionResult;
    this.onBoardZoomControl = callbacks?.onBoardZoomControl;
    this.onBoardScrollControl = callbacks?.onBoardScrollControl;
    this.onBeQuiet = callbacks?.onBeQuiet;
    this.onPlayQuranRecitation = callbacks?.onPlayQuranRecitation;
    this.onPlayMusicSong = callbacks?.onPlayMusicSong;
    this.onOpenComplaintModal = callbacks?.onOpenComplaintModal;
    this.onOpenExternalAppLink = callbacks?.onOpenExternalAppLink;
    this.onMakePhoneCall = callbacks?.onMakePhoneCall;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAudioPlayback();
    } else {
      if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
        this.outputAudioCtx.resume().catch(() => {});
      }
    }
  }

  getIsMuted() {
    return this.isMuted;
  }

  resumeAudio() {
    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }
    if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
      this.inputAudioCtx.resume().catch(() => {});
    }
  }

  updateRole(role: string, grade?: string, name?: string) {
    const payload = JSON.stringify({
      type: 'update_role',
      role,
      grade,
      name,
    });
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    } else {
      this.pendingQueue.push(payload);
    }
  }

  async start(profile?: {
    deviceId?: string;
    name?: string;
    grade?: string;
    role?: string;
    islamicTitle?: string;
    preferredLanguage?: string;
    hasDownloadedApp?: boolean;
    students?: Array<{ name: string; grade: string; role?: string; islamicTitle?: string }>;
    lastTopic?: string;
    visitCount?: number;
    clientHour?: number;
    clientMinutes?: number;
    clientTimezone?: string;
  }) {
    this.profileData = profile || {};
    this.isUserExplicitlyStarted = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.onStatusChange?.('connecting', 'Starting voice call...');

    // 1. Immediately unlock and resume speaker output AudioContext on user gesture
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!this.outputAudioCtx) {
      try {
        this.outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
      } catch (_) {
        this.outputAudioCtx = new AudioCtxClass();
      }
    }
    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      await this.outputAudioCtx.resume().catch(() => {});
    }
    this.nextPlayTime = this.outputAudioCtx.currentTime;

    // 2. Initialize microphone or fallback to audio output if restricted
    try {
      await this.initMicrophone();
      this.onMicPermissionDenied?.(false);
    } catch (err: any) {
      console.warn('[AudioManager] Microphone access restricted or unavailable, starting call with speaker audio:', err?.message || err);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('permission') ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.message?.toLowerCase().includes('not allowed');
      if (isDenied) {
        this.onMicPermissionDenied?.(true);
      }
      this.initFallbackAudio();
    }

    // 3. Connect WebSocket bridge to Gemini 3.8 Live API
    this.connectWebSocket();
  }

  private connectWebSocket() {
    if (!this.isUserExplicitlyStarted) return;

    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }

    this.onStatusChange?.('connecting', 'Connecting to Jarvis Live AI...');
    // On Vercel, route Live Voice to the Render backend; on Render/local, use same origin.
    const configuredBackend = (import.meta as any).env?.VITE_LIVE_BACKEND_URL as string | undefined;
    const backendBase = configuredBackend || (window.location.hostname.endsWith('vercel.app')
      ? 'https://ai-teacher-rd8u.onrender.com'
      : window.location.origin);
    const wsBase = backendBase.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:').replace(/\/$/, '');
    const wsUrl = `${wsBase}/live`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isReconnecting = false;
      // Send student profile for personalized memory & welcome back greeting
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'init', profile: this.profileData || {} }));
      }
      // Flush any user input or state messages queued before connection was open
      while (this.pendingQueue.length > 0) {
        const pendingItem = this.pendingQueue.shift();
        if (pendingItem && this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(pendingItem);
        }
      }
      this.onStatusChange?.('connected', 'Live API Connected. Initializing voice stream...');

      // Start ping keep-alive interval every 10 seconds to prevent network socket idle timeouts
      if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          try {
            this.ws.send(JSON.stringify({ type: 'ping' }));
          } catch (_) {}
        }
      }, 10000);
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'ready') {
          this.onStatusChange?.('listening', 'Jarvis is listening via Gemini 3.8 Live. Speak now!');
        } else if (msg.type === 'name_change_pending') {
          this.onNameChangePending?.(msg);
        } else if (msg.type === 'profile_updated' && msg.profile) {
          this.onProfileUpdated?.(msg.profile);
        } else if (msg.type === 'board_write') {
          this.onBoardUpdate?.({
            content: msg.content || '',
            caption: msg.caption || '',
            clearFirst: msg.clearFirst ?? true,
            autoClearDelay: msg.autoClearDelay || 0,
            practicePrompt: msg.practicePrompt || '',
          });
        } else if (msg.type === 'open_drawing_studio') {
          this.onDrawingStudio?.({
            open: true,
            topic: msg.topic || 'Free Drawing',
            instructions: msg.instructions || '',
            mode: msg.mode || 'freehand',
          });
        } else if (msg.type === 'close_drawing_studio') {
          this.onDrawingStudio?.({ open: false });
        } else if (msg.type === 'demonstrate_drawing') {
          this.onDemonstrateDrawing?.({
            topic: msg.topic || 'cat',
            color: msg.color,
            message: msg.message,
          });
        } else if (msg.type === 'open_color_fill_book') {
          this.onOpenColorFillBook?.({
            sheetId: msg.sheetId || 'flower',
            guidance: msg.guidance || '',
          });
        } else if (msg.type === 'guide_color_step') {
          this.onGuideColorStep?.({
            partName: msg.partName || '',
            recommendedColor: msg.recommendedColor || '',
            colorsToAvoid: msg.colorsToAvoid || '',
            interactiveQuestion: msg.interactiveQuestion || '',
          });
        } else if (msg.type === 'auto_fill_drawing') {
          this.onAutoFillDrawing?.();
        } else if (msg.type === 'open_weekly_schedule_exam') {
          this.onOpenWeeklyScheduleExam?.({
            initialTab: msg.initialTab || 'exam',
            announcement: msg.announcement || '',
            userName: msg.userName || '',
            password: msg.password || '',
            verified: Boolean(msg.verified),
          });
        } else if (msg.type === 'open_exam_report') {
          this.onOpenExamReportModal?.({
            announcement: msg.announcement || '',
            userName: msg.userName || '',
          });
        } else if (msg.type === 'present_learning_options') {
          this.onPresentLearningOptions?.({
            previousTopic: msg.previousTopic || '',
            recommendedOption: msg.recommendedOption || '',
            message: msg.message || '',
          });
        } else if (msg.type === 'hindi_to_english_lesson') {
          this.onHindiToEnglishLesson?.({
            category: msg.category || 'daily_sentences',
            hindiPhrase: msg.hindiPhrase || '',
            englishPhrase: msg.englishPhrase || '',
            explanation: msg.explanation || '',
          });
        } else if (msg.type === 'teach_body_parts') {
          this.onTeachBodyParts?.({
            hindiName: msg.hindiName || '',
            englishName: msg.englishName || '',
            emoji: msg.emoji || '',
            quizQuestion: msg.quizQuestion || '',
          });
        } else if (msg.type === 'exam_report' && msg.exam) {
          this.onExamReport?.(msg.exam);
        } else if (msg.type === 'badge_awarded' && msg.badge) {
          this.onBadgeAwarded?.(msg.badge);
        } else if (msg.type === 'open_student_badges') {
          this.onOpenStudentBadges?.();
        } else if (msg.type === 'admin_action_result') {
          this.onAdminActionResult?.(msg);
        } else if (msg.type === 'board_zoom_control') {
          this.onBoardZoomControl?.(msg);
        } else if (msg.type === 'board_scroll_control') {
          this.onBoardScrollControl?.(msg);
        } else if (msg.type === 'be_quiet') {
          this.stopAudioPlayback();
          this.onBeQuiet?.();
          this.onStatusChange?.('listening', 'Jarvis khamosh ho gayi. Aap agla command de sakte hain.');
        } else if (msg.type === 'play_quran_recitation') {
          this.onPlayQuranRecitation?.(msg);
        } else if (msg.type === 'play_music_song') {
          this.onPlayMusicSong?.(msg);
        } else if (msg.type === 'open_external_app_link') {
          this.onOpenExternalAppLink?.({ action: msg.action || '', targetQuery: msg.targetQuery || '' });
        } else if (msg.type === 'make_phone_call') {
          this.onMakePhoneCall?.({ phoneNumber: msg.phoneNumber || '', recipientName: msg.recipientName || '' });
        } else if (msg.type === 'open_complaint_modal') {
          this.onOpenComplaintModal?.(msg);
        } else if (msg.type === 'ui_config_updated' && msg.uiConfig) {
          try {
            window.dispatchEvent(new CustomEvent('ui_config_updated', { detail: msg.uiConfig }));
            window.dispatchEvent(new Event('app_config_updated'));
          } catch (_) {}
        } else if (msg.type === 'admin_panel_closed') {
          try {
            window.dispatchEvent(new Event('admin_panel_closed'));
          } catch (_) {}
        } else if (msg.type === 'blocked') {
          if (msg.deleted) {
            try {
              localStorage.removeItem('jarvis_student_profile');
              window.dispatchEvent(new CustomEvent('user_permanently_deleted', { detail: msg }));
            } catch (_) {}
          }
          this.stop();
          this.onStatusChange?.('error', msg.message || 'Aapka account Admin (Chand Sir) dwaara block kar diya gaya hai.');
        } else if (msg.type === 'audio' && msg.audio) {
          this.onStatusChange?.('speaking', 'Jarvis is responding...');
          this.playAudioChunk(msg.audio);
        } else if (msg.type === 'interrupted') {
          this.stopAudioPlayback();
          this.onStatusChange?.('listening', 'Jarvis paused. Listening to your command...');
        } else if (msg.type === 'turnComplete') {
          this.onStatusChange?.('listening', 'Jarvis finished speaking. Ready for your input.');
        } else if (msg.type === 'error') {
          this.onStatusChange?.('error', msg.message || 'Live session error.');
        }
      } catch (err) {
        console.warn('Error processing live WebSocket message:', err);
      }
    };

    this.ws.onerror = (err) => {
      console.warn('Live API WebSocket notice:', err);
      if (this.isUserExplicitlyStarted && !this.isReconnecting) {
        this.onStatusChange?.('connecting', 'Reconnecting live voice session...');
      }
    };

    this.ws.onclose = () => {
      if (this.keepAliveInterval) {
        clearInterval(this.keepAliveInterval);
        this.keepAliveInterval = null;
      }
      if (this.isUserExplicitlyStarted) {
        console.log('[LiveAudioSession] Socket closed while session active. Auto-reconnecting in background...');
        this.isReconnecting = true;
        this.onStatusChange?.('connecting', 'Reconnecting live voice call...');
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => {
          if (this.isUserExplicitlyStarted) {
            this.connectWebSocket();
          }
        }, 1200);
      } else {
        this.onStatusChange?.('disconnected', 'Live voice session ended.');
      }
    };
  }

  private async initMicrophone() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support audio recording (getUserMedia).');
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err: any) {
      console.warn('[AudioManager] Falling back to standard audio constraints for mobile device:', err?.message || err);
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (err2: any) {
        console.warn('[AudioManager] Falling back to basic audio stream:', err2?.message || err2);
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    }

    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    try {
      this.inputAudioCtx = new AudioCtxClass({ sampleRate: 16000 });
    } catch (_) {
      this.inputAudioCtx = new AudioCtxClass();
    }

    try {
      this.outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
    } catch (_) {
      this.outputAudioCtx = new AudioCtxClass();
    }

    // Explicitly resume audio contexts for mobile browsers
    if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
      await this.inputAudioCtx.resume().catch(() => {});
    }
    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      await this.outputAudioCtx.resume().catch(() => {});
    }

    this.nextPlayTime = this.outputAudioCtx.currentTime;

    const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
    this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(2048, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

      const inputData = e.inputBuffer.getChannelData(0);

      if (this.isMuted) {
        this.onAudioLevel?.(0);
        return;
      }

      // Compute volume level for HUD visualizer
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.onAudioLevel?.(Math.min(1, rms * 5));

      // Resample to 16kHz if input audio context is running at a different rate
      const actualSampleRate = this.inputAudioCtx ? this.inputAudioCtx.sampleRate : 16000;
      const pcm16Data = resampleTo16kHz(inputData, actualSampleRate);

      // Convert Float32 to 16-bit PCM
      const pcmBuffer = float32ToInt16PCM(pcm16Data);
      const base64Audio = arrayBufferToBase64(pcmBuffer);

      this.ws.send(JSON.stringify({ audio: base64Audio }));
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioCtx.destination);

    // Prevent Chrome GC from collecting audio nodes
    try {
      (window as any).__jarvis_script_processor = this.scriptProcessor;
      (window as any).__jarvis_audio_source = source;
    } catch (_) {}

    // Resume AudioContexts automatically on user gesture if browser suspended them during silence
    this.resumeGestureHandler = () => {
      if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
        this.inputAudioCtx.resume().catch(() => {});
      }
      if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
        this.outputAudioCtx.resume().catch(() => {});
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.resumeGestureHandler);
      window.addEventListener('touchstart', this.resumeGestureHandler);
      window.addEventListener('pointerdown', this.resumeGestureHandler);
      window.addEventListener('keydown', this.resumeGestureHandler);
    }
  }

  private initFallbackAudio() {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!this.outputAudioCtx) {
      try {
        this.outputAudioCtx = new AudioCtxClass({ sampleRate: 24000 });
      } catch (_) {
        this.outputAudioCtx = new AudioCtxClass();
      }
    }
    if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
      this.outputAudioCtx.resume().catch(() => {});
    }
    this.nextPlayTime = this.outputAudioCtx.currentTime;

    if (!this.inputAudioCtx) {
      try {
        this.inputAudioCtx = new AudioCtxClass({ sampleRate: 16000 });
      } catch (_) {
        this.inputAudioCtx = new AudioCtxClass();
      }
    }
    if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
      this.inputAudioCtx.resume().catch(() => {});
    }

    try {
      const osc = this.inputAudioCtx.createOscillator();
      const dst = this.inputAudioCtx.createMediaStreamDestination();
      const gain = this.inputAudioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(dst);
      osc.start();
      this.mediaStream = dst.stream;

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(2048, 1, 1);
      this.scriptProcessor.onaudioprocess = () => {};
      source.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.inputAudioCtx.destination);
    } catch (_) {}

    this.resumeGestureHandler = () => {
      if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
        this.inputAudioCtx.resume().catch(() => {});
      }
      if (this.outputAudioCtx && this.outputAudioCtx.state === 'suspended') {
        this.outputAudioCtx.resume().catch(() => {});
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', this.resumeGestureHandler);
      window.addEventListener('touchstart', this.resumeGestureHandler);
      window.addEventListener('pointerdown', this.resumeGestureHandler);
      window.addEventListener('keydown', this.resumeGestureHandler);
    }
  }

  private sendWsPayload(payload: any) {
    if (this.inputAudioCtx && this.inputAudioCtx.state === 'suspended') {
      this.inputAudioCtx.resume().catch(() => {});
    }
    const jsonStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(jsonStr);
    } else {
      this.pendingQueue.push(jsonStr);
    }
  }

  sendTextMessage(text: string) {
    this.sendWsPayload({ text });
    this.onStatusChange?.('speaking', 'Sending command to Jarvis...');
  }

  private playAudioChunk(base64Pcm: string) {
    if (!this.outputAudioCtx || this.isMuted || !this.isUserExplicitlyStarted) return;

    try {
      if (this.outputAudioCtx.state === 'suspended') {
        this.outputAudioCtx.resume();
      }

      const int16Array = base64ToInt16Array(base64Pcm);
      const float32Array = new Float32Array(int16Array.length);

      // Convert Int16 to Float32
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.outputAudioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioCtx.destination);

      const now = this.outputAudioCtx.currentTime;
      const startTime = Math.max(now, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index > -1) {
          this.activeSources.splice(index, 1);
        }
      };
    } catch (err) {
      console.error('Error playing live audio chunk:', err);
    }
  }

  private stopAudioPlayback() {
    this.activeSources.forEach((source) => {
      try {
        source.stop(0);
        source.disconnect();
      } catch (_) {}
    });
    this.activeSources = [];
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  sendText(text: string) {
    this.sendWsPayload({ text });
  }

  sendBoardImage(
    imageBase64: string,
    metadata?: { source?: string; mode?: string; topic?: string; sheetName?: string; progress?: string }
  ) {
    this.sendWsPayload({ type: 'board_image', image: imageBase64, ...(metadata || {}) });
  }

  sendDrawingStudioState(isOpen: boolean, topic?: string) {
    this.sendWsPayload({ type: 'drawing_studio_state', isOpen, topic });
  }

  requestJarvisDraw(topic?: string) {
    this.sendWsPayload({
      type: 'request_jarvis_draw',
      topic: topic || 'cat',
    });
  }

  requestAutoFill() {
    this.sendWsPayload({
      type: 'request_auto_fill',
    });
  }

  requestColorAdvice(sheetId?: string, partName?: string) {
    this.sendWsPayload({
      type: 'request_color_advice',
      sheetId: sheetId || 'drawing',
      partName: partName || 'current part',
    });
  }

  notifySheetCompleted(sheetId?: string) {
    this.sendWsPayload({
      type: 'sheet_completed',
      sheetId: sheetId || 'drawing',
    });
  }

  deleteProfile(name?: string) {
    this.sendWsPayload({
      type: 'delete_profile',
      name: name || '',
    });
  }

  updateProfile(name: string, grade: string, role?: string, preferredLanguage?: string, adminPassword?: string) {
    this.sendWsPayload({
      type: 'update_profile',
      name,
      grade,
      role: role || 'Basic User',
      preferredLanguage: preferredLanguage || 'Hinglish',
      adminPassword: adminPassword || '',
    });
  }

  resolveNameChange(action: 'keep' | 'delete' | 'add') {
    this.sendWsPayload({ type: 'resolve_name_change', action });
  }

  updateLanguage(language: string) {
    this.sendWsPayload({
      type: 'update_language',
      preferredLanguage: language || 'Hinglish',
    });
  }

  stop() {
    this.isUserExplicitlyStarted = false;
    this.isReconnecting = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }

    this.stopAudioPlayback();

    if (this.resumeGestureHandler && typeof window !== 'undefined') {
      window.removeEventListener('click', this.resumeGestureHandler);
      window.removeEventListener('touchstart', this.resumeGestureHandler);
      window.removeEventListener('pointerdown', this.resumeGestureHandler);
      window.removeEventListener('keydown', this.resumeGestureHandler);
      this.resumeGestureHandler = null;
    }

    try {
      delete (window as any).__jarvis_script_processor;
      delete (window as any).__jarvis_audio_source;
    } catch (_) {}

    if (this.scriptProcessor) {
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }

    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }

    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }

    this.pendingQueue = [];
    this.onStatusChange?.('disconnected', 'Live voice conversation stopped.');
  }
}

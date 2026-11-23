/**
 * OpenJarvis Live Voice Portal (gemini-3.8-live)
 * Ultra-Luxurious, Executive Voice AI Interface
 * Multi-layer reactive holographic core, dynamic ambient aura, & obsidian glass control dock
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  Eraser,
  Trophy,
  GraduationCap,
  X,
  ExternalLink,
  Palette,
  BookOpen,
  PenTool,
  Calendar,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Camera,
  Edit3,
  Mail,
} from 'lucide-react';
import { LiveAudioSession } from './utils/audioManager';
import { safeFetchJson } from './utils/safeFetch';
import { DrawingStudio } from './components/DrawingStudio';
import { ClassTextbookReaderModal } from './components/ClassTextbookReaderModal';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { WritingPracticePadModal } from './components/WritingPracticePadModal';
import { StudentBadgesModal } from './components/StudentBadgesModal';
import { AdminMessageReceivedModal, AdminUserMessage } from './components/AdminMessageReceivedModal';
import { ComplaintModal } from './components/ComplaintModal';
import { NotebookCameraModal } from './components/NotebookCameraModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { MicrophonePermissionModal, MicPermissionState } from './components/MicrophonePermissionModal';
import { computeStudentBadges, StudentBadge } from './utils/badgeManager';
import { GradeLevel, StudentRole } from './types';
import { generateReportCardPdf } from './utils/generateReportCardPdf';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { ApkInstallGuideModal, APK_DOWNLOAD_URL } from './components/ApkInstallGuideModal';


interface StudentItem {
  name: string;
  grade: string;
  role?: StudentRole;
  islamicTitle?: string;
}

interface ExamMistake {
  question: string;
  studentAnswer?: string;
  correctAnswer: string;
  topic?: string;
}

interface ExamResult {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  gradeLetter: string;
  mistakes: ExamMistake[];
  remedialCompleted?: boolean;
}

interface StudentProfile {
  name: string;
  grade: string;
  role?: StudentRole;
  islamicTitle?: string;
  preferredLanguage?: string;
  hasDownloadedApp?: boolean;
  students?: StudentItem[];
  lastTopic: string;
  visitCount: number;
  askedQuestionsHistory?: string[];
  learnedTopics?: string[];
  weeklyQuestionsTaught?: Array<{ question: string; topic: string; date: string }>;
  studyDaysLogged?: string[];
  lastExamDate?: string;
  examHistory?: ExamResult[];
  badges?: string[];
}

function getDeviceId(): string {
  try {
    let id = localStorage.getItem('jarvis_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem('jarvis_device_id', id);
    }
    return id;
  } catch (_) {
    return 'dev_default';
  }
}

// Dynamic font sizing for chalkboard based on text length and line count
function getChalkTextStyle(text: string): string {
  if (!text) return 'text-2xl sm:text-3xl';
  const trimmed = text.trim();
  const len = trimmed.length;
  const lines = trimmed.split('\n');
  const lineCount = lines.length;
  const maxLineLen = Math.max(...lines.map((l) => l.length), 0);

  // Very long text (e.g. 5+ lines or >150 chars) -> scale down to fit entire board cleanly
  if (lineCount >= 6 || len > 180 || maxLineLen > 36) {
    return 'text-xs sm:text-sm leading-snug tracking-normal';
  }
  // Moderately long (e.g. 4 lines or 80-180 chars)
  if (lineCount >= 4 || len > 80 || maxLineLen > 24) {
    return 'text-sm sm:text-base leading-relaxed tracking-wide';
  }
  // Medium text (e.g. 3 lines or 35-80 chars)
  if (lineCount >= 3 || len > 35 || maxLineLen > 18) {
    return 'text-base sm:text-lg leading-relaxed tracking-wider';
  }
  // Short phrase or equation (e.g. "12 × 12 = 144" or "PHOTOSYNTHESIS")
  if (lineCount >= 2 || len > 14 || maxLineLen > 10) {
    return 'text-lg sm:text-2xl leading-relaxed tracking-wider';
  }
  // Short word (e.g. "ELEPHANT", "APPLE", "5 + 7 = 12")
  if (len > 6 || maxLineLen > 6) {
    return 'text-2xl sm:text-3xl leading-snug tracking-wider font-semibold';
  }
  // Very short word or letter (e.g. "CAT", "A", "10") -> Big prominent chalk
  return 'text-3xl sm:text-4xl leading-tight tracking-widest font-bold';
}

const DEFAULT_INITIAL_BOARD = `📋 Sawaal / Question: 3x + 15 = 45 ko step-by-step hal karein.

★ Step 1: Dono taraf se 15 ghataayein (Subtract 15 from both sides):
   3x + 15 - 15 = 45 - 15
   3x = 30

★ Step 2: x ka maan nikaalne ke liye dono taraf 3 se bhaag karein (Divide both sides by 3):
   (3x) / 3 = 30 / 3
   x = 10

✅ Uttam! Sahi Jawab: x = 10

💡 Zoom Controls: Aap [-] aur [+] buttons se font zoom kar sakte hain!`;

export default function App() {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'disconnected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [boardContent, setBoardContent] = useState<string>(() => {
    try {
      return localStorage.getItem('jarvis_session_board') || '';
    } catch (_) {
      return '';
    }
  });
  const [boardCaption, setBoardCaption] = useState<string>(() => {
    try {
      return localStorage.getItem('jarvis_session_caption') || '';
    } catch (_) {
      return '';
    }
  });
  const [boardZoomLevel, setBoardZoomLevel] = useState<number>(100);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [activeExam, setActiveExam] = useState<ExamResult | null>(() => {
    try {
      const saved = localStorage.getItem('jarvis_session_exam');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [showExamReport, setShowExamReport] = useState<boolean>(false);

  // Zoom system only appears when there is extensive text ("dher sara likha hua rahega tabhi aana chahiye")
  const hasLotsOfContent = useMemo(() => {
    if (!boardContent) return false;
    const trimmed = boardContent.trim();
    if (!trimmed) return false;
    const lineCount = (trimmed.match(/\n/g) || []).length + 1;
    return trimmed.length >= 80 || lineCount >= 3 || boardZoomLevel !== 100;
  }, [boardContent, boardZoomLevel]);

  const handleDownloadReport = () => {
    const report = activeExam || profile.examHistory?.[0];
    if (!report) return;
    generateReportCardPdf(report);
  };
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [welcomeCountdown, setWelcomeCountdown] = useState<number>(5);
  const [typedTitleText, setTypedTitleText] = useState<string>('');
  const [isDrawingStudioOpen, setIsDrawingStudioOpen] = useState<boolean>(false);
  const [drawingStudioTopic, setDrawingStudioTopic] = useState<string>('Free Drawing');
  const [drawingStudioInstructions, setDrawingStudioInstructions] = useState<string>('');
  const [aiDemonstration, setAiDemonstration] = useState<{ topic: string; color?: string; message?: string; timestamp: number } | null>(null);
  const [initialDrawingStudioMode, setInitialDrawingStudioMode] = useState<'colorFill' | 'freehand'>('freehand');
  const [initialColorSheetId, setInitialColorSheetId] = useState<string>('flower');
  const [aiColorGuideStep, setAiColorGuideStep] = useState<{ partName: string; recommendedColor: string; colorsToAvoid?: string; interactiveQuestion?: string } | null>(null);
  const [autoFillTrigger, setAutoFillTrigger] = useState<number>(0);
  const [isDrawingVoiceMuted, setIsDrawingVoiceMuted] = useState<boolean>(false);
  const [isTextbookModalOpen, setIsTextbookModalOpen] = useState<boolean>(false);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'dashboard' | 'notifications' | 'users' | 'ads' | 'schedule' | 'exam' | 'security' | 'code' | 'complaints' | 'aicontrol'>('dashboard');
  const [isWritingPadModalOpen, setIsWritingPadModalOpen] = useState<boolean>(false);
  const [writingPadTargetWord, setWritingPadTargetWord] = useState<string>('झूला');
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [unlockedBadgeCelebration, setUnlockedBadgeCelebration] = useState<{ id: string; title: string; reason?: string } | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [adminRedirect, setAdminRedirect] = useState<boolean>(false);
  const [isApkGuideModalOpen, setIsApkGuideModalOpen] = useState<boolean>(false);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string>(APK_DOWNLOAD_URL);
  const [isDownloadButtonVisible, setIsDownloadButtonVisible] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('jarvis_download_btn_visible');
      if (saved !== null) return JSON.parse(saved);
    } catch (_) {}
    return true;
  });
  const [uiConfig, setUiConfig] = useState<{
    downloadButtonText: string;
    downloadButtonVisible: boolean;
    downloadButtonOnlyWhenLive?: boolean;
    profileVisible?: boolean;
    profileOnlyWhenLive?: boolean;
    blackboardTitle: string;
    blackboardVisible?: boolean;
    appHeaderTitle: string;
    subHeaderTitle?: string;
    customBannerText?: string;
  }>({
    downloadButtonText: 'Download',
    downloadButtonVisible: true,
    downloadButtonOnlyWhenLive: false,
    profileVisible: true,
    profileOnlyWhenLive: false,
    blackboardTitle: 'BLACKBOARD',
    blackboardVisible: true,
    appHeaderTitle: 'Teacher Jarvis',
    subHeaderTitle: 'AI Islamic & Academic Tutor',
    customBannerText: '',
  });

  const fetchUiConfig = useCallback(() => {
    safeFetchJson('/api/admin/ui-config')
      .then((data) => {
        if (data?.success && data?.uiConfig) {
          setUiConfig(data.uiConfig);
          if (data.uiConfig.downloadButtonVisible !== undefined) {
            const vis = Boolean(data.uiConfig.downloadButtonVisible);
            setIsDownloadButtonVisible(vis);
            try {
              localStorage.setItem('jarvis_download_btn_visible', JSON.stringify(vis));
            } catch (_) {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const [activeQuranRecitation, setActiveQuranRecitation] = useState<{
    audioUrl: string;
    surahId?: number;
    surahName?: string;
    surahNameArabic?: string;
    ayah?: number;
    reciter?: string;
    isPlaying: boolean;
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
  } | null>(null);
  const quranAudioRef = useRef<HTMLAudioElement | null>(null);
  const quranPreloadRef = useRef<HTMLAudioElement | null>(null);
  const quranStateRef = useRef<typeof activeQuranRecitation>(null);
  const startQuranPlaybackRef = useRef<(payload: Omit<NonNullable<typeof activeQuranRecitation>, 'isPlaying'>) => void>(() => {});

  interface MusicTrackItem {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration?: number;
    image?: string;
    audioUrl: string;
    source?: string;
  }

  const [activeMusicPlayer, setActiveMusicPlayer] = useState<{
    track: MusicTrackItem;
    playlist: MusicTrackItem[];
    trackIndex: number;
    isPlaying: boolean;
  } | null>(null);
  const [musicVolume, setMusicVolume] = useState<number>(0.8);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicStateRef = useRef<typeof activeMusicPlayer>(null);
  const startMusicPlaybackRef = useRef<(track: MusicTrackItem, playlist?: MusicTrackItem[], trackIndex?: number) => void>(() => {});

  const stopMusicPlayback = useCallback((clearBanner = false) => {
    if (musicAudioRef.current) {
      try {
        musicAudioRef.current.onended = null;
        musicAudioRef.current.onerror = null;
        musicAudioRef.current.pause();
      } catch (_) {}
      if (clearBanner) {
        musicAudioRef.current = null;
      }
    }
    if (clearBanner) {
      musicStateRef.current = null;
      setActiveMusicPlayer(null);
    } else if (musicStateRef.current) {
      const paused = { ...musicStateRef.current, isPlaying: false };
      musicStateRef.current = paused;
      setActiveMusicPlayer(paused);
    }
  }, []);

  const startMusicPlayback = useCallback((track: MusicTrackItem, playlist?: MusicTrackItem[], trackIndex: number = 0) => {
    // Pause Quran player if running so audio never clashes
    if (quranAudioRef.current) {
      try {
        quranAudioRef.current.pause();
        if (quranStateRef.current) {
          const stoppedQ = { ...quranStateRef.current, isPlaying: false };
          quranStateRef.current = stoppedQ;
          setActiveQuranRecitation(stoppedQ);
        }
      } catch (_) {}
    }

    if (musicAudioRef.current) {
      try {
        musicAudioRef.current.onended = null;
        musicAudioRef.current.onerror = null;
        musicAudioRef.current.pause();
      } catch (_) {}
    }

    const list = playlist && playlist.length > 0 ? playlist : [track];
    const safeIdx = Math.max(0, Math.min(list.length - 1, trackIndex));
    const currentTrack = list[safeIdx] || track;

    const nextState = {
      track: currentTrack,
      playlist: list,
      trackIndex: safeIdx,
      isPlaying: true,
    };
    musicStateRef.current = nextState;
    setActiveMusicPlayer(nextState);

    const audio = new Audio(currentTrack.audioUrl);
    audio.volume = musicVolume;
    musicAudioRef.current = audio;

    audio.play().catch((e) => {
      console.warn('[Music Audio Play blocked/failed]:', e);
    });

    audio.onended = () => {
      const cur = musicStateRef.current;
      if (!cur) return;
      if (cur.trackIndex + 1 < cur.playlist.length) {
        const nextIdx = cur.trackIndex + 1;
        startMusicPlaybackRef.current(cur.playlist[nextIdx], cur.playlist, nextIdx);
      } else {
        const ended = { ...cur, isPlaying: false };
        musicStateRef.current = ended;
        setActiveMusicPlayer(ended);
      }
    };

    audio.onerror = () => {
      console.warn('[Music Audio error]');
      const cur = musicStateRef.current;
      if (!cur) return;
      // Try next track in playlist automatically if current stream fails
      if (cur.trackIndex + 1 < cur.playlist.length) {
        const nextIdx = cur.trackIndex + 1;
        startMusicPlaybackRef.current(cur.playlist[nextIdx], cur.playlist, nextIdx);
      } else {
        const stopped = { ...cur, isPlaying: false };
        musicStateRef.current = stopped;
        setActiveMusicPlayer(stopped);
      }
    };
  }, []);
  startMusicPlaybackRef.current = startMusicPlayback;

  const loadQuranPara = useCallback(async (paraNum: number, transLang: string = 'hi', fullQuranFlag: boolean = true) => {
    const safePara = Math.max(1, Math.min(30, paraNum));
    try {
      const resp = await safeFetchJson(`/api/quran/para/${safePara}?lang=${encodeURIComponent(transLang)}`);
      if (resp?.success && resp.data?.tracks?.length > 0) {
        const paraData = resp.data;
        const firstTrack = paraData.tracks[0];
        if (resp.boardText) {
          setBoardContent(resp.boardText);
          setBoardCaption(`Al-Quran: Para ${safePara}/30 (${paraData.juzInfo?.nameTransliteration || ''}) • ${paraData.surahs?.length || 1} Surah(s) • Qari Mishary Al-Afasy`);
          boardScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
        startQuranPlaybackRef.current({
          audioUrl: firstTrack.audioUrl,
          surahId: firstTrack.surahId,
          surahName: firstTrack.surahName,
          surahNameArabic: firstTrack.surahNameArabic,
          ayah: firstTrack.ayah,
          reciter: 'Mishary Rashid Al-Afasy',
          continuousMode: true,
          fullQuran: fullQuranFlag,
          currentPara: safePara,
          paraName: paraData.juzInfo?.nameTransliteration,
          paraNameArabic: paraData.juzInfo?.nameArabic,
          tracks: paraData.tracks,
          trackIndex: 0,
          transLang,
        });
      }
    } catch (e) {
      console.warn('[Quran Auto-Advance Para Error]:', e);
    }
  }, []);

  const loadQuranSurah = useCallback(async (surahNum: number, transLang: string = 'hi', continuousFlag: boolean = true, fullQuranFlag: boolean = false) => {
    const safeSurah = Math.max(1, Math.min(114, surahNum));
    try {
      const resp = await safeFetchJson(`/api/quran/surah/${safeSurah}?lang=${encodeURIComponent(transLang)}`);
      if (resp?.success && resp.data) {
        const qData = resp.data;
        const verses: any[] = Array.isArray(qData.verses) ? qData.verses : [];
        let boardText = `✨ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ✨\n\n📖 ${qData.name || `سورة ${safeSurah}`} (${qData.transliteration || `Surah ${safeSurah}`})\n`;
        verses.forEach((v: any) => {
          boardText += `\n(${v.id}) ${v.text}`;
          if (v.translation) boardText += `\n👉 तर्जुमा: ${v.translation}\n`;
        });
        setBoardContent(boardText);
        setBoardCaption(`Al-Quran: Para ${qData.paraId || resp.paraId || 1}/30 • ${qData.transliteration || `Surah ${safeSurah}`} (${qData.name || ''}) - Tilawat Qari Mishary Al-Afasy`);
        boardScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

        startQuranPlaybackRef.current({
          audioUrl: qData.audioUrl || `https://server8.mp3quran.net/afs/${String(safeSurah).padStart(3, '0')}.mp3`,
          surahId: safeSurah,
          surahName: qData.transliteration || `Surah ${safeSurah}`,
          surahNameArabic: qData.name || '',
          reciter: 'Mishary Rashid Al-Afasy',
          continuousMode: continuousFlag,
          fullQuran: fullQuranFlag,
          currentPara: qData.paraId || resp.paraId || 1,
          transLang,
        });
      }
    } catch (e) {
      console.warn('[Quran Auto-Advance Surah Error]:', e);
    }
  }, []);

  const startQuranPlayback = useCallback((payload: Omit<NonNullable<typeof activeQuranRecitation>, 'isPlaying'>) => {
    stopMusicPlayback(true);
    if (quranAudioRef.current) {
      try {
        quranAudioRef.current.onended = null;
        quranAudioRef.current.onerror = null;
        quranAudioRef.current.pause();
      } catch (_) {}
    }

    const nextState = { ...payload, isPlaying: true };
    quranStateRef.current = nextState;
    setActiveQuranRecitation(nextState);

    const audio = new Audio(payload.audioUrl);
    quranAudioRef.current = audio;

    // Preload next track in Para playlist for zero-gap playback
    if (payload.tracks && typeof payload.trackIndex === 'number' && payload.trackIndex + 1 < payload.tracks.length) {
      try {
        const pre = new Audio(payload.tracks[payload.trackIndex + 1].audioUrl);
        pre.preload = 'auto';
        quranPreloadRef.current = pre;
      } catch (_) {}
    } else {
      quranPreloadRef.current = null;
    }

    audio.play().catch((e) => {
      console.warn('[Quran Audio Play blocked/failed]:', e);
    });

    audio.onended = () => {
      const cur = quranStateRef.current;
      if (!cur) return;

      const idx = cur.trackIndex ?? 0;
      if (cur.tracks && idx + 1 < cur.tracks.length) {
        const nextTrack = cur.tracks[idx + 1];
        startQuranPlaybackRef.current({
          ...cur,
          audioUrl: nextTrack.audioUrl,
          surahId: nextTrack.surahId,
          surahName: nextTrack.surahName,
          surahNameArabic: nextTrack.surahNameArabic,
          ayah: nextTrack.ayah,
          currentPara: nextTrack.paraId || cur.currentPara,
          trackIndex: idx + 1,
        });
        return;
      }

      if (cur.continuousMode || cur.fullQuran) {
        if (cur.tracks && cur.tracks.length > 0 && (cur.currentPara || 1) < 30) {
          loadQuranPara((cur.currentPara || 1) + 1, cur.transLang || 'hi', Boolean(cur.fullQuran || cur.continuousMode));
          return;
        }
        if (!cur.tracks && (cur.surahId || 1) < 114) {
          loadQuranSurah((cur.surahId || 1) + 1, cur.transLang || 'hi', true, Boolean(cur.fullQuran));
          return;
        }
      }

      const stopped = { ...cur, isPlaying: false };
      quranStateRef.current = stopped;
      setActiveQuranRecitation(stopped);
    };

    audio.onerror = () => {
      console.warn('[Quran Audio playback error]');
      const cur = quranStateRef.current;
      if (!cur) return;
      const stopped = { ...cur, isPlaying: false };
      quranStateRef.current = stopped;
      setActiveQuranRecitation(stopped);
    };
  }, [loadQuranPara, loadQuranSurah]);
  startQuranPlaybackRef.current = startQuranPlayback;

  const fetchAppConfig = useCallback(() => {
    fetchUiConfig();
    const devId = getDeviceId();
    let sName = '';
    try {
      const saved = localStorage.getItem('jarvis_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') sName = parsed.name.trim();
      }
    } catch (_) {}

    const query = new URLSearchParams({
      deviceId: devId,
      studentName: sName,
    }).toString();

    safeFetchJson(`/api/app-config?${query}`)
      .then(data => {
        if (data?.success && data.config) {
          if (data.config.apkDownloadUrl) setApkDownloadUrl(data.config.apkDownloadUrl);
          if (data.config.isDownloadButtonVisible !== undefined) {
            setIsDownloadButtonVisible(Boolean(data.config.isDownloadButtonVisible));
          }
        }
      })
      .catch(() => {});
  }, [fetchUiConfig]);

  const [receivedAdminMessage, setReceivedAdminMessage] = useState<AdminUserMessage | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);

  const fetchUserMessages = useCallback(() => {
    if (isChatModalOpen) {
      setReceivedAdminMessage(null);
      return;
    }
    const devId = getDeviceId();
    let sName = '';
    try {
      const saved = localStorage.getItem('jarvis_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.name === 'string') sName = parsed.name.trim();
      }
    } catch (_) {}

    const query = new URLSearchParams({
      deviceId: devId,
      studentName: sName,
    }).toString();

    safeFetchJson(`/api/user-messages?${query}`)
      .then((data) => {
        if (data?.success && Array.isArray(data.messages) && data.messages.length > 0) {
          const unread = data.messages[0];
          setReceivedAdminMessage(unread);
        } else {
          setReceivedAdminMessage(null);
        }
      })
      .catch(() => {});
  }, [isChatModalOpen]);

  const handleAcknowledgeAdminMessage = (msgId: string) => {
    safeFetchJson('/api/user-messages/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: msgId }),
    }).catch(() => {});
    setReceivedAdminMessage(null);
    setIsMessageModalOpen(false);
  };

  useEffect(() => {
    if (isChatModalOpen && receivedAdminMessage) {
      handleAcknowledgeAdminMessage(receivedAdminMessage.id);
    }
  }, [isChatModalOpen, receivedAdminMessage]);

  useEffect(() => {
    // Auto-register student/device profile in backend so they immediately show up in Total Users list
    const devId = getDeviceId();
    safeFetchJson('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: devId,
        name: profile.name,
        grade: profile.grade,
        role: profile.role,
        islamicTitle: profile.islamicTitle,
        preferredLanguage: profile.preferredLanguage,
        deviceType: navigator.userAgent,
      }),
    })
      .then((data) => {
        if (data?.deleted) {
          try {
            localStorage.removeItem('jarvis_student_profile');
          } catch (_) {}
          setProfile((prev) => ({ ...prev, name: '', role: 'Basic User', islamicTitle: undefined, students: [], lastTopic: '' }));
        }
      })
      .catch(() => {});

    fetchAppConfig();
    fetchUserMessages();
    const interval = setInterval(() => {
      fetchAppConfig();
      fetchUserMessages();
    }, 3000);
    const handleUpdate = () => {
      fetchAppConfig();
      fetchUserMessages();
    };

    const handlePermanentlyDeleted = () => {
      try {
        localStorage.removeItem('jarvis_student_profile');
      } catch (_) {}
      setProfile({
        name: '',
        grade: 'Class 2',
        role: 'Basic User',
        preferredLanguage: 'Hinglish',
        hasDownloadedApp: false,
        students: [],
        lastTopic: '',
        visitCount: 0,
      });
    };

    const handleAdminPanelClosed = () => {
      fetchAppConfig();
      if (sessionRef.current) {
        sessionRef.current.sendText('[SYSTEM_NOTIFICATION]: Chand Sir ne Admin Panel band kar diya hai aur ab screen par wapas aa gaye hain. Briefly acknowledge: "Admin Panel band ho gaya hai, hum wapas screen par hain!" (RULE #0: If Chand Sir says "Suno" or gives any command, immediately drop greeting/Namaste, listen first, and execute what he says.)');
      }
    };

    const handleUiConfigEvent = (e: any) => {
      if (e?.detail) {
        setUiConfig(e.detail);
        if (e.detail.downloadButtonVisible !== undefined) {
          const vis = Boolean(e.detail.downloadButtonVisible);
          setIsDownloadButtonVisible(vis);
          try {
            localStorage.setItem('jarvis_download_btn_visible', JSON.stringify(vis));
          } catch (_) {}
        }
      } else {
        fetchUiConfig();
      }
    };

    window.addEventListener('app_config_updated', handleUpdate);
    window.addEventListener('ui_config_updated', handleUiConfigEvent);
    window.addEventListener('admin_panel_closed', handleAdminPanelClosed);
    window.addEventListener('user_permanently_deleted', handlePermanentlyDeleted);
    window.addEventListener('focus', handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('app_config_updated', handleUpdate);
      window.removeEventListener('ui_config_updated', handleUiConfigEvent);
      window.removeEventListener('admin_panel_closed', handleAdminPanelClosed);
      window.removeEventListener('user_permanently_deleted', handlePermanentlyDeleted);
      window.removeEventListener('focus', handleUpdate);
    };
  }, [fetchAppConfig, fetchUserMessages, fetchUiConfig]);



  const handleSaveProfile = async (newName: string, newGrade: string, newRole?: StudentRole, newLanguage?: string, adminPassword?: string, action?: 'keep' | 'delete' | 'add') => {
    const trimmed = newName.trim();
    const roleToUse = newRole || profile.role || 'Basic User';
    const titleToUse = (roleToUse && roleToUse !== 'Basic User') ? roleToUse : '';
    const languageToUse = newLanguage || profile.preferredLanguage || 'Hinglish';
    const oldName = (profile.name || '').trim();
    if (!action && oldName && trimmed && oldName.toLowerCase() !== trimmed.toLowerCase() && !oldName.toLowerCase().includes('chand') && !trimmed.toLowerCase().includes('chand')) {
      setPendingManualNameChange({ name: trimmed, grade: newGrade, role: roleToUse, language: languageToUse, adminPassword });
      setNameChangeConfirmation({ oldName, newName: trimmed, source: 'manual' });
      return;
    }
    if (action === 'keep') { setPendingManualNameChange(null); setNameChangeConfirmation(null); return; }


    const existingStudents: StudentItem[] = profile.students?.length ? profile.students : (profile.name ? [{ name: profile.name, grade: profile.grade || 'Class 2', role: profile.role, islamicTitle: profile.islamicTitle }] : []);
    const updatedStudents: StudentItem[] = action === 'add'
      ? [...existingStudents, ...(trimmed && !existingStudents.some(s => s.name.toLowerCase() === trimmed.toLowerCase()) ? [{ name: trimmed, grade: newGrade, role: roleToUse, islamicTitle: titleToUse }] : [])]
      : trimmed ? [{ name: trimmed, grade: newGrade, role: roleToUse, islamicTitle: titleToUse }] : [];
    const displayName = updatedStudents.map(s => s.name).join(' & ');

    try {
      const data = await safeFetchJson('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          name: displayName,
          grade: newGrade,
          role: roleToUse,
          islamicTitle: titleToUse,
          preferredLanguage: languageToUse,
          students: updatedStudents,
          adminPassword: adminPassword || '',
          replacePreviousName: action === 'delete' ? oldName : '',
        }),
      });

      if (data && data.success === false) {
        alert(data.error || 'Password galat hai! Chand naam set nahi ho saka.');
        return;
      }

      setProfile((prev) => {
        const updated: StudentProfile = {
          ...prev,
          name: displayName,
          grade: newGrade,
          role: roleToUse,
          islamicTitle: titleToUse,
          preferredLanguage: languageToUse,
          students: updatedStudents,
        };
        try {
          localStorage.setItem('jarvis_student_profile', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });

      if (sessionRef.current) {
        sessionRef.current.updateProfile(displayName, newGrade, roleToUse, languageToUse, adminPassword);
        sessionRef.current.sendText(`[SYSTEM_NOTIFICATION - MANUAL PROFILE UPDATE]: The user manually saved the student profile. Previous profile name: ${oldName || 'not set'}. Current profile students (authoritative): ${updatedStudents.length ? updatedStudents.map((s, i) => `${i + 1}. ${s.name} (Class/Grade: ${s.grade || 'not specified'}, Position: ${s.role || 'Standard'})`).join('; ') : 'No student name set'}. Current profile grade: ${newGrade}. Position: ${roleToUse}. Preferred language: ${languageToUse}. Immediately acknowledge the update warmly using your EXISTING AI Teacher voice, address the newly saved student(s) by their correct name(s), and from now on use this profile for greetings, teaching, grade-appropriate explanations, and personalization. If multiple students are listed, treat them as separate students and do not treat the combined display name as one person. Do not use any other voice or assistant.`);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const handleDeleteProfile = () => {
    const previousName = profile.name || 'Arbaaz';
    setProfile((prev) => {
      const updated: StudentProfile = {
        ...prev,
        name: '',
        students: [],
      };
      try {
        localStorage.setItem('jarvis_student_profile', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        name: '',
        deleteName: true,
        action: 'delete',
        students: [],
      }),
    }).catch(() => {});

    if (sessionRef.current) {
      sessionRef.current.deleteProfile(previousName);
    }
  };

  const handleSpeakText = (text: string) => {
    // Disabled browser speech synthesis so only AI Teacher voice speaks.
  };

  const handleCameraPhotoSubmit = async (base64Image: string) => {
    try {
      // User requirement: "board mein jo bhi likha hua rahega pahle Se vah hat Jana chahie"
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      setHasDrawn(false);
      setBoardContent('');
      setBoardCaption('');
      setBoardZoomLevel(100);

      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

      if (sessionRef.current) {
        sessionRef.current.sendBoardImage(cleanBase64, { source: 'camera_photo' });
        sessionRef.current.sendText(
          `[STUDENT_ACTION - CAMERA PHOTO SENT]:
The student just took a photo with their camera and sent it to you!
LOOK AT THE LIVE CAMERA FRAME IMAGE RIGHT NOW WITH YOUR VISION:
1. Accurately identify what is in the photo (question, handwritten problem, math equation, or object like a bottle, book, etc.).
2. Speak out loud immediately in warm, friendly Hinglish explaining what you see and giving the exact answer or solution!
3. Also, write ONLY the direct answer/solution cleanly on the student's blackboard using the write_on_board tool!
4. Finally, tell them verbally: "Aap isko apni copy mein note kar lijiye!"`
        );
      } else {
        const data = await safeFetchJson('/api/vision/analyze-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            studentName: profile.name || 'Student',
            grade: profile.grade || 'Class 2',
            deviceId: getDeviceId(),
            purpose: 'notes_check',
          }),
        });
        const feedback = data?.feedback || 'Maine photo dekh liya hai!';
        const boardNotes = data?.boardNotes || data?.answer || feedback;
        setBoardContent(boardNotes);
        setBoardCaption('Sawal aur Jawab');
        setBoardZoomLevel(100);
        if (boardScrollRef.current) {
          boardScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        handleSpeakText(`${feedback} Aap isko apni copy mein note kar lijiye!`);
      }

      return { success: true, feedback: 'Photo bhej di gayi hai!', isCorrect: true };
    } catch (err: any) {
      console.error('Failed to submit copy photo:', err);
      return { success: false, feedback: 'Photo bhejne me samasya aayi.' };
    }
  };

  const [micState, setMicState] = useState<MicPermissionState>(() => {
    try {
      if (localStorage.getItem('jarvis_mic_granted') === 'true') {
        return 'granted';
      }
    } catch (_) {}
    return 'prompt';
  });
  const [isMicModalOpen, setIsMicModalOpen] = useState<boolean>(false);
  const [isMicDenied, setIsMicDenied] = useState<boolean>(false);

  // Monitor navigator permissions for real-time microphone permission state
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'denied') {
            setIsMicDenied(true);
            setMicState('denied');
          } else if (permissionStatus.state === 'granted') {
            setIsMicDenied(false);
            setMicState('granted');
            try {
              localStorage.setItem('jarvis_mic_granted', 'true');
            } catch (_) {}
          } else {
            setMicState('prompt');
          }
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'denied') {
              setIsMicDenied(true);
              setMicState('denied');
            } else if (permissionStatus.state === 'granted') {
              setIsMicDenied(false);
              setMicState('granted');
              try {
                localStorage.setItem('jarvis_mic_granted', 'true');
              } catch (_) {}
            } else {
              setMicState('prompt');
            }
          };
        })
        .catch(() => {});
    }
  }, []);

  const requestMicPermission = async (): Promise<boolean> => {
    setMicState('requesting');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsMicDenied(true);
        setMicState('denied');
        return false;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsMicDenied(false);
      setMicState('granted');
      try {
        localStorage.setItem('jarvis_mic_granted', 'true');
      } catch (_) {}
      return true;
    } catch (err: any) {
      console.warn('[Microphone Permission Error]:', err);
      setIsMicDenied(true);
      setMicState('denied');
      return false;
    }
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const autoVisionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoClearBoardTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Persistent student memory in background
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('jarvis_student_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            name: typeof parsed.name === 'string' ? parsed.name : '',
            grade: parsed.grade || 'Class 2',
            role: parsed.role || 'Basic User',
            islamicTitle: parsed.islamicTitle,
            preferredLanguage: parsed.preferredLanguage || 'Hinglish',
            hasDownloadedApp: Boolean(parsed.hasDownloadedApp),
            students: Array.isArray(parsed.students) ? parsed.students : [],
            lastTopic: parsed.lastTopic || 'ABCD, Math Multiplication Tables, and Science',
            visitCount: Number(parsed.visitCount) || 0,
            askedQuestionsHistory: parsed.askedQuestionsHistory,
            learnedTopics: parsed.learnedTopics,
            weeklyQuestionsTaught: parsed.weeklyQuestionsTaught,
            studyDaysLogged: parsed.studyDaysLogged,
            lastExamDate: parsed.lastExamDate,
            examHistory: parsed.examHistory,
            badges: parsed.badges,
          };
        }
      }
    } catch (_) {}
    return {
      name: '',
      grade: 'Class 2',
      role: 'Basic User',
      preferredLanguage: 'Hinglish',
      hasDownloadedApp: false,
      students: [],
      lastTopic: 'ABCD, Math Multiplication Tables, and Science',
      visitCount: 0,
    };
  });

  const sessionRef = useRef<LiveAudioSession | null>(null);
  const [nameChangeConfirmation, setNameChangeConfirmation] = useState<any>(null);
  const [pendingManualNameChange, setPendingManualNameChange] = useState<any>(null);

  // Save profile to localStorage on change and sync with backend
  useEffect(() => {
    try {
      localStorage.setItem('jarvis_student_profile', JSON.stringify(profile));
    } catch (_) {}
  }, [profile]);

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (adminRedirect) {
      navigate('/admin');
      setAdminRedirect(false);
    }
  }, [adminRedirect, navigate]);



  // Save boardContent & activeExam to localStorage for Session Resume persistence
  useEffect(() => {
    try {
      localStorage.setItem('jarvis_session_board', boardContent);
      localStorage.setItem('jarvis_session_caption', boardCaption);
      if (activeExam) {
        localStorage.setItem('jarvis_session_exam', JSON.stringify(activeExam));
      } else {
        localStorage.removeItem('jarvis_session_exam');
      }
    } catch (_) {}
  }, [boardContent, boardCaption, activeExam]);

  // Sync profile on mount from server memory & immediately register device so it appears in Admin Panel
  useEffect(() => {
    const devId = getDeviceId();
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? (/iPhone|iPad|iPod/i.test(ua) ? 'Apple iOS' : 'Android Mobile') : 'Desktop Browser';

    // 1. Instantly register device with server (guarantees device is visible in Admin Panel immediately)
    safeFetchJson('/api/device/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: devId,
        deviceType,
        name: profile.name || '',
        grade: profile.grade || 'Class 1',
        role: profile.role || 'Basic User',
        preferredLanguage: profile.preferredLanguage || 'Hinglish',
        hasDownloadedApp: Boolean(profile.hasDownloadedApp),
      }),
    })
      .then((regData) => {
        if (regData?.deleted) {
          try {
            localStorage.removeItem('jarvis_student_profile');
          } catch (_) {}
          setProfile({
            name: '',
            grade: 'Class 2',
            role: 'Basic User',
            preferredLanguage: 'Hinglish',
            hasDownloadedApp: false,
            students: [],
            lastTopic: '',
            visitCount: 0,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch existing server profile memory
    safeFetchJson(`/api/profile?deviceId=${devId}`)
      .then((data) => {
        if (data?.deleted) {
          try {
            localStorage.removeItem('jarvis_student_profile');
          } catch (_) {}
          setProfile({
            name: '',
            grade: 'Class 2',
            role: 'Basic User',
            preferredLanguage: 'Hinglish',
            hasDownloadedApp: false,
            students: [],
            lastTopic: '',
            visitCount: 0,
          });
          return;
        }
        setProfile((prev) => {
          const newVisitCount = Math.max((prev.visitCount || 0) + 1, (data?.profile?.visitCount || 0) + 1);
          const merged: StudentProfile = {
            ...prev,
            name: (data?.profile?.name !== undefined && data.profile.name) ? data.profile.name : prev.name,
            grade: data?.profile?.grade || prev.grade,
            role: data?.profile?.role || prev.role || 'Basic User',
            islamicTitle: data?.profile?.islamicTitle || prev.islamicTitle,
            preferredLanguage: data?.profile?.preferredLanguage || prev.preferredLanguage || 'Hinglish',
            hasDownloadedApp: data?.profile?.hasDownloadedApp !== undefined ? Boolean(data.profile.hasDownloadedApp) : prev.hasDownloadedApp,
            students: Array.isArray(data?.profile?.students) ? data.profile.students : prev.students,
            lastTopic: data?.profile?.lastTopic || prev.lastTopic,
            visitCount: newVisitCount,
          };
          try {
            localStorage.setItem('jarvis_student_profile', JSON.stringify(merged));
          } catch (_) {}
          return merged;
        });
      })
      .catch(() => {});
  }, []);

  // Letter-by-letter typewriter animation for AI Teacher on welcome screen
  useEffect(() => {
    if (!showWelcomeModal) return;
    const fullText = 'AI Teacher';
    let index = 0;
    setTypedTitleText('');
    const timer = setInterval(() => {
      index++;
      setTypedTitleText(fullText.slice(0, index));
      if (index >= fullText.length) {
        clearInterval(timer);
      }
    }, 180);
    return () => clearInterval(timer);
  }, [showWelcomeModal]);

  // Auto-dismiss welcome modal after 5 seconds: ONLY close modal, do NOT auto start session
  // User explicitly instructed: "Start voice call dabaenge tabhi dikhai Dena chahie usse pahle Nahin dikhai Dena chahie"
  useEffect(() => {
    if (showWelcomeModal) {
      const interval = setInterval(() => {
        setWelcomeCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowWelcomeModal(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showWelcomeModal]);

  const handleWelcomeStartWithMic = async () => {
    setShowWelcomeModal(false);
    requestMicPermission().catch(() => {});
    startSession().catch(() => {});
  };

  const isLiveActive = status === 'listening' || status === 'speaking' || status === 'connected' || status === 'connecting';

  const startSession = async () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
    }
    setErrorMessage('');
    setStatus('connecting');

    // Increment visit count
    const updatedProfile = {
      ...profile,
      visitCount: (profile.visitCount || 0) + 1,
    };
    setProfile(updatedProfile);

    const session = new LiveAudioSession({
      onStatusChange: (newStatus, msg) => {
        console.log('[LiveAudioSession status changed]:', newStatus, msg);
        setStatus(newStatus);
        if (newStatus === 'error') {
          const isDenied =
            msg?.toLowerCase().includes('permission') ||
            msg?.toLowerCase().includes('denied') ||
            msg?.toLowerCase().includes('not allowed');
          if (isDenied) {
            setIsMicDenied(true);
          }
          setErrorMessage(msg || 'Microphone access denied. Please tap to allow microphone.');
        } else if (newStatus === 'listening' || newStatus === 'speaking' || newStatus === 'connected') {
          setErrorMessage('');
        }
      },
      onMicPermissionDenied: (denied: boolean) => {
        setIsMicDenied(denied);
      },
      onAudioLevel: (lvl) => {
        console.log('[LiveAudioSession audio level]:', lvl);
        setAudioLevel(lvl);
      },
      onNameChangePending: (data: any) => {
        setNameChangeConfirmation(data);
        sessionRef.current?.sendTextMessage(data.message || `Aapka naam ${data.oldName} se ${data.newName} badalne ki request hai. Purana naam rakhne ke liye Keep, purana profile replace karne ke liye Delete, ya dono students rakhne ke liye Add dabayein.`);
      },
      onProfileUpdated: (newProfile: any) => {
        setProfile((prev) => {
          const newName = newProfile.name !== undefined ? (newProfile.name ? String(newProfile.name).trim() : '') : prev.name;
          const newGrade = newProfile.grade || prev.grade || 'Class 2';

          let updatedStudents: StudentItem[] = [];
          if (!newName) {
            updatedStudents = [];
          } else if (Array.isArray(newProfile.students) && newProfile.students.length > 0) {
            updatedStudents = newProfile.students;
          } else {
            updatedStudents = [{ name: newName, grade: newGrade || 'Class 1' }];
          }

          const merged: StudentProfile = {
            ...prev,
            name: newName,
            grade: newGrade,
            role: newProfile.role !== undefined ? newProfile.role : prev.role,
            islamicTitle: newProfile.islamicTitle !== undefined ? newProfile.islamicTitle : prev.islamicTitle,
            students: updatedStudents,
            lastTopic: newProfile.lastTopic || prev.lastTopic,
          };
          try {
            localStorage.setItem('jarvis_student_profile', JSON.stringify(merged));
            fetch('/api/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...merged, deviceId: getDeviceId() }),
            }).catch(() => {});
          } catch (_) {}
          return merged;
        });
      },
      onBoardUpdate: (data) => {
        // Clear any previous auto-clear timer
        if (autoClearBoardTimeoutRef.current) {
          clearTimeout(autoClearBoardTimeoutRef.current);
          autoClearBoardTimeoutRef.current = null;
        }

        if (data.clearFirst) {
          setBoardContent(data.content);
        } else {
          setBoardContent((prev) => (prev ? `${prev}\n${data.content}` : data.content));
        }
        if (data.caption !== undefined) {
          setBoardCaption(data.caption);
        }

        // Keep content visible on blackboard! It should NOT vanish quickly.
        // It remains on the board until the next question is asked or user explicitly answers/clears it.
        // Only if autoClearDelay is explicitly positive and > 0, we honor it (otherwise default to persistent display 0).
        if (data.autoClearDelay && data.autoClearDelay > 0) {
          autoClearBoardTimeoutRef.current = setTimeout(() => {
            setBoardContent('');
            if (data.practicePrompt) {
              setBoardCaption(data.practicePrompt);
            }
          }, data.autoClearDelay * 1000);
        }
      },
      onExamReport: (examData: ExamResult) => {
        setActiveExam(examData);
        setShowExamReport(true);
        // Also update local profile examHistory
        setProfile((prev) => {
          const list = prev.examHistory || [];
          return {
            ...prev,
            examHistory: [examData, ...list].slice(0, 20),
            lastExamDate: new Date().toISOString(),
          };
        });
      },
      onDrawingStudio: (data) => {
        setIsDrawingStudioOpen(data.open);
        if (data.topic) setDrawingStudioTopic(data.topic);
        if (data.instructions) setDrawingStudioInstructions(data.instructions);
        if (data.mode) setInitialDrawingStudioMode(data.mode);
      },
      onDemonstrateDrawing: (data) => {
        setIsDrawingStudioOpen(true);
        if (data.topic) setDrawingStudioTopic(data.topic);
        setAiDemonstration({
          topic: data.topic,
          color: data.color,
          message: data.message,
          timestamp: Date.now(),
        });
      },
      onOpenColorFillBook: (data) => {
        setIsDrawingStudioOpen(true);
        setInitialDrawingStudioMode('colorFill');
        if (data.sheetId) setInitialColorSheetId(data.sheetId);
        if (data.guidance) setDrawingStudioInstructions(data.guidance);
      },
      onGuideColorStep: (data) => {
        setAiColorGuideStep(data);
      },
      onAutoFillDrawing: () => {
        setAutoFillTrigger(Date.now());
      },
      onOpenWeeklyScheduleExam: (data) => {
        // STRICT USER LOCK: This page must NEVER be opened by general users!
        // ONLY user "Chand" is permitted to open this page.
        const currentName = (profile.name || '').toLowerCase();
        const incomingUser = (data?.userName || '').toLowerCase();
        const isChand = currentName.includes('chand') || incomingUser.includes('chand');

        const isVerified = Boolean(data?.verified);
        if (isChand && isVerified) {
          const targetTab = (data?.initialTab && ['dashboard', 'notifications', 'users', 'ads', 'schedule', 'exam', 'security', 'code', 'complaints', 'aicontrol'].includes(data.initialTab))
            ? (data.initialTab as any)
            : 'dashboard';
          setAdminInitialTab(targetTab);
          setIsAdminVerified(true);
          setAdminRedirect(true);
        } else {
          console.warn('[Admin Panel Lock] Access restricted to verified Chand only.');
        }
      },
      onOpenExamReportModal: (data) => {
        // STRICT USER LOCK: Exam page must ONLY open for user "Chand"!
        const currentName = (profile.name || '').trim().toLowerCase();
        const incomingName = (data?.userName || '').trim().toLowerCase();
        const isChand = currentName.includes('chand') || incomingName.includes('chand');

        if (!isChand) {
          console.warn('[Exam Report Lock] Access Denied: Exam page is strictly restricted to user Chand.');
          return;
        }

        setProfile((prev) => {
          if (!activeExam && (!prev.examHistory || prev.examHistory.length === 0)) {
            const fallbackExam: ExamResult = {
              id: 'exam_' + Date.now(),
              studentName: prev.name || 'Chand',
              grade: prev.grade || 'Class 1',
              date: new Date().toLocaleDateString('en-GB'),
              totalQuestions: 5,
              correctAnswers: 3,
              scorePercent: 60,
              gradeLetter: 'B',
              mistakes: [
                {
                  question: '5 - 2 = ?',
                  studentAnswer: '4',
                  correctAnswer: '3',
                  topic: 'Subtraction',
                },
                {
                  question: 'What comes after Monday?',
                  studentAnswer: 'Wednesday',
                  correctAnswer: 'Tuesday',
                  topic: 'Days of the Week',
                },
              ],
              remedialCompleted: false,
            };
            setActiveExam(fallbackExam);
            return {
              ...prev,
              examHistory: [fallbackExam],
            };
          }
          return prev;
        });
        setShowExamReport(true);
      },
      onPresentLearningOptions: (data) => {
        if (data.previousTopic) {
          setProfile((prev) => ({ ...prev, lastTopic: data.previousTopic || prev.lastTopic }));
        }
      },
      onHindiToEnglishLesson: () => {
        // Handled directly via audio and blackboard chalk writing
      },
      onTeachBodyParts: () => {
        // Handled directly via audio and blackboard chalk writing
      },
      onBadgeAwarded: (badge) => {
        setUnlockedBadgeCelebration(badge);
        setProfile((prev) => {
          const list = prev.badges || [];
          if (!list.includes(badge.id)) {
            const updated = { ...prev, badges: [...list, badge.id] };
            try {
              localStorage.setItem('jarvis_student_profile', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          }
          return prev;
        });
        setTimeout(() => setUnlockedBadgeCelebration(null), 6000);
      },
      onOpenStudentBadges: () => {
        setIsBadgesModalOpen(true);
      },
      onBoardZoomControl: (data: { action: string; zoomLevel?: number }) => {
        if (data.action === 'in') {
          setBoardZoomLevel((z) => Math.min(250, z + 25));
        } else if (data.action === 'out') {
          setBoardZoomLevel((z) => Math.max(60, z - 25));
        } else if (data.action === 'set' && data.zoomLevel) {
          setBoardZoomLevel(Math.max(60, Math.min(250, data.zoomLevel)));
        } else {
          setBoardZoomLevel(100);
        }
      },
      onBoardScrollControl: (data: { direction: string; amount?: number }) => {
        const amt = data.amount || 260;
        if (data.direction === 'down') {
          boardScrollRef.current?.scrollBy({ top: amt, behavior: 'smooth' });
        } else if (data.direction === 'up') {
          boardScrollRef.current?.scrollBy({ top: -amt, behavior: 'smooth' });
        } else if (data.direction === 'bottom') {
          boardScrollRef.current?.scrollTo({ top: 99999, behavior: 'smooth' });
        } else if (data.direction === 'top') {
          boardScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      onBeQuiet: () => {
        console.log('[Jarvis Silence Activated]');
        if (quranAudioRef.current) {
          quranAudioRef.current.pause();
          setActiveQuranRecitation((prev) => prev ? { ...prev, isPlaying: false } : null);
        }
        stopMusicPlayback(false);
      },
      onPlayQuranRecitation: (data) => {
        console.log('[App] Starting Quran recitation:', data);
        startQuranPlayback(data);
      },
      onPlayMusicSong: (data) => {
        console.log('[App] Music command:', data);
        const act = String(data.action || 'play').toLowerCase();
        if (act === 'stop') {
          stopMusicPlayback(true);
        } else if (act === 'pause') {
          stopMusicPlayback(false);
        } else if (act === 'resume') {
          if (musicAudioRef.current && musicStateRef.current) {
            musicAudioRef.current.play().catch(() => {});
            const resumed = { ...musicStateRef.current, isPlaying: true };
            musicStateRef.current = resumed;
            setActiveMusicPlayer(resumed);
          }
        } else if (act === 'next') {
          const cur = musicStateRef.current;
          if (cur && cur.trackIndex + 1 < cur.playlist.length) {
            const nextIdx = cur.trackIndex + 1;
            startMusicPlayback(cur.playlist[nextIdx], cur.playlist, nextIdx);
          }
        } else if (data.track) {
          startMusicPlayback(data.track, data.playlist, data.trackIndex || 0);
        }
      },
      onOpenExternalAppLink: (data) => {
        console.log('[App] Open External App Link:', data);
        const act = String(data.action || '').trim().toLowerCase();
        const q = String(data.targetQuery || '').trim();
        if (act === 'whatsapp') {
          window.open(q ? `https://wa.me/${q}` : 'https://wa.me/', '_blank');
        } else if (act === 'youtube') {
          window.open(q ? `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` : 'https://www.youtube.com', '_blank');
        } else if (act === 'facebook') {
          window.open('https://www.facebook.com', '_blank');
        } else if (act === 'instagram') {
          window.open('https://www.instagram.com', '_blank');
        } else if (act === 'phonepe') {
          window.open('https://www.phonepe.com', '_blank');
        } else if (act === 'gpay') {
          window.open('https://pay.google.com', '_blank');
        }
      },
      onOpenComplaintModal: (data: { complaintText?: string; studentName?: string; grade?: string }) => {
        console.log('[App] Voice opened Complaint/Admin Live Chat modal:', data);
        setIsChatModalOpen(true);
      },
      onAdminActionResult: (data: any) => {
        console.log('[Admin Action Result Received]:', data);
        const currentDev = getDeviceId();
        const targetStr = String(data?.target || '').toLowerCase();
        const pName = (profile?.name || '').toLowerCase();
        if (targetStr === 'all' || targetStr === currentDev.toLowerCase() || (pName && targetStr.includes(pName))) {
          safeFetchJson(`/api/profile?deviceId=${currentDev}`)
            .then((d) => {
              if (d?.deleted) {
                try {
                  localStorage.removeItem('jarvis_student_profile');
                } catch (_) {}
                setProfile({
                  name: '',
                  grade: 'Class 2',
                  role: 'Basic User',
                  preferredLanguage: 'Hinglish',
                  hasDownloadedApp: false,
                  students: [],
                  lastTopic: '',
                  visitCount: 0,
                });
                return;
              }
              if (d?.profile && typeof d.profile === 'object') {
                setProfile((prev) => ({
                  ...prev,
                  ...d.profile,
                  name: typeof d.profile.name === 'string' ? d.profile.name : (prev.name || ''),
                }));
              }
            })
            .catch(() => {});
        }
      },
    });

    sessionRef.current = session;
    try {
      await session.start({
        ...updatedProfile,
        deviceId: getDeviceId(),
        clientHour: new Date().getHours(),
        clientMinutes: new Date().getMinutes(),
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      });
    } catch (err: any) {
      console.warn('[Session Start Note]', err?.message || err);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('permission') ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.message?.toLowerCase().includes('not allowed');
      if (isDenied) {
        setIsMicDenied(true);
        setStatus('error');
      }
    }
  };

  const stopSession = () => {
    const closedTime = Date.now();
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    setStatus('disconnected');
    setAudioLevel(0);
    setIsDrawingStudioOpen(false);

    if (quranAudioRef.current) {
      try {
        quranAudioRef.current.pause();
        quranAudioRef.current = null;
      } catch (_) {}
    }
    setActiveQuranRecitation(null);

    // Save lastClosedTimestamp locally and on server
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lastClosedTimestamp: closedTime, deviceId: getDeviceId() }),
    }).catch(() => {});
  };

  const handleToggleSession = () => {
    if (isLiveActive) {
      stopSession();
    } else {
      startSession().catch(() => {});
    }
  };

  // Sync canvas size on mount/resize without wiping existing drawings
  useEffect(() => {
    if (!isLiveActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const setupCanvas = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.round(rect.width * dpr);
        const targetH = Math.round(rect.height * dpr);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          // Backup existing drawing
          let tempCanvas: HTMLCanvasElement | null = null;
          if (canvas.width > 0 && canvas.height > 0) {
            tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx?.drawImage(canvas, 0, 0);
          }

          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.scale(dpr, dpr);
            if (tempCanvas) {
              ctx.drawImage(tempCanvas, 0, 0, rect.width, rect.height);
            }
          }
        }
      }
    };

    const timer = setTimeout(setupCanvas, 60);
    window.addEventListener('resize', setupCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setupCanvas);
    };
  }, [isLiveActive]);

  // Automatic Vision: sends blackboard snapshot to Jarvis automatically when user stops writing
  const sendCanvasImageToServer = () => {
    const canvas = canvasRef.current;
    if (!canvas || !sessionRef.current) return;
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      if (base64) {
        sessionRef.current.sendBoardImage(base64);

        // Automatically wipe student's handwriting after 4 seconds once evaluated by Jarvis
        setTimeout(() => {
          const c = canvasRef.current;
          if (c) {
            const ctx = c.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, c.width, c.height);
            }
          }
          setHasDrawn(false);
        }, 4000);
      }
    } catch (e) {
      console.error('Failed to capture chalkboard snapshot:', e);
    }
  };

  const scheduleAutoVision = () => {
    if (autoVisionTimeoutRef.current) {
      clearTimeout(autoVisionTimeoutRef.current);
    }
    // Automatically trigger vision after user finishes writing completely (2.2s delay to ensure full word/sentence is written)
    autoVisionTimeoutRef.current = setTimeout(() => {
      sendCanvasImageToServer();
    }, 2200);
  };

  // Pointer events for pure White Chalk drawing with finger, stylus, or mouse (using event.pressure)
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (autoVisionTimeoutRef.current) {
      clearTimeout(autoVisionTimeoutRef.current);
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#ffffff'; // PURE WHITE CHALK ONLY
    const pressure = e.pressure !== undefined && e.pressure > 0 ? e.pressure : 0.5;
    ctx.lineWidth = Math.max(1.5, pressure * 6);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 3;

    isDrawingRef.current = true;
    setHasDrawn(true);
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pressure = e.pressure !== undefined && e.pressure > 0 ? e.pressure : 0.5;
    ctx.lineWidth = Math.max(1.5, pressure * 6);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    // Automatically schedule blackboard vision send
    scheduleAutoVision();
  };

  const clearBoard = () => {
    if (autoVisionTimeoutRef.current) {
      clearTimeout(autoVisionTimeoutRef.current);
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawn(false);
    setBoardContent('');
    setBoardCaption('');
    setBoardZoomLevel(100);
    if (boardScrollRef.current) {
      boardScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    sessionRef.current?.sendText('[STUDENT_ACTION - BLACKBOARD WIPED]: The student just wiped the blackboard clean! IMMEDIATELY speak out loud in a warm, caring teacher voice: "Aapne blackboard kyon mita diya? Kya aapko achhe se samajh aa gaya tha ya koi doubt hai?" and wait for their reply.');
    handleSpeakText('Aapne blackboard kyon mita diya? Kya aapko achhe se samajh aa gaya tha ya koi doubt hai?');
  };

  const handleOpenCamera = () => {
    // User request: "camera open hone ke bad board mein jo bhi likha hua rahega pahle Se vah hat Jana chahie"
    clearBoard();
    setIsCameraModalOpen(true);
    // User request: "Camera button dabate Hi Ek bar bolna chahie..."
    if (sessionRef.current) {
      sessionRef.current.sendText('[STUDENT_ACTION]: Student opened the camera. Speak out loud once right now in Hinglish: "Camera open ho gaya hai!" and remain silent until photo is submitted.');
    } else {
      handleSpeakText('Camera open ho gaya hai!');
    }
  };

  const handleToggleDrawingVoiceMute = useCallback((muted: boolean) => {
    setIsDrawingVoiceMuted(muted);
    sessionRef.current?.setMuted(muted);
  }, []);

  const handleCloseDrawingStudio = useCallback(() => {
    setIsDrawingStudioOpen(false);
    setAiDemonstration(null);
    // Automatically unmute voice when leaving drawing page so voice works in classroom
    setIsDrawingVoiceMuted(false);
    sessionRef.current?.setMuted(false);
    sessionRef.current?.sendDrawingStudioState(false);
    sessionRef.current?.sendText('[STUDENT_ACTION]: Student closed the Drawing & Painting Studio and returned to the blackboard classroom.');
  }, []);

  const handleSendDrawingToJarvis = (
    base64Image: string,
    metadata?: { source?: string; mode?: string; topic?: string; sheetName?: string; progress?: string }
  ) => {
    if (sessionRef.current) {
      sessionRef.current.sendBoardImage(base64Image, metadata);
    }
  };

  // Determine active student display list (always synchronized with profile.name and profile.grade)
  const activeStudents: StudentItem[] = React.useMemo(() => {
    const rawName = (profile?.name || '').trim();
    const studentsList = Array.isArray(profile?.students) ? profile.students : [];
    if (studentsList.length > 0) {
      if (studentsList.length === 1 && rawName) {
        return [{
          ...studentsList[0],
          name: rawName,
          grade: profile?.grade || studentsList[0]?.grade || 'Class 1',
          role: profile?.role !== undefined ? profile.role : studentsList[0]?.role,
          islamicTitle: profile?.islamicTitle !== undefined ? profile.islamicTitle : studentsList[0]?.islamicTitle,
        }];
      }
      return studentsList;
    }
    if (rawName) {
      return [{
        name: rawName,
        grade: profile?.grade || 'Class 1',
        role: profile?.role,
        islamicTitle: profile?.islamicTitle,
      }];
    }
    return [];
  }, [profile?.name, profile?.grade, profile?.role, profile?.islamicTitle, profile?.students]);

  const handleMarkAppDownloaded = useCallback(() => {
    setProfile((prev) => {
      const updated: StudentProfile = { ...prev, hasDownloadedApp: true };
      try {
        localStorage.setItem('jarvis_student_profile', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    const devId = getDeviceId();
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? (/iPhone|iPad|iPod/i.test(ua) ? 'Apple iOS' : 'Android Mobile') : 'Desktop Browser';
    const sName = profile.name || activeStudents[0]?.name || 'Student';

    fetch('/api/user/download-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: devId,
        studentName: sName,
        grade: profile.grade || activeStudents[0]?.grade || 'Class 2',
        hasDownloadedApp: true,
        userAgent: ua,
      }),
    }).catch(() => {});

    // Send instant notification to Admin Panel for Chand admin
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'app_installed',
        title: 'App Install Kar Liya Hai ✅',
        action: 'Maine App Install Kar Liya Hai Button Dabaya',
        message: `${sName} (${profile.grade || 'Class 2'}) ne confirm kiya ki unhone mobile mein app successfully install kar liya hai!`,
        studentName: sName,
        grade: profile.grade || 'Class 2',
        role: profile.role || 'Basic User',
        islamicTitle: profile.islamicTitle,
        preferredLanguage: profile.preferredLanguage || 'Hinglish',
        deviceId: devId,
        deviceType,
        visitCount: profile.visitCount || 1,
        lastTopic: profile.lastTopic || 'General Study',
      }),
    }).catch(() => {});
  }, [profile.name, profile.grade, profile.role, profile.islamicTitle, profile.preferredLanguage, profile.visitCount, profile.lastTopic, activeStudents]);

  const handleDownloadAppClick = useCallback(() => {
    // 1. Immediately open the step-by-step installation guide & help modal
    setIsApkGuideModalOpen(true);

    const devId = getDeviceId();
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const deviceType = isMobile ? (/iPhone|iPad|iPod/i.test(ua) ? 'Apple iOS' : 'Android Mobile') : 'Desktop Browser';
    const sName = profile.name || activeStudents[0]?.name || 'Student';
    const targetUrl = apkDownloadUrl || APK_DOWNLOAD_URL;
    const fileName = targetUrl.split('/').pop() || 'AI_Teacher_Jarvis.apk';

    // 2. Trigger instant direct download of the APK file
    try {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = fileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.warn('Direct link click fallback', e);
    }

    // 3. Send instant download alert to Admin Panel for Chand admin
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'app_download',
        title: 'APK Download Shuru Kiya 📥',
        action: 'Top-Right Download Button Dabaya',
        message: `${sName} (${profile.grade || 'Class 2'}) ne screen se Android APK (${fileName}) download shuru kiya.`,
        studentName: sName,
        grade: profile.grade || 'Class 2',
        role: profile.role || 'Basic User',
        islamicTitle: profile.islamicTitle,
        preferredLanguage: profile.preferredLanguage || 'Hinglish',
        deviceId: devId,
        deviceType,
        visitCount: profile.visitCount || 1,
        lastTopic: profile.lastTopic || 'General Study',
      }),
    }).catch(() => {});

    // 4. Record download locally & on server WITHOUT sending install confirmation
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: devId,
        hasDownloadedApp: true,
      }),
    }).catch(() => {});

    // 5. Notify live session if active
    if (sessionRef.current) {
      sessionRef.current.sendText(
        `[USER_ACTION - DOWNLOAD_APP]: The user tapped 'Download App' (APK: ${fileName}). If they encounter any error during installation, guide them warmly and offer to check their screen photo with camera vision.`
      );
    }
  }, [apkDownloadUrl, profile.name, profile.grade, profile.role, profile.islamicTitle, profile.preferredLanguage, profile.visitCount, profile.lastTopic, activeStudents]);

  // Compute milestone badges for background achievement tracking
  const studentBadges = computeStudentBadges({
    ...profile,
    name: profile?.name || activeStudents[0]?.name || 'Student',
    grade: profile?.grade || activeStudents[0]?.grade || 'Class 2',
  });

  const [targetedAds, setTargetedAds] = useState<any[]>([]);
  // Never display raw image/base64 data or technical data-URI strings as advertisement text.
  const cleanAdText = (value: unknown) => String(value ?? '')
    .replace(/data:image\\/[a-zA-Z0-9.+-]+;base64,[\\s\\S]*/gi, '')
    .replace(/Image:\\s*data:image\\/[^\\s]*/gi, '')
    .replace(/data:image\\/[^\\s]*/gi, '')
    .trim();
  useEffect(() => {
    const deviceId = getDeviceId();
    const studentName = (profile.name || '').trim();
    const fetchAds = (trackViews = false) => {
      safeFetchJson('/api/targeted-ads?' + new URLSearchParams({ deviceId, studentName }).toString())
        .then(data => {
          if (data?.success && Array.isArray(data.ads)) {
            // Fetch on every app opening and refresh the ad list; track a view for this opening.
            setTargetedAds(data.ads.map((ad: any) => ({ ...ad, title: cleanAdText(ad.title), text: cleanAdText(ad.text) })));
            if (trackViews) data.ads.forEach((ad: any) => safeFetchJson('/api/targeted-ads/' + encodeURIComponent(ad.id) + '/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentName: profile.name || 'Student', deviceId, event: 'view' }) }).catch(() => {}));
          }
        }).catch(() => {});
    };
    fetchAds(true);
    const timer = window.setInterval(() => fetchAds(false), 15000);
    return () => window.clearInterval(timer);
  }, [profile.name]);
  const trackTargetedAd = (adId:string,event:string) => {
    safeFetchJson('/api/targeted-ads/'+encodeURIComponent(adId)+'/event',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({studentName:profile.name||'Student',deviceId:getDeviceId(),event})}).catch(()=>{});
  };

  if (location.pathname === '/admin') {
    const profileNameLower = (profile.name || '').trim().toLowerCase();
    return <AdminPage initialVerified={isAdminVerified} initialTab={adminInitialTab} />;
  }

  return (
    <div className="h-full h-[100dvh] w-full fixed inset-0 bg-[#030611] text-slate-100 flex flex-col items-center justify-between p-3 sm:p-5 select-none overflow-hidden font-sans touch-none">
      {/* Welcome Screen on App Open (Full Page) */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#030611] animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0a1829] to-[#040b16] border border-cyan-500/40 rounded-3xl p-8 sm:p-12 shadow-[0_0_80px_rgba(6,182,212,0.25)] text-slate-100 flex flex-col items-center text-center gap-6 overflow-hidden">
            {/* Ambient Corner Glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/20 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 blur-3xl pointer-events-none rounded-full" />

            {/* Icon Header */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-cyan-400/30 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)]">
              <GraduationCap className="w-10 h-10 text-cyan-300 animate-pulse" />
            </div>

            <div className="flex flex-col items-center gap-4 w-full">
              <div className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2 max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse shrink-0" />
                <span className="text-[11px] sm:text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Developer App</span>
                  <span className="text-cyan-400 font-normal">•</span>
                  <span className="text-white font-serif normal-case tracking-normal text-xs sm:text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">𓆩𝐂𝒉𝐚𝐧𝒅𓆪</span>
                </span>
              </div>

              <div className="flex flex-col items-center gap-1.5 mt-1 w-full">
                <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] text-cyan-400 font-bold">
                  Welcome to
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight min-h-[44px] flex items-center justify-center">
                  <span className="text-cyan-300 font-mono tracking-wider drop-shadow-[0_0_18px_rgba(34,211,238,0.95)]">
                    {typedTitleText || 'AI Teacher'}
                  </span>
                </h1>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md px-2">
                Your Personal Smart AI Teacher with interactive voice and blackboard learning!
              </p>
            </div>

            {/* Clean Welcome Loader (No extra buttons) */}
            <div className="w-full max-w-xs mt-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-medium animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Opening AI Classroom...</span>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Dynamic Ambient Background Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-indigo-600/15 blur-[140px] rounded-full pointer-events-none transition-all duration-700 animate-pulse" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header Bar: Centered Profile with Download Button directly underneath */}
      <div className="w-full max-w-lg relative flex flex-col items-center z-20 -mt-2 px-2 sm:px-3 mx-auto">
        {/* Right Slot: Mail Notification if present */}
        {receivedAdminMessage && (
          <div className="absolute right-2 top-0.5 z-30">
            <button
              type="button"
              onClick={() => {
                setIsChatModalOpen(true);
                handleAcknowledgeAdminMessage(receivedAdminMessage.id);
              }}
              className="relative p-1 rounded-lg bg-amber-950/90 hover:bg-amber-900 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)] cursor-pointer transition-all active:scale-95 shrink-0"
              title="Admin Ka Naya Message Aaya Hai! Click karke padhein."
            >
              <Mail className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        )}

        {/* Center: Student Name & Class Badge + Download Button directly underneath */}
        <div className="flex flex-col items-center gap-1.5 z-20">
          {uiConfig.profileVisible !== false && (!uiConfig.profileOnlyWhenLive || isLiveActive) && activeStudents.length > 0 && Boolean(activeStudents[0]?.name?.trim()) && (
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(true)}
              title="Click to edit or delete student name"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#071120]/95 hover:bg-[#0c1f38] border border-cyan-500/40 hover:border-cyan-400/80 backdrop-blur-2xl shadow-[0_2px_15px_rgba(6,182,212,0.2)] cursor-pointer transition-all active:scale-95 group text-center truncate max-w-full text-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse shrink-0" />
              {activeStudents.map((st, idx) => {
                const roleStr = String(st.role || profile.role || '');
                const titleStr = String(st.islamicTitle !== undefined ? st.islamicTitle : (profile.islamicTitle || ''));
                const isExplicitBasicUser = roleStr === 'Basic User' || roleStr === '' || titleStr === '';

                let title: string | undefined = undefined;
                if (!isExplicitBasicUser) {
                  if (titleStr && titleStr !== 'Basic User') {
                    title = titleStr;
                  } else if (roleStr && roleStr !== 'Basic User') {
                    title = roleStr;
                  }
                }

                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-cyan-500/40 text-[10px] font-mono shrink-0">✦</span>}
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs min-w-0">
                      <span className="font-bold text-white tracking-wide truncate max-w-[80px] sm:max-w-[120px]">{st.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950/90 border border-cyan-500/40 text-[9px] font-bold text-cyan-300 shrink-0">
                        {st.grade}
                      </span>
                      {title && title !== 'Basic User' && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-950/90 border border-amber-400/60 text-[9px] font-bold text-amber-300 shrink-0">
                          <span>{title.toLowerCase().includes('mufti') ? '🕌' : title.toLowerCase().includes('qari') ? '📖' : '🎓'}</span>
                        </span>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
              <Edit3 className="w-2.5 h-2.5 text-cyan-400/70 group-hover:text-cyan-300 ml-0.5 shrink-0" />
            </button>
          )}

          {/* Download Button: Placed directly below the student name badge */}
          {isDownloadButtonVisible && uiConfig.downloadButtonVisible !== false && (!uiConfig.downloadButtonOnlyWhenLive || isLiveActive) && (
            <button
              type="button"
              onClick={handleDownloadAppClick}
              title="Download AI Teacher Android APK"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-emerald-950/90 hover:from-emerald-900 hover:to-teal-800 border border-emerald-400/60 hover:border-emerald-300 text-emerald-200 hover:text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] cursor-pointer transition-all active:scale-95 shrink-0 group text-[10px] font-bold tracking-wide backdrop-blur-md"
            >
              <Download className="w-3 h-3 text-emerald-300 group-hover:translate-y-0.5 transition-transform shrink-0" />
              <span className="font-extrabold tracking-tight leading-none">{uiConfig.downloadButtonText || 'Download APK'}</span>
              {profile.hasDownloadedApp ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] shrink-0" title="App Installed" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              )}
            </button>
          )}

          {Boolean(uiConfig.customBannerText?.trim()) && (
            <div className="px-3 py-0.5 rounded-full bg-amber-950/85 border border-amber-400/50 text-amber-200 text-[10px] font-semibold tracking-wide max-w-xs truncate shadow-sm">
              {uiConfig.customBannerText}
            </div>
          )}
        </div>
      </div>

      {/* Main Center Stage: Next-Gen Holographic Voice Core */}
      <main className="w-full max-w-lg flex flex-col items-center justify-center my-auto py-4 z-10">
        <div className="relative flex items-center justify-center">
          {/* Animated Atmospheric Multi-Ring Resonance Aura */}
          <div
            className="absolute w-[260px] h-[260px] rounded-full border border-cyan-500/20 transition-transform duration-300 pointer-events-none will-change-transform"
            style={{
              opacity: isLiveActive ? 0.7 : 0.05,
              transform: `scale(${1 + audioLevel * 0.35})`,
            }}
          />

          <div
            className="absolute w-[210px] h-[210px] rounded-full border border-sky-400/30 transition-transform duration-200 pointer-events-none will-change-transform"
            style={{
              opacity: isLiveActive ? 0.9 : 0.1,
              transform: `scale(${1 + audioLevel * 0.25})`,
            }}
          />

          {/* Holographic Glowing Orbit Ring */}
          <div
            className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-dashed transition-all duration-1000 pointer-events-none ${
              status === 'speaking'
                ? 'border-cyan-400/60 animate-[spin_8s_linear_infinite]'
                : status === 'listening'
                ? 'border-sky-400/40 animate-[spin_16s_linear_infinite]'
                : 'border-slate-800/40'
            }`}
          />

          {/* Central Interactive Crystal Sphere */}
          <button
            type="button"
            onClick={handleToggleSession}
            title={
              status === 'error'
                ? 'Tap to grant microphone access'
                : isLiveActive
                ? 'Tap to stop'
                : 'Tap to talk'
            }
            aria-label={
              status === 'error'
                ? 'Enable microphone'
                : isLiveActive
                ? 'End conversation'
                : 'Start conversation'
            }
            className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 relative group shadow-2xl active:scale-95 outline-none focus:outline-none ${
              status === 'error'
                ? 'bg-gradient-to-b from-[#2e0e15] via-[#1a070c] to-[#0d0306] border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.35)] animate-pulse'
                : status === 'speaking'
                ? 'bg-gradient-to-b from-[#0b335a] via-[#061e38] to-[#020b16] border-2 border-cyan-400/90 shadow-[0_0_70px_rgba(34,211,238,0.45)] scale-105'
                : status === 'listening'
                ? 'bg-gradient-to-b from-[#092949] via-[#05172b] to-[#020b15] border-2 border-sky-400 shadow-[0_0_55px_rgba(56,189,248,0.4)] scale-100'
                : status === 'connecting'
                ? 'bg-gradient-to-b from-[#1c2e47] via-[#0e1929] to-[#050b14] border-2 border-amber-400/80 shadow-[0_0_40px_rgba(251,191,36,0.35)] animate-pulse'
                : 'bg-gradient-to-b from-[#0e1b2e] via-[#07111f] to-[#030811] border border-slate-700/60 hover:border-cyan-500/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:scale-[1.02]'
            }`}
          >
            {/* Inner Metallic Iris & Refractive Core */}
            <div className="w-34 h-34 sm:w-42 sm:h-42 rounded-full bg-gradient-to-b from-[#050d1a] to-[#01050a] border border-slate-800 flex items-center justify-center shadow-inner relative overflow-hidden pointer-events-none">
              {/* Glass Glare Highlights */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent rounded-t-full pointer-events-none" />
              
              {/* Center Morphing Icon */}
              {status === 'speaking' ? (
                <div className="relative flex items-center justify-center">
                  <Volume2 className="w-14 h-14 sm:w-16 sm:h-16 text-cyan-300 animate-pulse drop-shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                </div>
              ) : status === 'listening' ? (
                <div className="relative flex items-center justify-center">
                  <Mic className="w-14 h-14 sm:w-16 sm:h-16 text-sky-400 drop-shadow-[0_0_14px_rgba(56,189,248,0.8)] scale-105 transition-transform" />
                  <span className="absolute inset-0 rounded-full bg-sky-400/20 blur-md animate-pulse" />
                </div>
              ) : status === 'connecting' ? (
                <Sparkles className="w-12 h-12 text-amber-300 animate-spin" />
              ) : status === 'error' ? (
                <div className="relative flex items-center justify-center">
                  <MicOff className="w-12 h-12 sm:w-14 sm:h-14 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
                </div>
              ) : (
                <Mic className="w-12 h-12 sm:w-14 sm:h-14 text-slate-400 group-hover:text-cyan-300 transition-all duration-300 drop-shadow-sm" />
              )}
            </div>
          </button>
        </div>
      </main>

      {/* Bottom Area: Start Button (if idle) OR Professional Classroom Blackboard (when call is active) */}
      <footer className="w-full max-w-sm sm:max-w-md z-20 pb-2 sm:pb-4 flex flex-col items-center gap-3">
        {!isLiveActive ? (
          <div className="flex flex-col items-center gap-2.5 w-full">
            {targetedAds.length > 0 && (
              <div className="w-full max-w-sm rounded-xl border border-amber-400/40 bg-slate-900/90 p-2 shadow-lg text-left">
                {targetedAds.map(ad => (
                  <div key={ad.id} className="flex items-center gap-2.5">
                    {ad.imageUrl && <a href={ad.linkUrl || undefined} target={ad.linkUrl ? "_blank" : undefined} rel="noopener noreferrer" onClick={()=>ad.linkUrl&&trackTargetedAd(ad.id,'click')} className="shrink-0"><img src={ad.imageUrl} alt={ad.title||'Advertisement'} className="w-16 h-14 rounded-lg object-cover bg-slate-800" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none';}} /></a>}
                    <div className="min-w-0 flex-1"><span className="text-[9px] uppercase font-black text-amber-300">Advertisement</span><h3 className="text-xs font-bold text-white truncate">{ad.title}</h3><p className="text-[10px] text-slate-200 line-clamp-2">{ad.text}</p>{ad.linkUrl && !ad.imageUrl && <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={()=>trackTargetedAd(ad.id,'click')} className="text-[10px] text-amber-300 underline">Open Link</a>}</div>
                    <button onClick={()=>setTargetedAds(prev=>prev.filter(x=>x.id!==ad.id))} className="text-slate-400 p-1 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
            {(status === 'error' || isMicDenied) && (
              <a
                href={typeof window !== 'undefined' ? window.location.origin : '/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer active:scale-95 border border-amber-300/50 animate-fade-in no-underline"
              >
                <ExternalLink className="w-4 h-4 text-slate-950" />
                <span>Open App Direct in New Tab</span>
              </a>
            )}
            <button
              type="button"
              onClick={() => startSession().catch(() => {})}
              className="py-3 px-8 rounded-full text-white font-medium text-sm tracking-wide flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-lg animate-fade-in bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 border border-cyan-400/40 shadow-[0_8px_25px_rgba(2,132,199,0.4)] font-mono"
            >
              <Mic className="w-4 h-4 text-white animate-pulse" />
              <span>Start Voice Call</span>
            </button>
          </div>
        ) : uiConfig.blackboardVisible !== false ? (
          /* Professional Classroom Blackboard with Zoom Controls (Only visible when call is started & enabled by Admin) */
          <div className="w-full h-52 sm:h-64 rounded-2xl bg-[#091611] border-4 sm:border-[5px] border-[#22392c] shadow-[inset_0_4px_24px_rgba(0,0,0,0.95),0_12px_35px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col justify-between p-2 sm:p-2.5 select-none transition-all duration-500 animate-in fade-in zoom-in-95">
            {/* Slate Texture Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(#163625_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/35 pointer-events-none" />

            {/* Blackboard Top Bar: Minimal Header with Zoom Controls & Eraser */}
            <div className="flex items-center justify-between w-full z-30 px-1 gap-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-mono font-medium text-emerald-300/90 tracking-wider uppercase truncate">
                  {uiConfig.blackboardTitle || 'BLACKBOARD'}
                </span>
                {/* Camera Logo Button: strictly icon only, no text */}
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  title="Copy ki photo khinch kar AI Teacher ko dikhao"
                  className="p-1 rounded bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 transition-all cursor-pointer border border-emerald-600/40 active:scale-95 shadow-sm ml-0.5"
                  aria-label="Open Camera"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-300" />
                </button>
              </div>

              {/* Blackboard Toolbar: Zoom Controls (Only visible when lots of content is written) + Clear */}
              <div className="flex items-center gap-1">
                {hasLotsOfContent && (
                  <div className="flex items-center gap-1 animate-in fade-in duration-200">
                    <button
                      type="button"
                      onClick={() => setBoardZoomLevel((z) => Math.max(60, z - 15))}
                      title="Zoom Out (-)"
                      className="p-1 rounded bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 transition-all cursor-pointer border border-emerald-600/40 active:scale-95"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoardZoomLevel(100)}
                      title="Reset Zoom (100%)"
                      className="px-1.5 py-0.5 rounded bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono transition-all cursor-pointer border border-emerald-600/40 active:scale-95 font-semibold"
                    >
                      {boardZoomLevel}%
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoardZoomLevel((z) => Math.min(250, z + 15))}
                      title="Zoom In (+)"
                      className="p-1 rounded bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 transition-all cursor-pointer border border-emerald-600/40 active:scale-95"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {(boardContent || hasDrawn) && (
                  <button
                    type="button"
                    onClick={clearBoard}
                    title="Clear Blackboard"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-[10px] font-mono border border-rose-600/40 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Eraser className="w-3 h-3 text-rose-300" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quran Recitation Live Player Banner */}
            {activeQuranRecitation && (
              <div className="z-30 w-full px-2 py-1 bg-gradient-to-r from-emerald-950/95 via-teal-950/90 to-emerald-950/95 border border-emerald-500/50 rounded-lg flex items-center justify-between gap-2 text-xs font-mono my-0.5 shadow-md animate-fade-in">
                <div className="flex items-center gap-1.5 min-w-0 truncate">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${activeQuranRecitation.isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-emerald-600'}`} />
                  {activeQuranRecitation.currentPara && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold shrink-0">
                      Para {activeQuranRecitation.currentPara}/30
                    </span>
                  )}
                  <span className="text-emerald-300 font-semibold truncate">
                    📖 {activeQuranRecitation.surahNameArabic || ''} {activeQuranRecitation.surahName || 'Surah'}
                    {activeQuranRecitation.ayah ? ` (Ayah ${activeQuranRecitation.ayah})` : ''}
                  </span>
                  {activeQuranRecitation.tracks && activeQuranRecitation.tracks.length > 1 && (
                    <span className="text-[10px] text-emerald-300/75 hidden sm:inline shrink-0">
                      ({(activeQuranRecitation.trackIndex ?? 0) + 1}/{activeQuranRecitation.tracks.length})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = quranStateRef.current;
                      if (!cur) return;
                      const idx = cur.trackIndex ?? 0;
                      if (cur.tracks && idx > 0) {
                        const prevTrack = cur.tracks[idx - 1];
                        startQuranPlayback({
                          ...cur,
                          audioUrl: prevTrack.audioUrl,
                          surahId: prevTrack.surahId,
                          surahName: prevTrack.surahName,
                          surahNameArabic: prevTrack.surahNameArabic,
                          ayah: prevTrack.ayah,
                          currentPara: prevTrack.paraId || cur.currentPara,
                          trackIndex: idx - 1,
                        });
                      } else if (cur.tracks && (cur.currentPara || 1) > 1) {
                        loadQuranPara((cur.currentPara || 2) - 1, cur.transLang || 'hi', Boolean(cur.fullQuran || cur.continuousMode));
                      } else if (!cur.tracks && (cur.surahId || 1) > 1) {
                        loadQuranSurah((cur.surahId || 2) - 1, cur.transLang || 'hi', Boolean(cur.continuousMode), Boolean(cur.fullQuran));
                      }
                    }}
                    title="Previous Ayah / Surah / Para"
                    className="px-1.5 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-[10px] border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (quranAudioRef.current) {
                        if (activeQuranRecitation.isPlaying) {
                          quranAudioRef.current.pause();
                          setActiveQuranRecitation((prev) => {
                            const next = prev ? { ...prev, isPlaying: false } : null;
                            quranStateRef.current = next;
                            return next;
                          });
                        } else {
                          quranAudioRef.current.play().catch(() => {});
                          setActiveQuranRecitation((prev) => {
                            const next = prev ? { ...prev, isPlaying: true } : null;
                            quranStateRef.current = next;
                            return next;
                          });
                        }
                      }
                    }}
                    title={activeQuranRecitation.isPlaying ? 'Pause Tilawat' : 'Play Tilawat'}
                    className="px-2 py-0.5 rounded bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-[10px] font-bold border border-emerald-400/40 cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                  >
                    {activeQuranRecitation.isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = quranStateRef.current;
                      if (!cur) return;
                      const idx = cur.trackIndex ?? 0;
                      if (cur.tracks && idx + 1 < cur.tracks.length) {
                        const nextTrack = cur.tracks[idx + 1];
                        startQuranPlayback({
                          ...cur,
                          audioUrl: nextTrack.audioUrl,
                          surahId: nextTrack.surahId,
                          surahName: nextTrack.surahName,
                          surahNameArabic: nextTrack.surahNameArabic,
                          ayah: nextTrack.ayah,
                          currentPara: nextTrack.paraId || cur.currentPara,
                          trackIndex: idx + 1,
                        });
                      } else if (cur.tracks && (cur.currentPara || 1) < 30) {
                        loadQuranPara((cur.currentPara || 1) + 1, cur.transLang || 'hi', Boolean(cur.fullQuran || cur.continuousMode));
                      } else if (!cur.tracks && (cur.surahId || 1) < 114) {
                        loadQuranSurah((cur.surahId || 1) + 1, cur.transLang || 'hi', Boolean(cur.continuousMode), Boolean(cur.fullQuran));
                      }
                    }}
                    title="Next Ayah / Surah / Para"
                    className="px-1.5 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-[10px] border border-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    ⏭
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQuranRecitation((prev) => {
                        if (!prev) return null;
                        const toggled = !prev.continuousMode;
                        const next = { ...prev, continuousMode: toggled, fullQuran: toggled };
                        quranStateRef.current = next;
                        return next;
                      });
                    }}
                    title="Auto-Continue 30 Para"
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border cursor-pointer active:scale-95 transition-all ${
                      activeQuranRecitation.continuousMode
                        ? 'bg-emerald-600 text-white border-emerald-300/60'
                        : 'bg-emerald-950/80 text-emerald-300/70 border-emerald-600/30 hover:text-emerald-200'
                    }`}
                  >
                    🔁 30P
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (quranAudioRef.current) {
                        quranAudioRef.current.onended = null;
                        quranAudioRef.current.onerror = null;
                        quranAudioRef.current.pause();
                        quranAudioRef.current = null;
                      }
                      quranPreloadRef.current = null;
                      quranStateRef.current = null;
                      setActiveQuranRecitation(null);
                    }}
                    title="Stop Tilawat"
                    className="px-1.5 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[10px] border border-rose-600/40 cursor-pointer active:scale-95 transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Music / Song Live Player Banner */}
            {activeMusicPlayer && (
              <div className="z-30 w-full px-2 py-1 bg-gradient-to-r from-indigo-950/95 via-slate-900/95 to-indigo-950/95 border border-indigo-400/50 rounded-lg flex items-center justify-between gap-2 text-xs font-mono my-0.5 shadow-md animate-fade-in">
                <div className="flex items-center gap-2 min-w-0 truncate">
                  {activeMusicPlayer.track.image ? (
                    <img
                      src={activeMusicPlayer.track.image}
                      alt={activeMusicPlayer.track.title}
                      className="w-6 h-6 rounded object-cover border border-indigo-400/40 shrink-0"
                    />
                  ) : (
                    <span className={`w-2 h-2 rounded-full shrink-0 ${activeMusicPlayer.isPlaying ? 'bg-indigo-400 animate-ping' : 'bg-indigo-600'}`} />
                  )}
                  <span className="text-indigo-200 font-semibold truncate">
                    🎵 {activeMusicPlayer.track.title}
                  </span>
                  <span className="text-[10px] text-indigo-300/75 truncate hidden sm:inline">
                    • {activeMusicPlayer.track.artist}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = musicStateRef.current;
                      if (!cur) return;
                      const prevIdx = cur.trackIndex > 0 ? cur.trackIndex - 1 : cur.playlist.length - 1;
                      startMusicPlayback(cur.playlist[prevIdx], cur.playlist, prevIdx);
                    }}
                    title="Previous Song"
                    className="px-1.5 py-0.5 rounded bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 text-[10px] border border-indigo-400/30 cursor-pointer active:scale-95 transition-all"
                  >
                    ⏮
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (musicAudioRef.current) {
                        if (activeMusicPlayer.isPlaying) {
                          stopMusicPlayback(false);
                        } else {
                          musicAudioRef.current.play().catch(() => {});
                          const next = musicStateRef.current ? { ...musicStateRef.current, isPlaying: true } : null;
                          musicStateRef.current = next;
                          setActiveMusicPlayer(next);
                        }
                      }
                    }}
                    title={activeMusicPlayer.isPlaying ? 'Pause Song' : 'Play Song'}
                    className="px-2 py-0.5 rounded bg-indigo-700/90 hover:bg-indigo-600 text-white text-[10px] font-bold border border-indigo-300/40 cursor-pointer active:scale-95 transition-all"
                  >
                    {activeMusicPlayer.isPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = musicStateRef.current;
                      if (!cur) return;
                      const nextIdx = cur.trackIndex + 1 < cur.playlist.length ? cur.trackIndex + 1 : 0;
                      startMusicPlayback(cur.playlist[nextIdx], cur.playlist, nextIdx);
                    }}
                    title="Next Song"
                    className="px-1.5 py-0.5 rounded bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 text-[10px] border border-indigo-400/30 cursor-pointer active:scale-95 transition-all"
                  >
                    ⏭
                  </button>
                  <button
                    type="button"
                    onClick={() => stopMusicPlayback(true)}
                    title="Stop Song"
                    className="px-1.5 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[10px] border border-rose-600/40 cursor-pointer active:scale-95 transition-all"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-1 ml-1 pl-1 border-l border-indigo-500/30">
                    <span className="text-[10px] text-indigo-300">🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMusicVolume(val);
                        if (musicAudioRef.current) {
                          musicAudioRef.current.volume = val;
                        }
                      }}
                      title="Adjust song volume"
                      className="w-14 sm:w-20 h-1 bg-indigo-900 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Center Blackboard Content Area: Scalable Chalk Text + Canvas */}
            <div ref={boardScrollRef} className="relative flex-1 w-full my-0.5 overflow-y-auto rounded-lg p-2 scrollbar-thin touch-pan-y select-text z-20">
              {/* White Chalk Finger/Mouse Drawing Canvas (behind text layer) */}
              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onPointerCancel={stopDrawing}
                className="absolute inset-0 w-full h-full touch-none z-10 cursor-crosshair opacity-80"
              />

              {/* Dynamic White Chalk Typography with Layout-based Font Size Zoom Scaling */}
              {boardContent && (
                <div className="relative z-30 w-full px-1 py-1 text-left pointer-events-auto select-text touch-pan-y">
                  <div
                    style={{
                      fontSize: `${(boardZoomLevel / 100) * 0.95}rem`,
                      lineHeight: '1.6',
                    }}
                    className="font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] drop-shadow-[0_0_18px_rgba(255,255,255,0.4)] animate-fade-in whitespace-pre-wrap break-words transition-all duration-150"
                  >
                    {boardContent}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </footer>

      {/* Weekly Exam Report Card Modal */}
      {showExamReport && (activeExam || profile.examHistory?.[0]) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0a1525] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-4 overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-amber-200 tracking-wide flex items-center gap-1.5">
                    Weekly Exam Report Card
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {(activeExam || profile.examHistory?.[0])?.studentName} • {(activeExam || profile.examHistory?.[0])?.grade}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadReport}
                  title="Download Report Card"
                  className="px-2.5 py-1.5 rounded-xl bg-transparent hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Scorecard Summary Pill */}
            {(() => {
              const report = activeExam || profile.examHistory?.[0]!;
              return (
                <>
                  <div className="grid grid-cols-3 gap-2.5 py-1">
                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1d33] border border-cyan-500/25">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Total Marks</span>
                      <span className="text-xl sm:text-2xl font-bold text-cyan-200 mt-0.5 font-mono">
                        {report.correctAnswers}/{report.totalQuestions}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1d33] border border-cyan-500/25">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Score %</span>
                      <span className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5 font-mono">
                        {report.scorePercent}%
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#0e1d33] border border-cyan-500/25">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Grade</span>
                      <span className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5 font-mono">
                        {report.gradeLetter || 'A'}
                      </span>
                    </div>
                  </div>

                  {/* Remedial / Mistake Breakdown (Jo galat hua usko fir se padhana hai) */}
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                    <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <GraduationCap className="w-4 h-4 text-cyan-400" />
                      <span>Doubt Clearing & Re-learning Topics</span>
                    </h4>

                    {report.mistakes && report.mistakes.length > 0 ? (
                      report.mistakes.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs flex flex-col gap-1"
                        >
                          <div className="text-rose-200 font-medium">
                            <span className="text-rose-400 mr-1.5 font-mono font-bold">Q{idx + 1}:</span>
                            {m.question}
                          </div>
                          {m.studentAnswer && (
                            <div className="text-[11px] text-slate-400">
                              Student: <span className="line-through text-rose-300/80">{m.studentAnswer}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-emerald-300 font-medium">
                            Correct Answer: <span className="underline decoration-emerald-500/40">{m.correctAnswer}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Excellent performance! All answers were correct!</span>
                      </div>
                    )}
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setShowExamReport(false)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer mt-1"
                  >
                    Close
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Interactive Painting & Drawing Studio (Opens when child asks to learn drawing/painting) */}
      {isDrawingStudioOpen && (
        <DrawingStudio
          topic={drawingStudioTopic}
          instructions={drawingStudioInstructions}
          onClose={handleCloseDrawingStudio}
          onSendDrawingToJarvis={handleSendDrawingToJarvis}
          isLiveActive={isLiveActive}
          status={status}
          audioLevel={audioLevel}
          aiDemonstration={aiDemonstration}
          onRequestJarvisDraw={(targetTopic) => sessionRef.current?.requestJarvisDraw(targetTopic)}
          initialMode={initialDrawingStudioMode}
          initialSheetId={initialColorSheetId}
          aiColorGuideStep={aiColorGuideStep}
          onRequestColorAdvice={(sheetId, partName) => sessionRef.current?.requestColorAdvice(sheetId, partName)}
          onSheetCompleted={(sheetId) => sessionRef.current?.notifySheetCompleted(sheetId)}
          onSendTextMessage={(text) => sessionRef.current?.sendText(text)}
          autoFillTrigger={autoFillTrigger}
          onRequestAutoFill={() => sessionRef.current?.requestAutoFill()}
          isVoiceMuted={isDrawingVoiceMuted}
          onToggleVoiceMute={handleToggleDrawingVoiceMute}
        />
      )}

      {/* Class Textbook & Syllabus Reader Modal */}
      {isTextbookModalOpen && (
        <ClassTextbookReaderModal
          initialGrade={(profile.grade as GradeLevel) || 'Class 1'}
          onClose={() => setIsTextbookModalOpen(false)}
          onOpenWritingPad={(word) => {
            if (word) setWritingPadTargetWord(word);
            setIsWritingPadModalOpen(true);
          }}
          onSpeakText={handleSpeakText}
        />
      )}


      {/* Writing & Tracing Practice Pad Modal */}
      {isWritingPadModalOpen && (
        <WritingPracticePadModal
          initialWord={writingPadTargetWord}
          onClose={() => setIsWritingPadModalOpen(false)}
          onSpeakText={handleSpeakText}
        />
      )}

      {/* Student Milestones & Badges Showcase Modal */}
      <StudentBadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={studentBadges}
        studentName={profile.name || activeStudents[0]?.name || 'Student'}
        grade={profile.grade || activeStudents[0]?.grade || 'Class 2'}
      />

      {/* Celebratory Milestone Badge Unlock Toast (Ultra-Compact) */}
      {unlockedBadgeCelebration && (
        <div className="fixed top-2.5 right-3 sm:right-4 z-50 px-3 py-2 rounded-xl bg-gradient-to-r from-[#0d1e33] to-[#050f1c] border border-amber-400/70 shadow-[0_4px_20px_rgba(251,191,36,0.3)] animate-in slide-in-from-top-2 duration-200 flex items-center gap-2 max-w-[260px] sm:max-w-xs">
          <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-sm shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            <span>{unlockedBadgeCelebration.id === 'perfect_exam' ? '💯' : '🌟'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
              <span>Milestone Unlocked!</span>
            </div>
            <h4 className="text-[11px] font-bold text-white truncate">{unlockedBadgeCelebration.title}</h4>
          </div>
          <button
            type="button"
            onClick={() => {
              setUnlockedBadgeCelebration(null);
              setIsBadgesModalOpen(true);
            }}
            className="px-2 py-0.5 rounded bg-amber-500/25 hover:bg-amber-500/45 border border-amber-400/50 text-amber-200 text-[9px] font-mono font-bold shrink-0 cursor-pointer transition-all active:scale-95"
          >
            View
          </button>
        </div>
      )}

      {/* Microphone Permission Modal */}
      <MicrophonePermissionModal
        isOpen={isMicModalOpen}
        status={micState}
        onRequestPermission={requestMicPermission}
        onClose={() => setIsMicModalOpen(false)}
        onContinue={() => {
          setIsMicModalOpen(false);
          startSession().catch(() => {});
        }}
      />

      {/* Notebook & Copy Camera Modal */}
      <NotebookCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        studentName={profile.name || activeStudents[0]?.name || 'Student'}
        grade={profile.grade || activeStudents[0]?.grade || 'Class 2'}
        onPhotoSubmit={handleCameraPhotoSubmit}
      />

      {/* Student Profile Edit & Delete Modal */}
      <StudentProfileModal
        isOpen={isEditProfileModalOpen}
        currentName={profile.name || activeStudents[0]?.name || ''}
        currentGrade={profile.grade || activeStudents[0]?.grade || 'Class 2'}
        currentRole={profile.role || activeStudents[0]?.role || 'Basic User'}
        currentLanguage={profile.preferredLanguage || 'Hinglish'}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSaveProfile}
        onDelete={handleDeleteProfile}
      />

      {nameChangeConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl border border-emerald-400/40 bg-[#07111e] p-4 shadow-2xl text-white">
            <h3 className="text-base font-bold text-emerald-300 mb-2">Naam badalne ki pushti</h3>
            <p className="text-sm text-slate-200 mb-4">Purana naam: <b>{nameChangeConfirmation.oldName}</b><br/>Naya naam: <b>{nameChangeConfirmation.newName}</b><br/>Aap kya karna chahte hain?</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => { if (nameChangeConfirmation.source === 'manual') handleSaveProfile(pendingManualNameChange.name, pendingManualNameChange.grade, pendingManualNameChange.role, pendingManualNameChange.language, pendingManualNameChange.adminPassword, 'keep'); else sessionRef.current?.resolveNameChange('keep'); setPendingManualNameChange(null); setNameChangeConfirmation(null); }} className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold">Keep</button>
              <button onClick={() => { if (nameChangeConfirmation.source === 'manual') handleSaveProfile(pendingManualNameChange.name, pendingManualNameChange.grade, pendingManualNameChange.role, pendingManualNameChange.language, pendingManualNameChange.adminPassword, 'delete'); else sessionRef.current?.resolveNameChange('delete'); setPendingManualNameChange(null); setNameChangeConfirmation(null); }} className="rounded-lg bg-rose-700 px-3 py-2 text-sm font-bold">Delete</button>
              <button onClick={() => { if (nameChangeConfirmation.source === 'manual') handleSaveProfile(pendingManualNameChange.name, pendingManualNameChange.grade, pendingManualNameChange.role, pendingManualNameChange.language, pendingManualNameChange.adminPassword, 'add'); else sessionRef.current?.resolveNameChange('add'); setPendingManualNameChange(null); setNameChangeConfirmation(null); }} className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-bold">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* APK Installation Guide & Help Modal */}
      <ApkInstallGuideModal
        isOpen={isApkGuideModalOpen}
        onClose={() => setIsApkGuideModalOpen(false)}
        onOpenCamera={() => setIsCameraModalOpen(true)}
        onMarkInstalled={handleMarkAppDownloaded}
        apkUrl={apkDownloadUrl}
      />

      {/* Admin Reply & Direct Message Received Modal (Targeted specifically to this student) */}
      {isChatModalOpen && (
        <ComplaintModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          studentName={profile.name || activeStudents[0]?.name || 'Student'}
          grade={profile.grade || activeStudents[0]?.grade || 'Class 2'}
        />
      )}
    </div>
  );
}


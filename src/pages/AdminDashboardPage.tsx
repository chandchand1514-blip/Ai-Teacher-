import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, Calendar, X, Sparkles, User, ShieldCheck, BarChart3, CheckCircle2, 
  Loader2, Award, Download, Lock, KeyRound, ArrowRight, RefreshCw, AlertCircle, 
  BookOpen, Check, Eye, EyeOff, Menu, ChevronLeft, Users, Search, Filter, 
  Plus, Star, RefreshCcw, FileSpreadsheet, ChevronRight, Activity, ExternalLink, FileCode, Terminal, Copy, MessageSquare,
  Smartphone, Laptop, Bell, Trash2, Send, Crown, Paperclip, CheckCheck, Bot, Edit3, Sliders, RotateCcw, Mic, MicOff, Megaphone
} from 'lucide-react';
import { GradeLevel } from '../types';
import { safeFetchJson } from '../utils/safeFetch';
import { WEEKLY_DAYS, CLASS_TEXTBOOKS, ALL_SUPPORTED_GRADES } from '../data/classTextbooks';
import { generateReportCardPdf } from '../utils/generateReportCardPdf';
import JSZip from 'jszip';

export interface AdminNotification {
  id: string;
  type: 'app_download' | 'app_installed';
  title: string;
  action: string;
  message: string;
  studentName: string;
  grade: string;
  role?: string;
  islamicTitle?: string;
  preferredLanguage?: string;
  deviceId: string;
  deviceType: string;
  visitCount?: number;
  lastTopic?: string;
  timestamp: string;
}

export interface UserRecord {
  id: string;
  name: string;
  grade: string;
  deviceId: string;
  deviceType?: string;
  hasRealName?: boolean;
  isNamePending?: boolean;
  visitCount: number;
  lastTopic: string;
  learnedTopics: string[];
  learnedTopicsCount: number;
  questionsCount: number;
  askedQuestions?: string[];
  weeklyQuestions?: Array<{ question: string; topic: string; date: string }>;
  totalExams: number;
  lastExamDate: string | null;
  lastExamScore: number | null;
  lastExamGradeLetter: string | null;
  averageExamScore: number | null;
  starsCount: number;
  lastActive: string;
  status: string;
  role: string;
  studentRole?: string;
  islamicTitle?: string;
  isLiveNow?: boolean;
  isBlocked?: boolean;
  hasDownloadedApp?: boolean;
  appInstallAction?: string;
  appInstallTimestamp?: string | null;
}

interface ExamMistake {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  topic?: string;
  remedialExplanation?: string;
  practiceQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

interface AdminDashboardPageProps {
  currentGrade: GradeLevel;
  studentName: string;
  lastExamDate?: string;
  initialVerified?: boolean;
  initialTab?: 'dashboard' | 'notifications' | 'users' | 'ads' | 'schedule' | 'exam' | 'security' | 'code' | 'complaints' | 'aicontrol';
  onClose: () => void;
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar?: () => void;
  onFullReset?: () => void;
  onSaveExamResult?: (result: {
    studentName: string;
    grade: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercent: number;
    gradeLetter: string;
    mistakes: ExamMistake[];
  }) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentGrade,
  studentName,
  lastExamDate,
  initialVerified = true,
  initialTab = 'dashboard',
  onClose,
  onSpeakText,
  onAddStar,
  onFullReset,
  onSaveExamResult
}) => {
  // Authentication & Security State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [unlockPasscode, setUnlockPasscode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);

  // Passcode Change Modal State
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);
  const [oldPassInput, setOldPassInput] = useState<string>('');
  const [newPassInput, setNewPassInput] = useState<string>('');
  const [confirmPassInput, setConfirmPassInput] = useState<string>('');
  const [passcodeModalError, setPasscodeModalError] = useState<string>('');
  const [passcodeModalSuccess, setPasscodeModalSuccess] = useState<string>('');
  const [isSubmittingPasscodeChange, setIsSubmittingPasscodeChange] = useState<boolean>(false);


  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notifications' | 'users' | 'ads' | 'schedule' | 'exam' | 'security' | 'code' | 'complaints' | 'aicontrol'>(initialTab);
  const [complaints, setComplaints] = useState<any[]>([]);

  // AI Direct Control / Directives State for Admin Panel
  const [directives, setDirectives] = useState<any[]>([]);
  const [newCommandText, setNewCommandText] = useState<string>('');
  const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);
  const [directiveStatus, setDirectiveStatus] = useState<string>('');
  const [isListeningMicCommand, setIsListeningMicCommand] = useState<boolean>(false);

  // Screen UI Custom Overrides State
  const [uiConfig, setUiConfig] = useState<any>({
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
  const [draftDownloadText, setDraftDownloadText] = useState<string>('Download');
  const [draftBlackboardTitle, setDraftBlackboardTitle] = useState<string>('BLACKBOARD');
  const [draftBannerText, setDraftBannerText] = useState<string>('');
  const [exportFiles, setExportFiles] = useState<Array<{ path: string; content: string }>>([]);
  const [exportReadme, setExportReadme] = useState<string>('');
  const [isLoadingExportFiles, setIsLoadingExportFiles] = useState<boolean>(false);
  const [copiedFileKey, setCopiedFileKey] = useState<string>('');
  const [isDownloadingZip, setIsDownloadingZip] = useState<boolean>(false);
  const [zipDownloadStatus, setZipDownloadStatus] = useState<string>('');

  const syncUiDrafts = React.useCallback((cfg: any) => {
    if (!cfg) return;
    setUiConfig(cfg);
    if (cfg.downloadButtonText !== undefined) setDraftDownloadText(cfg.downloadButtonText);
    if (cfg.blackboardTitle !== undefined) setDraftBlackboardTitle(cfg.blackboardTitle);
    if (cfg.customBannerText !== undefined) setDraftBannerText(cfg.customBannerText || '');
  }, []);

  const fetchUiConfig = React.useCallback(() => {
    safeFetchJson('/api/admin/ui-config')
      .then((data) => {
        if (data?.success && data.uiConfig) {
          syncUiDrafts(data.uiConfig);
        }
      })
      .catch(() => {});
  }, [syncUiDrafts]);

  const fetchDirectives = React.useCallback(() => {
    safeFetchJson('/api/admin/ai-directives')
      .then((data) => {
        if (data?.success && Array.isArray(data.directives)) {
          setDirectives(data.directives);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchDirectives();
    fetchUiConfig();
    const onLiveUiUpdate = (e: any) => {
      if (e?.detail) syncUiDrafts(e.detail);
      else fetchUiConfig();
    };
    window.addEventListener('ui_config_updated', onLiveUiUpdate);
    return () => window.removeEventListener('ui_config_updated', onLiveUiUpdate);
  }, [fetchDirectives, fetchUiConfig, syncUiDrafts]);

  useEffect(() => {
    if (activeTab === 'code' && exportFiles.length === 0) {
      setIsLoadingExportFiles(true);
      safeFetchJson('/api/export-project-files')
        .then((data) => {
          if (data?.success && Array.isArray(data.files)) {
            setExportFiles(data.files);
          }
          if (data?.readme) {
            setExportReadme(data.readme);
          }
        })
        .catch(() => {})
        .finally(() => setIsLoadingExportFiles(false));
    }
  }, [activeTab, exportFiles.length]);

  const handleDownloadVerifiedZip = async () => {
    if (isDownloadingZip) return;
    setIsDownloadingZip(true);
    setZipDownloadStatus('Preparing verified ZIP archive...');
    try {
      let zipBlob: Blob | null = null;
      let fileCountLabel = '';

      // 1. Try authenticated in-session fetch of /api/export-project-zip and verify PK ZIP magic bytes
      try {
        const resp = await fetch('/api/export-project-zip', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const contentType = (resp.headers.get('content-type') || '').toLowerCase();
        if (resp.ok && !contentType.includes('text/html')) {
          const buf = await resp.arrayBuffer();
          const bytes = new Uint8Array(buf);
          // Real ZIP files always start with 'PK' (0x50, 0x4B)
          if (bytes.length > 100 && bytes[0] === 0x50 && bytes[1] === 0x4b) {
            zipBlob = new Blob([buf], { type: 'application/zip' });
            fileCountLabel = `${(bytes.length / (1024 * 1024)).toFixed(2)} MB`;
          }
        }
      } catch (_) {}

      // 2. Fallback: assemble verified ZIP cleanly inside the browser from JSON/public endpoints
      if (!zipBlob) {
        setZipDownloadStatus('Assembling ZIP in browser memory...');
        let filesToPack = exportFiles;
        let binaryPaths: string[] = [
          'public/assets/aistudio/IMG_20261107_021210_8179414f.png',
          'public/assets/aistudio/IMG_20261108_034400_0183eab1.jpg',
          'public/assets/aistudio/_noorani_qaida_ba8f9629.pdf',
        ];
        if (filesToPack.length === 0) {
          const data = await safeFetchJson('/api/export-project-files');
          if (data?.success && Array.isArray(data.files)) {
            filesToPack = data.files;
            setExportFiles(data.files);
          }
          if (Array.isArray(data?.binaryAssets)) {
            binaryPaths = data.binaryAssets;
          }
        }
        if (filesToPack.length === 0) {
          throw new Error('Could not load project source files.');
        }

        const zip = new JSZip();
        const root = 'AI_Teacher_Complete_Source';
        for (const f of filesToPack) {
          zip.file(`${root}/${f.path}`, f.content);
        }
        for (const assetRel of binaryPaths) {
          try {
            const urlPath = assetRel.startsWith('/') ? assetRel : `/${assetRel}`;
            const assetResp = await fetch(urlPath, { credentials: 'include' });
            const cType = (assetResp.headers.get('content-type') || '').toLowerCase();
            if (assetResp.ok && !cType.includes('text/html')) {
              const assetBuf = await assetResp.arrayBuffer();
              zip.file(`${root}/${assetRel}`, assetBuf);
            }
          } catch (_) {}
        }
        zipBlob = await zip.generateAsync({
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: { level: 6 },
        });
        fileCountLabel = `${filesToPack.length}+ files, ${(zipBlob.size / (1024 * 1024)).toFixed(2)} MB`;
      }

      // Trigger pure memory blob download (never hits external DownloadManager cookie gate)
      const blobUrl = URL.createObjectURL(zipBlob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = 'AI_Teacher_Complete_Source.zip';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      setZipDownloadStatus(`Verified ZIP ready & downloading (${fileCountLabel}).`);
    } catch (err: any) {
      setZipDownloadStatus(`Export failed: ${err?.message || 'Try Copy All Files below.'}`);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleUpdateUiConfig = (updates: Partial<any>) => {
    if (updates.downloadButtonVisible !== undefined) {
      const vis = Boolean(updates.downloadButtonVisible);
      setAdminButtonVisible(vis);
      try {
        localStorage.setItem('jarvis_download_btn_visible', JSON.stringify(vis));
      } catch (_) {}
    }
    fetch('/api/admin/ui-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.uiConfig) {
          syncUiDrafts(data.uiConfig);
          if (data.uiConfig.downloadButtonVisible !== undefined) {
            setAdminButtonVisible(Boolean(data.uiConfig.downloadButtonVisible));
          }
          setDirectiveStatus('🟢 Screen UI Updated Live!');
          try {
            window.dispatchEvent(new Event('app_config_updated'));
            window.dispatchEvent(new CustomEvent('ui_config_updated', { detail: data.uiConfig }));
          } catch (_) {}
          setTimeout(() => setDirectiveStatus(''), 3000);
        }
      })
      .catch(() => {});
  };

  const handleResetAll = () => {
    setIsSendingCommand(true);
    setDirectiveStatus('Resetting all Screen UI and AI Directives to default...');
    fetch('/api/admin/reset-all', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSendingCommand(false);
        if (data?.success) {
          if (data.uiConfig) syncUiDrafts(data.uiConfig);
          if (Array.isArray(data.directives)) setDirectives(data.directives);
          setDirectiveStatus('✨ RESET COMPLETE: Sabhi UI changes aur AI directives default par aa gaye hain!');
          onSpeakText('Sabhi UI changes aur AI directives ko default par reset kar diya gaya hai!');
          setTimeout(() => setDirectiveStatus(''), 4500);
        }
      })
      .catch((err) => {
        setIsSendingCommand(false);
        setDirectiveStatus('❌ Reset Error: ' + (err?.message || err));
      });
  };

  const handleSendDirective = (textToSend?: string) => {
    const text = (textToSend || newCommandText).trim();
    if (!text) return;

    const lowerText = text.toLowerCase();
    if (lowerText.includes('reset') || lowerText.includes('default') || lowerText.includes('back to back reset')) {
      handleResetAll();
      setNewCommandText('');
      return;
    }

    const hasHide = /(hide|chhipa|chupa|hata|gayab|band|remove|off)/i.test(lowerText);
    const hasShow = /(show|dikha|chalu|on|wapas|always|hamesha)/i.test(lowerText);
    const hasLiveOnly = /(sirf.*(?:chalu|live|start|active)|usi\s*samay.*(?:chalu|live|dikhe|dikhna)|tabhi\s*dikhe|only\s*when\s*live|jab\s*ai\s*teacher\s*chalu)/i.test(lowerText);

    const extractQuotedOrTail = (raw: string, prefixRe: RegExp) => {
      const q = raw.match(/["'“”‘’]([^"'“”‘’]+)["'“”‘’]/);
      if (q && q[1]?.trim()) return q[1].trim();
      return raw
        .replace(prefixRe, '')
        .replace(/^(?:ka|ke|ki|par|pe)?\s*(?:naam|name|text|title|label|likho|likh\s*do|rakh\s*do|badal\s*kar|set\s*karo|:)+\s*/i, '')
        .replace(/\b(?:kar\s*do|kardo|rakh\s*do|likh\s*do|set\s*karo|bana\s*do|karo)\b\.?$/gi, '')
        .trim();
    };

    const uiUpdates: Record<string, any> = {};
    if (lowerText.includes('profile')) {
      if (hasLiveOnly) {
        uiUpdates.profileVisible = true;
        uiUpdates.profileOnlyWhenLive = true;
      } else if (hasHide) {
        uiUpdates.profileVisible = false;
      } else if (hasShow) {
        uiUpdates.profileVisible = true;
        uiUpdates.profileOnlyWhenLive = false;
      }
    }

    if (lowerText.includes('download')) {
      if (hasLiveOnly) {
        uiUpdates.downloadButtonVisible = true;
        uiUpdates.downloadButtonOnlyWhenLive = true;
      } else if (/(naam|name|text|likho|label|badal|change|["'“”])/i.test(lowerText) && !hasHide) {
        const val = extractQuotedOrTail(text, /^.*?download\s*(?:button|btn)?\s*/i);
        if (val && val.length < 40) uiUpdates.downloadButtonText = val;
      } else if (hasHide) {
        uiUpdates.downloadButtonVisible = false;
      } else if (hasShow) {
        uiUpdates.downloadButtonVisible = true;
        uiUpdates.downloadButtonOnlyWhenLive = false;
      }
    }

    if (lowerText.includes('blackboard') || lowerText.includes('black board')) {
      if ((hasHide || hasShow) && !/(title|naam|name|text|likho)/i.test(lowerText)) {
        uiUpdates.blackboardVisible = !hasHide;
      } else {
        const val = extractQuotedOrTail(text, /^.*?black\s*board\s*/i);
        if (val && val.length < 45) uiUpdates.blackboardTitle = val;
      }
    }

    if (lowerText.includes('banner')) {
      const val = hasHide ? '' : extractQuotedOrTail(text, /^.*?banner\s*/i);
      uiUpdates.customBannerText = val;
    }

    if (Object.keys(uiUpdates).length > 0) {
      handleUpdateUiConfig(uiUpdates);
      setNewCommandText('');
      return;
    }

    setIsSendingCommand(true);
    setDirectiveStatus('Sending command to AI Teacher...');

    fetch('/api/admin/ai-directives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandText: text, active: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSendingCommand(false);
        if (data?.success && Array.isArray(data.directives)) {
          setDirectives(data.directives);
          setNewCommandText('');
          setDirectiveStatus('🟢 Command active in AI Teacher session & UI synced!');
          setTimeout(() => setDirectiveStatus(''), 3500);
        }
      })
      .catch((err) => {
        setIsSendingCommand(false);
        setDirectiveStatus('❌ Error: ' + (err?.message || err));
      });
  };

  const handleToggleDirective = (id: string, currentActive: boolean) => {
    fetch('/api/admin/ai-directives/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !currentActive }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.directives)) {
          setDirectives(data.directives);
        }
      })
      .catch(() => {});
  };

  const handleDeleteDirective = (id: string) => {
    fetch('/api/admin/ai-directives/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.directives)) {
          setDirectives(data.directives);
        }
      })
      .catch(() => {});
  };

  const handleStartMicSpeechCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setDirectiveStatus('⚠️ Browser mein voice recognition text support nahi mila. Type karke command dein.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListeningMicCommand(true);
        setDirectiveStatus('🎙️ Sun raha hoon... Boliyen apna command (e.g. "User se poocho homework ho gaya?")');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setNewCommandText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListeningMicCommand(false);
        setDirectiveStatus('❌ Voice recognition error: ' + event.error);
      };

      recognition.onend = () => {
        setIsListeningMicCommand(false);
        setDirectiveStatus('🟢 Voice input complete. Send Command click karein ya auto-active.');
      };

      recognition.start();
    } catch (err: any) {
      setIsListeningMicCommand(false);
      setDirectiveStatus('❌ Voice error: ' + (err?.message || err));
    }
  };

  // Notifications State (for App Download and Install alerts)
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationsFilter, setNotificationsFilter] = useState<'all' | 'download' | 'installed'>('all');
  const [isNotificationsLoading, setIsNotificationsLoading] = useState<boolean>(false);

  // Dynamic APK Download settings state for Chand Admin
  const [adminApkUrl, setAdminApkUrl] = useState<string>('https://files.catbox.moe/odha8f.apk');
  const [adminButtonVisible, setAdminButtonVisible] = useState<boolean>(true);
  const [adminHiddenDevices, setAdminHiddenDevices] = useState<string[]>([]);
  const [adminHiddenUsers, setAdminHiddenUsers] = useState<string[]>([]);
  const [isSavingAppConfig, setIsSavingAppConfig] = useState<boolean>(false);
  const [appConfigSaveStatus, setAppConfigSaveStatus] = useState<string>('');

  // Complaint Reply & Live Chat Support State
  const [selectedThreadKey, setSelectedThreadKey] = useState<string | null>(null);
  const [mobileChatView, setMobileChatView] = useState<'list' | 'chat'>('list');
  const [replyText, setReplyText] = useState<string>('');
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [isSendingReply, setIsSendingReply] = useState<boolean>(false);
  const [replyStatus, setReplyStatus] = useState<string>('');
  const [complaintSearchQuery, setComplaintSearchQuery] = useState<string>('');
  const [previewAdminFullImage, setPreviewAdminFullImage] = useState<string | null>(null);
  const adminReplyFileRef = useRef<HTMLInputElement | null>(null);
  const adminChatScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (adminChatScrollRef.current) {
      adminChatScrollRef.current.scrollTop = adminChatScrollRef.current.scrollHeight;
    }
  }, [selectedThreadKey, complaints, mobileChatView]);

  const unrepliedCountTotal = useMemo(() => {
    return complaints.filter((c: any) => !c.adminReply).length;
  }, [complaints]);

  const [adminSelectedMessageIds, setAdminSelectedMessageIds] = useState<string[]>([]);
  const [adminCopiedToast, setAdminCopiedToast] = useState<boolean>(false);
  const adminLongPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSelectAdminMessage = (id: string) => {
    setAdminSelectedMessageIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const startAdminPressTimer = (id: string) => {
    if (adminLongPressTimerRef.current) clearTimeout(adminLongPressTimerRef.current);
    adminLongPressTimerRef.current = setTimeout(() => {
      toggleSelectAdminMessage(id);
    }, 400);
  };

  const clearAdminPressTimer = () => {
    if (adminLongPressTimerRef.current) {
      clearTimeout(adminLongPressTimerRef.current);
      adminLongPressTimerRef.current = null;
    }
  };

  const handleAdminBubbleClick = (id: string) => {
    if (adminSelectedMessageIds.length > 0) {
      toggleSelectAdminMessage(id);
    }
  };

  const handleCopyAdminSelected = (bubbles: any[]) => {
    const selectedTexts = bubbles
      .filter((b) => adminSelectedMessageIds.includes(b.id) && b.text && b.text.trim() !== '[Photo Attachment]')
      .map((b) => `${b.sender === 'admin' ? 'Admin' : (b.studentName || 'Student')}: ${b.text}`)
      .join('\n');

    if (selectedTexts) {
      navigator.clipboard?.writeText(selectedTexts);
    }
    setAdminCopiedToast(true);
    setTimeout(() => {
      setAdminCopiedToast(false);
      setAdminSelectedMessageIds([]);
    }, 1500);
  };

  const handleDeleteAdminSelected = async () => {
    if (adminSelectedMessageIds.length === 0) return;
    try {
      await safeFetchJson('/api/complaints/delete-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: adminSelectedMessageIds }),
      });
      fetchComplaints();
      setAdminSelectedMessageIds([]);
    } catch (err) {
      console.error('Failed to delete messages:', err);
    }
  };

  const [directMessageUser, setDirectMessageUser] = useState<{ name: string; deviceId?: string } | null>(null);
  const [directMessageText, setDirectMessageText] = useState<string>('');
  const [isSendingDirectMessage, setIsSendingDirectMessage] = useState<boolean>(false);

  // AI Support Bot Configuration & Assistant State
  const [aiBotEnabled, setAiBotEnabled] = useState<boolean>(true);
  const [isAiSuggesting, setIsAiSuggesting] = useState<boolean>(false);

  const fetchAiBotConfig = React.useCallback(() => {
    safeFetchJson('/api/admin/ai-bot/config')
      .then((data) => {
        if (data?.success && data.config) {
          setAiBotEnabled(Boolean(data.config.autoReply));
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchAiBotConfig();
  }, [fetchAiBotConfig]);

  const handleToggleAiBot = async () => {
    try {
      const res = await safeFetchJson('/api/admin/ai-bot/toggle', { method: 'POST' });
      if (res?.success && res.config) {
        setAiBotEnabled(Boolean(res.config.autoReply));
        setReplyStatus(res.config.autoReply ? 'AI Teacher Bot Auto-Reply Enabled 🤖' : 'AI Teacher Bot Paused ⏸️');
        setTimeout(() => setReplyStatus(''), 3000);
      }
    } catch (err) {
      console.error('Failed to toggle AI bot', err);
    }
  };

  const handleRequestAiSuggestion = async (currentThread: any[], latestInActive: any) => {
    if (!latestInActive) return;
    setIsAiSuggesting(true);
    try {
      const lastStudentMsg = currentThread.find((m: any) => m.complaint || m.imageUrl) || latestInActive;
      const res = await safeFetchJson('/api/admin/ai-bot/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintText: lastStudentMsg.complaint,
          imageUrl: lastStudentMsg.imageUrl,
          studentName: latestInActive.studentName,
          grade: latestInActive.grade,
          history: currentThread.slice(0, 5),
        }),
      });
      if (res?.success && res.replyText) {
        setReplyText(res.replyText);
        setReplyStatus('AI Bot ne jawab bana diya hai! Review karke send karein. 🤖✨');
        setTimeout(() => setReplyStatus(''), 4000);
      }
    } catch (e) {
      console.error('Failed to get AI suggestion', e);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const fetchComplaints = React.useCallback(() => {
    safeFetchJson('/api/admin/complaints')
      .then(data => {
        if (data?.success && Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        }
      })
      .catch(console.error);
  }, []);

  const handleSendComplaintReply = async (complaintId: string, customText?: string, studentMeta?: { studentName?: string; deviceId?: string; grade?: string }) => {
    const textToSend = (customText !== undefined ? customText : replyText).trim();
    const imageToSend = replyImage;
    if (!textToSend && !imageToSend) return;
    setReplyText('');
    setReplyImage(null);
    setIsSendingReply(true);
    setReplyStatus('');
    try {
      const data = await safeFetchJson('/api/admin/complaints/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaintId,
          replyMessage: textToSend || '[Photo Attachment]',
          imageUrl: imageToSend || undefined,
          studentName: studentMeta?.studentName,
          deviceId: studentMeta?.deviceId,
          grade: studentMeta?.grade,
        }),
      });
      if (data?.success) {
        setReplyStatus('Reply bhej diya gaya hai! Student ke chat mein live dikhega. ✅');
        fetchComplaints();
        setTimeout(() => setReplyStatus(''), 4500);
      } else {
        setReplyStatus('Failed to send reply ❌');
      }
    } catch (_) {
      setReplyStatus('Error sending reply ❌');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    try {
      await safeFetchJson(`/api/admin/complaints/${complaintId}`, { method: 'DELETE' });
      fetchComplaints();
    } catch (_) {}
  };

  const handleSendDirectUserMessage = async () => {
    if (!directMessageUser || !directMessageText.trim()) return;
    setIsSendingDirectMessage(true);
    try {
      const data = await safeFetchJson('/api/admin/send-user-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: directMessageUser.name,
          deviceId: directMessageUser.deviceId,
          message: directMessageText.trim(),
        }),
      });
      if (data?.success) {
        setReplyStatus(`Message direct ${directMessageUser.name} ke app par bhej diya gaya hai! ✅`);
        setDirectMessageUser(null);
        setDirectMessageText('');
        setTimeout(() => setReplyStatus(''), 4500);
      }
    } catch (_) {}
    finally {
      setIsSendingDirectMessage(false);
    }
  };

  const fetchAppConfig = React.useCallback(() => {
    safeFetchJson('/api/app-config')
      .then(data => {
        if (data?.success && data.config) {
          if (data.config.apkDownloadUrl) setAdminApkUrl(data.config.apkDownloadUrl);
          if (data.config.globalIsDownloadButtonVisible !== undefined) {
            setAdminButtonVisible(data.config.globalIsDownloadButtonVisible);
          } else if (data.config.isDownloadButtonVisible !== undefined) {
            setAdminButtonVisible(data.config.isDownloadButtonVisible);
          }
          if (Array.isArray(data.config.hiddenDevices)) setAdminHiddenDevices(data.config.hiddenDevices);
          if (Array.isArray(data.config.hiddenUsers)) setAdminHiddenUsers(data.config.hiddenUsers);
        }
      })
      .catch(console.error);
  }, []);

  const handleSaveAppConfig = async (newUrl: string, newVisibility: boolean) => {
    setIsSavingAppConfig(true);
    setAppConfigSaveStatus('');
    try {
      let formattedUrl = newUrl.trim();
      if (formattedUrl) {
        if (/^s:\/\//i.test(formattedUrl)) {
          formattedUrl = formattedUrl.replace(/^s:\/\//i, 'https://');
        } else if (/^ttp:\/\//i.test(formattedUrl)) {
          formattedUrl = formattedUrl.replace(/^ttp:\/\//i, 'http://');
        } else if (/^ttps:\/\//i.test(formattedUrl)) {
          formattedUrl = formattedUrl.replace(/^ttps:\/\//i, 'https://');
        } else if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = 'https://' + formattedUrl;
        }
      }

      const data = await safeFetchJson('/api/admin/app-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apkDownloadUrl: formattedUrl,
          isDownloadButtonVisible: newVisibility,
          hiddenDevices: adminHiddenDevices,
          hiddenUsers: adminHiddenUsers,
        }),
      });
      if (data?.success && data.config) {
        if (data.config.apkDownloadUrl) {
          setAdminApkUrl(data.config.apkDownloadUrl);
        }
        setAppConfigSaveStatus('Link Saved Successfully! ✅ (Naya Link Active Ho Gaya)');
        try {
          window.dispatchEvent(new Event('app_config_updated'));
        } catch (_) {}
        setTimeout(() => setAppConfigSaveStatus(''), 4000);
      } else {
        setAppConfigSaveStatus('Failed to save settings ❌');
      }
    } catch (e) {
      setAppConfigSaveStatus('Error saving settings ❌');
    } finally {
      setIsSavingAppConfig(false);
    }
  };

  const handleToggleUserDownload = async (deviceId: string, studentName: string, hide: boolean) => {
    try {
      const data = await safeFetchJson('/api/admin/toggle-user-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, studentName, hide }),
      });
      if (data?.success && data.config) {
        if (Array.isArray(data.config.hiddenDevices)) setAdminHiddenDevices(data.config.hiddenDevices);
        if (Array.isArray(data.config.hiddenUsers)) setAdminHiddenUsers(data.config.hiddenUsers);
        try {
          window.dispatchEvent(new Event('app_config_updated'));
        } catch (_) {}
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isUserDownloadHidden = (deviceId?: string, studentName?: string): boolean => {
    if (deviceId && adminHiddenDevices.includes(deviceId.trim())) return true;
    if (studentName && adminHiddenUsers.some(u => u.toLowerCase() === studentName.trim().toLowerCase())) return true;
    return false;
  };

  const fetchNotifications = React.useCallback(() => {
    setIsNotificationsLoading(true);
    safeFetchJson('/api/admin/notifications')
      .then(data => {
        if (data?.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      })
      .catch(console.error)
      .finally(() => setIsNotificationsLoading(false));
  }, []);

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
      if (id === 'all') {
        setNotifications([]);
      } else {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchAppConfig();
    const timer = setInterval(() => {
      fetchNotifications();
    }, 8000);
    return () => clearInterval(timer);
  }, [fetchNotifications, fetchAppConfig]);

  useEffect(() => {
    safeFetchJson('/api/admin/complaints')
      .then(data => {
        if (data?.success) setComplaints(data.complaints);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Users Directory State
  const [usersList, setUsersList] = useState<UserRecord[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');
  const [userGradeFilter, setUserGradeFilter] = useState<string>('All');
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserRecord | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentGrade, setNewStudentGrade] = useState<GradeLevel>('Class 1');
  const [newStudentStars, setNewStudentStars] = useState<number>(10);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState<boolean>(false);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [adEvents, setAdEvents] = useState<any[]>([]);
  const [welcomeVideoAdDraft, setWelcomeVideoAdDraft] = useState<{enabled:boolean;title:string;videoUrl:string;linkUrl:string;skipAfterSeconds:number}>({enabled:false,title:'',videoUrl:'',linkUrl:'',skipAfterSeconds:5});
  const [welcomeVideoAdBusy, setWelcomeVideoAdBusy] = useState(false);
  const [welcomeVideoAdStatus, setWelcomeVideoAdStatus] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adText, setAdText] = useState('');
  const [adTargets, setAdTargets] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adPlacement, setAdPlacement] = useState<'bottom'|'top'|'both'>('bottom');
  const [showAdPlacementMenu, setShowAdPlacementMenu] = useState(false);
  const [adBusy, setAdBusy] = useState(false);
  const [adStatus, setAdStatus] = useState('');
  const fetchWelcomeVideoAd = () => safeFetchJson('/api/admin/welcome-video-ad').then(d=>{if(d?.success&&d.config)setWelcomeVideoAdDraft({enabled:Boolean(d.config.enabled),title:String(d.config.title||''),videoUrl:String(d.config.videoUrl||''),linkUrl:String(d.config.linkUrl||''),skipAfterSeconds:Number(d.config.skipAfterSeconds)||0});}).catch(()=>{});
  const saveWelcomeVideoAd = async () => {setWelcomeVideoAdBusy(true);setWelcomeVideoAdStatus('Saving video advertisement...');try{const response=await fetch('/api/admin/welcome-video-ad',{method:'PUT',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify(welcomeVideoAdDraft)});const responseText=await response.text();let data:any;try{data=JSON.parse(responseText);}catch(_){data={error:responseText.slice(0,250)||'Server returned a non-JSON response'};}if(response.ok&&data?.success){setWelcomeVideoAdStatus('✅ Welcome video advertisement saved!');fetchWelcomeVideoAd();}else setWelcomeVideoAdStatus('❌ '+(data?.error||'Save failed'));}catch(e:any){setWelcomeVideoAdStatus('❌ '+(e?.message||'Network error'));}finally{setWelcomeVideoAdBusy(false);}};
  const fetchAds = () => safeFetchJson('/api/admin/ads').then(d => { if(d?.success){setAdsList(d.ads||[]);setAdEvents(d.events||[]);} else { setAdStatus(d?.error || 'Advertisements load nahi ho paaye.'); } }).catch(e => { console.error('Failed to load ads:', e); setAdStatus('Ads load error: ' + (e?.message || 'Server response nahi mila')); });
  const handleCreateAd = async () => {
    if(!adTitle.trim()||!adText.trim()) { setAdStatus('Ad title aur message dono bharna zaroori hai.'); return; }
    setAdBusy(true); setAdStatus('Advertisement save ho raha hai...');
    try {
      const response=await fetch('/api/admin/ads',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({title:adTitle,text:adText,imageUrl:adImageUrl,linkUrl:adLink,targetUsers:adTargets.split(',').map(s=>s.trim()).filter(Boolean),placement:adPlacement,active:true})});
      let d:any=null; try { d=await response.json(); } catch { d=null; }
      if(response.ok && d?.success){setAdTitle('');setAdText('');setAdTargets('');setAdLink('');setAdImageUrl('');setAdPlacement('bottom');setAdStatus('✅ Advertisement successfully create ho gaya!');fetchAds();}
      else { const detail=d?.error||d?.message||response.statusText||'Unknown server error'; setAdStatus('❌ Advertisement save nahi hua (HTTP '+response.status+'): '+detail); }
    } catch(e:any){ console.error('Create ad failed:',e); setAdStatus('❌ Save error: ' + (e?.message || 'Network/server response nahi mila')); }
    finally{setAdBusy(false);}
  };
  const handleDeleteAd = async (id:string) => { try { await safeFetchJson('/api/admin/ads/'+encodeURIComponent(id),{method:'DELETE'});fetchAds();}catch(e){console.error(e);} };
  const handleToggleBlock = async (u:UserRecord) => {
    try { const d=await safeFetchJson('/api/admin/users/'+encodeURIComponent(u.id)+'/block',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({blocked:!u.isBlocked})}); if(d?.success){setUsersList(prev=>prev.map(x=>x.id===u.id?{...x,isBlocked:!u.isBlocked}:x));setSelectedUserForModal(prev=>prev?.id===u.id?{...prev,isBlocked:!u.isBlocked}:prev);fetchUsers();} }catch(e){console.error(e);}
  };




  const fetchUsers = () => {
    setIsUsersLoading(true);
    safeFetchJson('/api/admin/users')
      .then(data => {
        if (data?.success && Array.isArray(data.users)) {
          setUsersList(data.users);
        }
      })
      .catch(err => console.error('Failed to load users:', err))
      .finally(() => setIsUsersLoading(false));
  };

  useEffect(() => { fetchAds(); fetchWelcomeVideoAd(); }, []);

  useEffect(() => {
    fetchUsers();
    // Keep the Admin users directory updated automatically while the panel is open.
    const usersRefreshTimer = window.setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => window.clearInterval(usersRefreshTimer);
  }, []);

  const handleExportUsers = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usersList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `app-users-directory-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    setIsSubmittingNewUser(true);
    try {
      const data = await safeFetchJson('/api/admin/users/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName.trim(),
          grade: newStudentGrade,
          stars: newStudentStars,
        })
      });
      if (data?.success) {
        setIsAddUserModalOpen(false);
        setNewStudentName('');
        fetchUsers();
        onSpeakText(`Naya student ${newStudentName} safalta-poorvak add ho gaya hai!`, 'Kore');
      }
    } catch (_) {}
    finally {
      setIsSubmittingNewUser(false);
    }
  };

  const [userToDeleteConfirm, setUserToDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteUser = (userId: string, userName: string) => {
    setSelectedUserForModal(null);
    setUserToDeleteConfirm({ id: userId, name: userName });
  };

  const confirmDeleteUser = async () => {
    if (!userToDeleteConfirm) return;
    const { id, name } = userToDeleteConfirm;
    try {
      const data = await safeFetchJson(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (data?.success) {
        setSelectedUserForModal(null);
        setUserToDeleteConfirm(null);
        fetchUsers();
        onSpeakText(`User ${name} ko safalta-poorvak delete kar diya gaya hai!`, 'Kore');
      }
    } catch (e) {
      console.error('Failed to delete user:', e);
    }
  };

  // Filtered Users Directory computation
  const filteredUsers = usersList.filter(u => {
    const q = userSearchQuery.trim().toLowerCase();
    const matchesSearch = !q || 
      u.name.toLowerCase().includes(q) ||
      u.grade.toLowerCase().includes(q) ||
      (u.lastTopic && u.lastTopic.toLowerCase().includes(q)) ||
      u.deviceId.toLowerCase().includes(q) ||
      (u.learnedTopics && u.learnedTopics.some(t => t.toLowerCase().includes(q)));

    const matchesGrade = userGradeFilter === 'All' || u.grade.toLowerCase() === userGradeFilter.toLowerCase();
    return matchesSearch && matchesGrade;
  });

  // Sidebar visibility state: 
  // On mobile (< 1024px) we default to false (closed) so the main content is immediately visible full-width!
  // The 3-line hamburger button allows toggling it open/close anytime.
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  // Selected Grade
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(currentGrade || 'Class 1');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Daily Schedule state
  const currentDay = WEEKLY_DAYS[selectedDayIndex] || WEEKLY_DAYS[0];
  const [dailyAnswers, setDailyAnswers] = useState<Record<number, number>>({});
  const [dailySubmitted, setDailySubmitted] = useState<boolean>(false);

  // Weekly Exam state
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examCurrentQIndex, setExamCurrentQIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<{ total: number; correct: number; percent: number; gradeLetter: string } | null>(null);
  const [examMistakes, setExamMistakes] = useState<ExamMistake[]>([]);
  const [activeRemedialMistake, setActiveRemedialMistake] = useState<ExamMistake | null>(null);
  const [isRemedialLoading, setIsRemedialLoading] = useState<boolean>(false);
  const [showFullResetConfirm, setShowFullResetConfirm] = useState<boolean>(false);

  // 7-Day Scheduled Exam Date Calculation
  const lastExamTime = lastExamDate ? new Date(lastExamDate).getTime() : 0;
  const lastExamObj = lastExamTime > 0 ? new Date(lastExamTime) : new Date();
  const nextExamObj = new Date(lastExamObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  const lastExamDisplay = lastExamObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const nextExamDisplay = nextExamObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const daysPassed = lastExamTime > 0 ? (Date.now() - lastExamTime) / (1000 * 60 * 60 * 24) : 999;
  const isExamDue = daysPassed >= 6.5;
  const [examDueWarning, setExamDueWarning] = useState<string>('');

  // Admin panel opens directly without a passcode prompt.

  // Questions generator for selected grade
  const booksForGrade = CLASS_TEXTBOOKS.filter(b => b.grade === selectedGrade);
  const allGradeChapters = booksForGrade.flatMap(b => b.chapters);

  const dayQuestions = allGradeChapters.find(c => c.weeklyDay === currentDay.day)?.dailyQuestions || [
    {
      question: `${selectedGrade} ke ${currentDay.focus}: Sabse mahatvapoorna niyam kya hai?`,
      options: ['Roj niyamit padhna', 'Kitab band rakhna', 'Exam na dena', 'Khelte rehna'],
      correctIndex: 0,
      explanation: 'Har din niyamit padhna sabse accha hota hai.'
    },
    {
      question: `Kitab ke anusar: Padhai karne se hume kya milta hai?`,
      options: ['Gyaan aur safalta (Knowledge)', 'Aalas', 'Bhookh', 'Gussa'],
      correctIndex: 0,
      explanation: 'Padhai karne se gyaan aur safalta milti hai.'
    }
  ];

  const examQuestions = allGradeChapters.flatMap(c => c.dailyQuestions).slice(0, 5);
  const activeExamQuestions = examQuestions.length >= 3 ? examQuestions : [
    {
      question: `${selectedGrade}: Suraj kis disha se ugta hai (Sun rises in)?`,
      options: ['Poorav (East)', 'Pashchim (West)', 'Uttar (North)', 'Dakshin (South)'],
      correctIndex: 0,
      explanation: 'Suraj poorav disha (East) se ugta hai.'
    },
    {
      question: `${selectedGrade} Math: 10 + 5 kitna hota hai?`,
      options: ['12', '15', '20', '25'],
      correctIndex: 1,
      explanation: '10 + 5 = 15 hota hai.'
    },
    {
      question: `${selectedGrade}: Paudhon (Plants) ko khana banane ke liye kya chahiye?`,
      options: ['Dhoop, Paani aur Hawa', 'Kewal andhera', 'Chocolate', 'Tel'],
      correctIndex: 0,
      explanation: 'Paudhe dhoop (sunlight), paani aur hawa se khana banate hain.'
    },
    {
      question: `${selectedGrade}: Hamara Rashtriya Pakshi (National Bird) kaun hai?`,
      options: ['Kabootar', 'Mor (Peacock)', 'Tota', 'Cheel'],
      correctIndex: 1,
      explanation: 'Mor (Peacock) Bharat ka rashtriya pakshi hai.'
    }
  ];

  // Passcode modal handlers below

  const handleOpenPasscodeModal = () => {
    setOldPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
    setPasscodeModalError('');
    setPasscodeModalSuccess('');
    setIsPasscodeModalOpen(true);
  };

  const handleSavePasscodeChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeModalError('');
    setPasscodeModalSuccess('');

    if (!newPassInput.trim() || newPassInput.trim().length < 3) {
      setPasscodeModalError('Naya passcode kam se kam 3 characters ka hona chahie!');
      return;
    }
    if (newPassInput.trim() !== confirmPassInput.trim()) {
      setPasscodeModalError('Naya passcode aur Confirm passcode match nahi kar rahe!');
      return;
    }

    setIsSubmittingPasscodeChange(true);
    try {
      const data = await safeFetchJson('/api/admin/change-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPasscode: oldPassInput.trim(),
          newPasscode: newPassInput.trim(),
        }),
      });
      if (data?.success) {
        setPasscodeModalSuccess('Security Passcode badal gaya hai! ✅');
        setTimeout(() => {
          setIsPasscodeModalOpen(false);
        }, 1500);
      } else {
        setPasscodeModalError(data?.error || 'Passcode update nahi ho saka.');
      }
    } catch (err: any) {
      setPasscodeModalError(err?.message || 'Passcode update failed.');
    } finally {
      setIsSubmittingPasscodeChange(false);
    }
  };

  // Exam Logic
  const handleStartExam = () => {
    if (!isExamDue) {
      setExamDueWarning(`Abhi exam nahi hoga! Hamara exam har 7 din ke baad hi hota hai. Pichhla exam ${lastExamDisplay} ko hua tha. Agla exam 7 din baad yani ${nextExamDisplay} ko hoga! Tab tak roz daily schedule padhein.`);
      return;
    }
    setExamStarted(true);
    setExamCurrentQIndex(0);
    setExamAnswers({});
    setExamFinished(false);
    setExamScore(null);
    setExamMistakes([]);
  };

  const handleSubmitExam = () => {
    let correct = 0;
    const mistakes: ExamMistake[] = [];

    activeExamQuestions.forEach((q, idx) => {
      const userAnsIdx = examAnswers[idx];
      if (userAnsIdx === q.correctIndex) {
        correct++;
      } else {
        mistakes.push({
          question: q.question,
          studentAnswer: typeof userAnsIdx === 'number' ? q.options[userAnsIdx] : 'Answered None',
          correctAnswer: q.options[q.correctIndex],
          topic: `${selectedGrade} Syllabus`
        });
      }
    });

    const total = activeExamQuestions.length;
    const percent = Math.round((correct / total) * 100);
    let letter = 'A+';
    if (percent < 50) letter = 'C';
    else if (percent < 70) letter = 'B';
    else if (percent < 90) letter = 'A';

    setExamScore({ total, correct, percent, gradeLetter: letter });
    setExamMistakes(mistakes);
    setExamFinished(true);

    if (onSaveExamResult) {
      onSaveExamResult({
        studentName: studentName || 'Chand',
        grade: selectedGrade,
        totalQuestions: total,
        correctAnswers: correct,
        scorePercent: percent,
        gradeLetter: letter,
        mistakes
      });
    }

    if (onAddStar) onAddStar();
  };

  const handleDownloadReport = () => {
    generateReportCardPdf({
      id: 'exam_' + Date.now(),
      studentName: studentName || 'Chand',
      grade: selectedGrade,
      date: new Date().toLocaleDateString('en-GB'),
      totalQuestions: examScore?.total || 5,
      correctAnswers: examScore?.correct || 3,
      scorePercent: examScore?.percent || 60,
      gradeLetter: examScore?.gradeLetter || 'B',
      mistakes: examMistakes || [],
      remedialCompleted: false
    });
  };

  // ----------------------------------------------------
  // FULL-PAGE PROFESSIONAL ADMIN PANEL (No standalone password keypad page)
  // ----------------------------------------------------
  if (!isUnlocked) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030611] p-4 text-slate-100">
      <form className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#091526] p-6 space-y-4 shadow-2xl" onSubmit={async (e) => { e.preventDefault(); setUnlockBusy(true); setUnlockError(''); try { const data = await safeFetchJson('/api/admin/verify-passcode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ passcode: unlockPasscode }) }); if (data?.verified) setIsUnlocked(true); else setUnlockError(data?.error || 'Passcode galat hai'); } catch (err: any) { setUnlockError(err?.message || 'Verification failed'); } finally { setUnlockBusy(false); } }}>
        <h1 className="text-xl font-black text-center">Admin Panel</h1>
        <input type="password" inputMode="numeric" autoComplete="current-password" value={unlockPasscode} onChange={e => setUnlockPasscode(e.target.value)} placeholder="Security passcode" className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 text-center" />
        {unlockError && <p className="text-sm text-rose-400 text-center">{unlockError}</p>}
        <button disabled={unlockBusy || !unlockPasscode} className="w-full rounded-xl bg-cyan-600 p-3 font-bold disabled:opacity-50">{unlockBusy ? 'Checking…' : 'Unlock Admin'}</button>
        <button type="button" onClick={onClose} className="w-full rounded-xl bg-slate-800 p-3 font-bold">Close</button>
      </form>
    </div>
  );
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050c17] text-slate-100 font-sans select-none overflow-hidden animate-in fade-in">
      
      {/* Top Navbar */}
      <header className="h-16 px-3 sm:px-6 bg-[#091526] border-b border-cyan-500/20 flex items-center justify-between shrink-0 shadow-lg gap-2 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* THREE LINE (HAMBURGER ☰) BUTTON TO HIDE/SHOW MENU */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            title={isSidebarOpen ? "Menu Hatao / Hide Menu" : "Menu Kholein / Open Menu"}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shadow-md active:scale-95 shrink-0 ${
              isSidebarOpen
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-300 font-black shadow-amber-500/20'
                : 'bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border-amber-500/30'
            }`}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-slate-950 font-black text-lg sm:text-xl shadow-lg shadow-amber-500/20 shrink-0">
            👑
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-black text-white tracking-wide truncate">
                Admin Panel
              </h1>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Notifications Quick Alert Button for Chand Admin */}
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            title="App Download & Install Notifications"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border border-emerald-500/50 text-emerald-300 text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
          >
            <Bell className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden md:inline">App Alerts:</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black">
              {notifications.length}
            </span>
          </button>

          {/* Class Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 px-1 hidden md:inline">Grade:</span>
            {ALL_SUPPORTED_GRADES.slice(0, 5).map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                  selectedGrade === g
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Lock & Exit (Kat Kut Button placed at the circled top-right location) */}
          <button
            type="button"
            onClick={onClose}
            title="Lock & Exit Admin Panel"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/50 text-rose-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body: Sidebar + Dynamic Content */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile Backdrop when Sidebar is Open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-16 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity animate-in fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Navigation Sidebar */}
        <aside
          className={`
            fixed lg:static top-16 bottom-0 left-0 z-50 lg:z-auto
            w-72 sm:w-80 lg:w-64
            bg-[#07111e] border-r border-cyan-500/15
            p-4 flex flex-col justify-between shrink-0
            transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
            ${isSidebarOpen 
              ? 'translate-x-0 opacity-100 visible' 
              : '-translate-x-full lg:w-0 lg:p-0 lg:border-none lg:opacity-0 lg:overflow-hidden invisible pointer-events-none'
            }
          `}
        >
          <div className="space-y-1.5">
            {/* Top row with Title + Close 'Hatao' Button */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                Admin Menu
              </span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer"
                title="Sidebar Hatao (Hide Menu)"
              >
                <X className="w-3.5 h-3.5 text-rose-400" />
                <span>Hatao</span>
              </button>
            </div>

            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'notifications', label: 'App Alerts', icon: Bell, badge: notifications.length > 0 ? `${notifications.length}` : undefined },
              { id: 'users', label: 'Users', icon: Users, badge: usersList.length > 0 ? `${usersList.length}` : undefined },
              { id: 'ads', label: 'Advertisements', icon: Megaphone, badge: adsList.length > 0 ? `${adsList.length}` : undefined },
              { id: 'aicontrol', label: 'AI Control', icon: Bot, badge: directives.filter(d => d.active).length > 0 ? `${directives.filter(d => d.active).length}` : undefined },
              { id: 'schedule', label: 'Study Plan', icon: Calendar },
              { id: 'exam', label: 'Weekly Exam', icon: Trophy },
              { id: 'complaints', label: 'Student Chat', icon: MessageSquare, badge: unrepliedCountTotal > 0 ? `${unrepliedCountTotal}` : (complaints.length > 0 ? `${complaints.length}` : undefined) },
              { id: 'security', label: 'Security', icon: ShieldCheck },
              { id: 'code', label: 'Source Code', icon: FileCode },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    if (tab.id === 'complaints') {
                      setMobileChatView('list');
                    }
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Close</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 scrollbar-thin">

          {/* ---------------------------------------------------- */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Dashboard Overview</h2>
              </div>

              {/* 6 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/35 hover:border-cyan-400 shadow-lg space-y-1.5 cursor-pointer transition-all active:scale-95 text-left"
                >
                  <div className="flex items-center justify-between text-cyan-300 text-[11px] font-bold uppercase font-mono">
                    <span>App Users</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{usersList.length}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notifications')}
                  className="p-4 rounded-2xl bg-[#091526] border border-emerald-500/35 hover:border-emerald-400 shadow-lg space-y-1.5 cursor-pointer transition-all active:scale-95 text-left"
                >
                  <div className="flex items-center justify-between text-emerald-300 text-[11px] font-bold uppercase font-mono">
                    <span>App Alerts</span>
                    <Bell className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">{notifications.length}</div>
                </button>

                <div className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/20 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase font-mono">
                    <span>Admin</span>
                    <User className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-black text-amber-300 font-mono">Chand</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/20 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase font-mono">
                    <span>Passcode</span>
                    <button
                      type="button"
                      onClick={handleOpenPasscodeModal}
                      className="px-2 py-0.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="text-xl font-black text-cyan-200 font-mono tracking-wider">Protected</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/20 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase font-mono">
                    <span>Active Class</span>
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-black text-white">{selectedGrade}</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/20 shadow-lg space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase font-mono">
                    <span>Next Exam</span>
                    <Calendar className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-300 font-mono truncate">{nextExamDisplay}</div>
                </div>
              </div>

              {/* Quick Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-[#081324] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>7-Day Study Plan</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('schedule')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      Open →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <strong className="text-amber-300">{currentDay.hindi} ({currentDay.day})</strong>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                      <strong className="text-white truncate block">{currentDay.focus}</strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#081324] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Weekly Exam Centre</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('exam')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      Open →
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-amber-300 font-bold">{lastExamDisplay}</span>
                    <span className="text-emerald-300 font-bold">{nextExamDisplay}</span>
                    <span className={`font-bold ${isExamDue ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isExamDue ? 'Due' : 'Scheduled'}
                    </span>
                  </div>
                </div>

                {/* Live Users Preview */}
                <div className="p-5 rounded-3xl bg-[#081324] border border-cyan-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>App Users ({usersList.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('users')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {usersList.slice(0, 4).map((u) => (
                      <div
                        key={u.id}
                        onClick={() => setSelectedUserForModal(u)}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            u.name.toLowerCase().includes('chand')
                              ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950'
                              : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                          }`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {u.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                              {u.grade}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-mono font-bold text-emerald-300">
                            {u.lastExamScore !== null ? `${u.lastExamScore}%` : `${u.visitCount}`}
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live App Alerts Preview */}
                <div className="p-5 rounded-3xl bg-[#081324] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span>App Alerts ({notifications.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notifications')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                        No Alerts
                      </div>
                    ) : (
                      notifications.slice(0, 3).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => setActiveTab('notifications')}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-bold text-white truncate">{n.studentName}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                              {n.grade}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: ALL USERS DIRECTORY (सभी यूज़र्स का विवरण) */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>All App Users</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    {usersList.length}
                  </span>
                </h2>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={fetchUsers}
                    disabled={isUsersLoading}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isUsersLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportUsers}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Export</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Targeted Ads Manager */}
              
              {/* Search & Filter Toolbar */}
              <div className="p-3.5 rounded-2xl bg-[#091526] border border-cyan-500/20 shadow-lg">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search user..."
                      className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-sans"
                    />
                    {userSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setUserSearchQuery('')}
                        className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {['All', ...ALL_SUPPORTED_GRADES].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setUserGradeFilter(g)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          userGradeFilter === g
                            ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Table (Desktop / Tablet) */}
              <div className="hidden md:block rounded-3xl bg-[#091526] border border-cyan-500/20 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#07111e] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">User</th>
                      <th className="py-3.5 px-3">Class</th>
                      <th className="py-3.5 px-3">Visits</th>
                      <th className="py-3.5 px-3">Exam</th>
                      <th className="py-3.5 px-3">Stars</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          <p className="font-bold text-sm text-slate-300">No Users Found</p>
                          <button
                            type="button"
                            onClick={() => { setUserSearchQuery(''); setUserGradeFilter('All'); }}
                            className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 text-xs font-bold cursor-pointer"
                          >
                            Reset
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isChand = u.name.toLowerCase().includes('chand');
                        return (
                          <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                  isChand
                                    ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950'
                                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                                }`}>
                                  {u.isNamePending ? <Smartphone className="w-4 h-4" /> : u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-sm text-white">{u.name}</span>
                                  {isChand && (
                                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300">
                                      Admin
                                    </span>
                                  )}
                                  {u.studentRole && u.studentRole !== 'Basic User' && !isChand && (
                                    <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-950 border border-amber-400/50 text-amber-300">
                                      {u.studentRole}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="font-bold text-xs px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
                                {u.grade}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-slate-200">
                              {u.visitCount}
                            </td>

                            <td className="py-3 px-3 font-mono font-bold text-emerald-300">
                              {u.lastExamScore !== null ? `${u.lastExamScore}%` : '—'}
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 text-amber-300 font-mono font-bold text-xs">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{u.starsCount}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              {u.isLiveNow ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  Online
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-medium">
                                  Offline
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserDownload(u.deviceId, u.name, !isUserDownloadHidden(u.deviceId, u.name))}
                                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer shrink-0 ${
                                    isUserDownloadHidden(u.deviceId, u.name)
                                      ? 'bg-amber-950 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                                      : 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                                  }`}
                                >
                                  {isUserDownloadHidden(u.deviceId, u.name) ? 'Show Download' : 'Hide Download'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedUserForModal(u)}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer shrink-0"
                                >
                                  Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Users Cards (Mobile View) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center bg-[#091526] rounded-3xl border border-slate-800 text-slate-400">
                    <p className="font-bold text-sm text-slate-300">No Users Found</p>
                    <button
                      type="button"
                      onClick={() => { setUserSearchQuery(''); setUserGradeFilter('All'); }}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-300 text-xs font-bold cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isChand = u.name.toLowerCase().includes('chand');
                    return (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl bg-[#091526] border border-cyan-500/20 space-y-3 shadow-lg"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                              isChand
                                ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950'
                                : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                            }`}>
                              {u.isNamePending ? <Smartphone className="w-4 h-4" /> : u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-sm text-white truncate">{u.name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                                  {u.grade}
                                </span>
                                {isChand && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                                    Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-amber-300 font-mono font-bold text-xs bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{u.starsCount}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">Visits</span>
                            <strong className="text-white font-mono">{u.visitCount}</strong>
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">Exam</span>
                            <strong className="text-emerald-300 font-mono">
                              {u.lastExamScore !== null ? `${u.lastExamScore}%` : '—'}
                            </strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleUserDownload(u.deviceId, u.name, !isUserDownloadHidden(u.deviceId, u.name))}
                            className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer text-center ${
                              isUserDownloadHidden(u.deviceId, u.name)
                                ? 'bg-amber-950 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                                : 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                            }`}
                          >
                            {isUserDownloadHidden(u.deviceId, u.name) ? 'Show Download' : 'Hide Download'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedUserForModal(u)}
                            className="flex-1 py-2 px-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: 7-DAY STUDY SCHEDULE */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'schedule' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">7-Day Study Curriculum</h2>
                </div>
              </div>

              {/* Day Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {WEEKLY_DAYS.map((wd, idx) => {
                  const isSelected = idx === selectedDayIndex;
                  return (
                    <button
                      key={wd.day}
                      type="button"
                      onClick={() => {
                        setSelectedDayIndex(idx);
                        setDailyAnswers({});
                        setDailySubmitted(false);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20 font-black'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-lg">{wd.emoji}</div>
                      <div className="font-bold text-xs mt-1">{wd.hindi}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                        {wd.focus}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Content */}
              <div className="p-6 rounded-3xl bg-[#091526] border border-cyan-500/20 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {selectedGrade} • {currentDay.hindi} ({currentDay.day})
                    </span>
                    <h3 className="text-xl font-black text-white mt-1">
                      {currentDay.focus}
                    </h3>
                  </div>
                  <div className="text-3xl p-3 rounded-2xl bg-slate-900 border border-amber-500/30">
                    {currentDay.emoji}
                  </div>
                </div>

                {/* Day Questions List */}
                <div className="space-y-4">
                  {dayQuestions.map((q, qIdx) => {
                    const userChoice = dailyAnswers[qIdx];
                    const isSubmitted = dailySubmitted;
                    return (
                      <div key={qIdx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                        <p className="text-xs sm:text-sm font-semibold text-white">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userChoice === optIdx;
                            const isCorrect = q.correctIndex === optIdx;
                            let btnClass = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';

                            if (isSubmitted) {
                              if (isCorrect) {
                                btnClass = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isSelected && !isCorrect) {
                                btnClass = 'bg-rose-950 border-rose-500 text-rose-200';
                              }
                            } else if (isSelected) {
                              btnClass = 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => {
                                  if (!dailySubmitted) {
                                    setDailyAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                  }
                                }}
                                className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnClass}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isSubmitted && (
                          <div className="p-2.5 rounded-xl bg-slate-950 text-xs text-amber-300 border border-amber-900/50">
                            💡 <strong>सही उत्तर:</strong> {q.options[q.correctIndex]} — {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-3">
                  {!dailySubmitted ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDailySubmitted(true);
                        if (onAddStar) onAddStar();
                        onSpeakText(`शाबाश Chand! आपने ${currentDay.hindi} के सवाल पूरे कर लिए।`, 'Kore');
                      }}
                      className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      Check Answers
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setDailySubmitted(false);
                        setDailyAnswers({});
                      }}
                      className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: WEEKLY EXAM CENTRE */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'exam' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {!examStarted ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#091526] border border-cyan-500/25 space-y-5 text-center">
                  <h3 className="text-2xl font-black text-white">Weekly Exam Centre</h3>

                  <div className="p-4 rounded-2xl bg-[#07111e] border border-slate-800 max-w-md mx-auto text-xs">
                    <div className="flex items-center justify-around py-1 text-slate-300 font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Last Exam</span>
                        <strong className="text-amber-300">{lastExamDisplay}</strong>
                      </div>
                      <div className="text-slate-600">→</div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Next Exam</span>
                        <strong className="text-emerald-300">{nextExamDisplay}</strong>
                      </div>
                    </div>
                  </div>

                  {examDueWarning && (
                    <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs font-semibold max-w-md mx-auto">
                      {examDueWarning}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStartExam}
                    className={`py-3.5 px-8 rounded-2xl font-black text-sm tracking-wide transition-all cursor-pointer active:scale-95 shadow-xl ${
                      !isExamDue
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 shadow-none'
                        : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white shadow-rose-500/30'
                    }`}
                  >
                    Start Weekly Exam
                  </button>
                </div>
              ) : !examFinished ? (
                /* Ongoing Exam Screen */
                <div className="p-6 sm:p-8 rounded-3xl bg-[#091526] border border-cyan-500/25 space-y-6">
                  {/* Progress Bar */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Question {examCurrentQIndex + 1} of {activeExamQuestions.length}</span>
                    <span>{selectedGrade} Weekly Exam</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
                      style={{ width: `${((examCurrentQIndex + 1) / activeExamQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Active Question Card */}
                  {(() => {
                    const q = activeExamQuestions[examCurrentQIndex];
                    const currentAnswer = examAnswers[examCurrentQIndex];
                    return (
                      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                          Question {examCurrentQIndex + 1}
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                          {q.question}
                        </h4>
                        <div className="space-y-2 pt-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = currentAnswer === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setExamAnswers(prev => ({ ...prev, [examCurrentQIndex]: optIdx }))}
                                className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-md'
                                    : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Exam Navigation Buttons */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={examCurrentQIndex === 0}
                      onClick={() => setExamCurrentQIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </button>

                    {examCurrentQIndex < activeExamQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setExamCurrentQIndex(prev => prev + 1)}
                        className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer active:scale-95"
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitExam}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs transition-all cursor-pointer active:scale-95 shadow-lg shadow-rose-500/30"
                      >
                        Submit Exam
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#091526] border border-cyan-500/25 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-white">Weekly Exam Report Card</h3>
                  </div>

                  {examScore && (
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Marks</span>
                        <span className="text-xl font-black text-cyan-300 font-mono">{examScore.correct}/{examScore.total}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Score</span>
                        <span className="text-xl font-black text-emerald-400 font-mono">{examScore.percent}%</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Grade</span>
                        <span className="text-xl font-black text-amber-400 font-mono">{examScore.gradeLetter}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExamStarted(false);
                        setExamFinished(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Exam
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 4: SECURITY & ACCESS CONTROL */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'security' && (
            <div className="space-y-5 max-w-4xl mx-auto">
              <h2 className="text-xl sm:text-2xl font-black text-white">Security & Access</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-[#091526] border border-cyan-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <User className="w-4 h-4" />
                    <span>Authorized Admin</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300">
                    Chand
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#091526] border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                      <KeyRound className="w-4 h-4" />
                      <span>Admin Passcode</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenPasscodeModal}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-bold cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-300">
                    Protected
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-rose-950/25 border border-rose-500/35 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
                  <RefreshCcw className="w-4 h-4" />
                  <span>Full Data Reset</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullResetConfirm(true)}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-all cursor-pointer shadow-lg shadow-rose-600/30 flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Full Reset</span>
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: AI TEACHER DIRECT CONTROL & COMMAND CHAT PANEL */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'ads' && (
            <div className="space-y-5 max-w-5xl mx-auto animate-in fade-in">
              <div className="flex items-center justify-between"><h2 className="text-xl sm:text-2xl font-black text-white">Advertisement Center</h2><p className="text-xs text-slate-400">Create, target and monitor ads</p></div>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#091526] border border-cyan-500/30 space-y-4">
                <h3 className="text-sm font-black text-cyan-200">Welcome Screen Video Advertisement</h3><p className="text-xs text-slate-400">App open hote hi Welcome Page se pehle full-screen video ad. X timer ke baad hi dikhega.</p>
                <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={welcomeVideoAdDraft.enabled} onChange={e=>setWelcomeVideoAdDraft(v=>({...v,enabled:e.target.checked}))}/> Enable welcome video advertisement</label>
                <div className="space-y-2 rounded-xl bg-slate-900 border border-slate-700 p-3"><label className="text-xs text-slate-300 font-semibold">Video advertisement upload (maximum 20 MB)</label><input type="file" accept="video/*" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>20*1024*1024){alert('Video 20 MB se chhoti honi chahiye');e.target.value='';return;}setWelcomeVideoAdBusy(true);setWelcomeVideoAdStatus('Uploading video...');try{const response=await fetch('/api/admin/welcome-video-upload',{method:'POST',headers:{'Content-Type':file.type||'application/octet-stream','X-File-Name':encodeURIComponent(file.name)},credentials:'include',body:file});const data=await response.json();if(!response.ok||!data?.success)throw new Error(data?.error||'Upload failed');setWelcomeVideoAdDraft(v=>({...v,videoUrl:data.videoUrl}));setWelcomeVideoAdStatus('✅ Video uploaded successfully. Save settings next.');}catch(err:any){setWelcomeVideoAdStatus('❌ Video upload failed: '+(err?.message||'Network error'));}finally{setWelcomeVideoAdBusy(false);e.target.value='';}}} className="text-xs text-slate-300 file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-cyan-600 file:text-white file:font-bold"/>{welcomeVideoAdDraft.videoUrl&&<div className="space-y-2"><video src={welcomeVideoAdDraft.videoUrl} muted controls className="w-full max-h-56 rounded-xl bg-black"/><button type="button" onClick={()=>setWelcomeVideoAdDraft(v=>({...v,videoUrl:''}))} className="text-xs text-rose-300">Remove video</button></div>}</div>
                <input value={welcomeVideoAdDraft.title} onChange={e=>setWelcomeVideoAdDraft(v=>({...v,title:e.target.value}))} placeholder="Advertisement title (optional)" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/><input value={welcomeVideoAdDraft.linkUrl} onChange={e=>setWelcomeVideoAdDraft(v=>({...v,linkUrl:e.target.value}))} placeholder="Advertisement link URL (optional)" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/>
                <div className="flex items-center gap-3"><label className="text-xs font-semibold text-slate-300">X appears after (seconds)</label><input type="number" min="0" max="60" value={welcomeVideoAdDraft.skipAfterSeconds} onChange={e=>setWelcomeVideoAdDraft(v=>({...v,skipAfterSeconds:Math.max(0,Math.min(60,Number(e.target.value)||0))}))} className="w-24 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/></div>
                <button type="button" onClick={saveWelcomeVideoAd} disabled={welcomeVideoAdBusy} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold disabled:opacity-50">{welcomeVideoAdBusy?'Saving...':'Save Welcome Video Advertisement'}</button>{welcomeVideoAdStatus&&<p className={`text-xs font-semibold ${welcomeVideoAdStatus.startsWith('❌')?'text-rose-300':'text-emerald-300'}`}>{welcomeVideoAdStatus}</p>}
              </div>
              <div className="p-4 rounded-2xl bg-[#091526] border border-fuchsia-500/30 space-y-3">
                <h3 className="text-sm font-black text-fuchsia-200">Targeted Advertisement Manager</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input value={adTitle} onChange={e=>setAdTitle(e.target.value)} placeholder="Ad title" className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/>
                  <input value={adLink} onChange={e=>setAdLink(e.target.value)} placeholder="Optional link URL" className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/>
                  <div className="flex flex-col gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700">
                  <label className="text-xs text-slate-300 font-semibold">Choose advertisement image from Gallery</label>
                  <input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0]; if(!file)return; if(file.size>4*1024*1024){alert('Image 4 MB se chhoti honi chahiye');e.target.value='';return;} const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');const max=700;const scale=Math.min(1,max/Math.max(img.width,img.height));canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);const ctx=canvas.getContext('2d');if(!ctx){setAdImageUrl(String(reader.result||''));return;}ctx.drawImage(img,0,0,canvas.width,canvas.height);setAdImageUrl(canvas.toDataURL('image/jpeg',0.62));};img.onerror=()=>setAdImageUrl(String(reader.result||''));img.src=String(reader.result||'');};reader.readAsDataURL(file);}} className="text-xs text-slate-300 file:mr-2 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-fuchsia-600 file:text-white file:font-bold"/>
                  {adImageUrl&&<div className="flex items-center gap-2"><img src={adImageUrl} alt="Ad preview" className="w-20 h-20 object-cover rounded-lg border border-slate-700"/><button type="button" onClick={()=>setAdImageUrl('')} className="text-xs text-rose-300">Remove image</button></div>}
                </div>
                </div>
                <textarea value={adText} onChange={e=>setAdText(e.target.value)} placeholder="Advertisement message" rows={2} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/>
                <label className="block text-xs font-semibold text-slate-300">Advertisement placement</label>
                <div className="relative rounded-2xl border border-fuchsia-400/25 bg-gradient-to-br from-slate-900 via-[#111827] to-[#1e1235] p-3 shadow-[0_8px_30px_rgba(168,85,247,0.12)]"><label className="block text-xs font-bold tracking-wide text-fuchsia-200 mb-2">Ad placement</label><button type="button" onClick={()=>setShowAdPlacementMenu(v=>!v)} className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-950/80 border border-fuchsia-300/25 text-white text-sm font-semibold shadow-inner hover:border-fuchsia-300/50 transition-all"><span>{adPlacement==='bottom'?'Bottom only':adPlacement==='top'?'Top only':'Both (same ad)'}</span><span className="text-fuchsia-300 text-xs">{showAdPlacementMenu?'▲':'▼'}</span></button>{showAdPlacementMenu&&<div className="absolute z-40 right-0 top-full mt-1.5 w-44 p-1.5 rounded-xl bg-[#0b1220]/98 backdrop-blur-xl border border-fuchsia-300/25 shadow-[0_10px_28px_rgba(0,0,0,0.55)] space-y-0.5">{(['bottom','top','both'] as const).map((option)=><button key={option} type="button" onClick={()=>{setAdPlacement(option);setShowAdPlacementMenu(false);}} className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs font-semibold transition-all ${adPlacement===option?'bg-fuchsia-500/15 border border-fuchsia-300/35 text-fuchsia-100':'border border-transparent text-slate-200 hover:bg-white/5 hover:border-white/10'}`}><span>{option==='bottom'?'Bottom only':option==='top'?'Top only':'Both (same ad)'}</span>{adPlacement===option&&<span className="text-fuchsia-300">✓</span>}</button>)}</div>}<p className="mt-2 text-[10px] text-slate-400">Choose where this advertisement appears.</p></div>
                <input value={adTargets} onChange={e=>setAdTargets(e.target.value)} placeholder="Target user names/device IDs (comma separated; blank = all users)" className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"/>
                <button type="button" onClick={handleCreateAd} disabled={adBusy||!adTitle.trim()||!adText.trim()} className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold disabled:opacity-50">{adBusy?'Saving...':'Create Advertisement'}</button>
                {adStatus && <p role="status" className={`text-xs font-semibold ${adStatus.startsWith('❌')?'text-rose-300':'text-emerald-300'}`}>{adStatus}</p>}
                <div className="space-y-2">{adsList.map(ad=><div key={ad.id} className="flex items-start justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800"><div className="min-w-0"><b className="text-xs text-white">{ad.title}</b><p className="text-[11px] text-slate-300">{ad.text}</p>{ad.imageUrl&&<img src={ad.imageUrl} alt="Advertisement" className="mt-2 w-24 h-20 object-cover rounded-lg border border-slate-700"/>}{ad.linkUrl&&<p className="text-[10px] text-slate-400 break-all">Link: {ad.linkUrl}</p>}<p className="text-[10px] text-slate-500">Targets: {(ad.targetUsers||[]).join(', ')||'All users'} • {ad.active?'Active':'Inactive'}</p></div><button type="button" onClick={()=>handleDeleteAd(ad.id)} className="text-rose-300 p-1"><Trash2 className="w-4 h-4"/></button></div>)}</div>
                <p className="text-[10px] text-slate-400">Recent ad events: {adEvents.length} (views/clicks tracked by ad ID)</p>
              </div>

            </div>
          )}

          {activeTab === 'aicontrol' && (
            <div className="space-y-5 max-w-5xl mx-auto animate-in fade-in">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-white">AI Teacher Control</h2>
              </div>

              {/* Screen UI Customization */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#081322] border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>Screen UI Controls</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleResetAll}
                    disabled={isSendingCommand}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Download Button Text Editor */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>Download Button Label</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{uiConfig.downloadButtonText || 'Download'}</span>
                    </label>
                    <input
                      type="text"
                      value={draftDownloadText}
                      onChange={(e) => setDraftDownloadText(e.target.value)}
                      onBlur={() => {
                        const val = draftDownloadText.trim();
                        if (val && val !== uiConfig.downloadButtonText) handleUpdateUiConfig({ downloadButtonText: val });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = draftDownloadText.trim();
                          if (val) handleUpdateUiConfig({ downloadButtonText: val });
                        }
                      }}
                      placeholder="Download"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {['Download', 'Download App', 'Get APK'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleUpdateUiConfig({ downloadButtonText: chip })}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Download Button Mode */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Download Button</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold border ${
                        !uiConfig.downloadButtonVisible
                          ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                          : uiConfig.downloadButtonOnlyWhenLive
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      }`}>
                        {!uiConfig.downloadButtonVisible ? 'Hidden' : uiConfig.downloadButtonOnlyWhenLive ? 'AI Live Only' : 'Always'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ downloadButtonVisible: true, downloadButtonOnlyWhenLive: false })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          uiConfig.downloadButtonVisible && !uiConfig.downloadButtonOnlyWhenLive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Always</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ downloadButtonVisible: true, downloadButtonOnlyWhenLive: true })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          uiConfig.downloadButtonVisible && uiConfig.downloadButtonOnlyWhenLive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>AI Live</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ downloadButtonVisible: false })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          !uiConfig.downloadButtonVisible
                            ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </button>
                    </div>
                  </div>

                  {/* Profile Visibility Mode */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Profile Visibility</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold border ${
                        uiConfig.profileVisible === false
                          ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                          : uiConfig.profileOnlyWhenLive
                          ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      }`}>
                        {uiConfig.profileVisible === false ? 'Hidden' : uiConfig.profileOnlyWhenLive ? 'AI Live Only' : 'Always'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ profileVisible: true, profileOnlyWhenLive: false })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          uiConfig.profileVisible !== false && !uiConfig.profileOnlyWhenLive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Always</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ profileVisible: true, profileOnlyWhenLive: true })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          uiConfig.profileVisible !== false && uiConfig.profileOnlyWhenLive
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>AI Live</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ profileVisible: false })}
                        className={`py-2 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          uiConfig.profileVisible === false
                            ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </button>
                    </div>
                  </div>

                  {/* Blackboard Title & Visibility */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 md:col-span-2 lg:col-span-2">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <span>Blackboard Title</span>
                        <span className="text-[10px] text-emerald-400 font-mono">{uiConfig.blackboardTitle || 'BLACKBOARD'}</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleUpdateUiConfig({ blackboardVisible: uiConfig.blackboardVisible === false })}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer ${
                          uiConfig.blackboardVisible !== false
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                            : 'bg-rose-950 text-rose-300 border-rose-500/50'
                        }`}
                      >
                        {uiConfig.blackboardVisible !== false ? 'Visible' : 'Hidden'}
                      </button>
                    </div>
                    <input
                      type="text"
                      value={draftBlackboardTitle}
                      onChange={(e) => setDraftBlackboardTitle(e.target.value)}
                      onBlur={() => {
                        const val = draftBlackboardTitle.trim();
                        if (val && val !== uiConfig.blackboardTitle) handleUpdateUiConfig({ blackboardTitle: val });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = draftBlackboardTitle.trim();
                          if (val) handleUpdateUiConfig({ blackboardTitle: val });
                        }
                      }}
                      placeholder="BLACKBOARD"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {['BLACKBOARD', 'Noorani Board', 'Smart Canvas'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleUpdateUiConfig({ blackboardTitle: chip })}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Home Banner Text */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200">Home Banner</span>
                      {Boolean(uiConfig.customBannerText) && (
                        <button
                          type="button"
                          onClick={() => handleUpdateUiConfig({ customBannerText: '' })}
                          className="text-[10px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={draftBannerText}
                      onChange={(e) => setDraftBannerText(e.target.value)}
                      onBlur={() => {
                        if (draftBannerText.trim() !== (uiConfig.customBannerText || '')) {
                          handleUpdateUiConfig({ customBannerText: draftBannerText.trim() });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleUpdateUiConfig({ customBannerText: draftBannerText.trim() });
                        }
                      }}
                      placeholder="Notice banner..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Preset AI Commands */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#081322] border border-cyan-500/20 space-y-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Quick AI Commands</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    {
                      label: '📝 Homework Status Poocho',
                      cmd: 'Poocho user se ki unka school homework poora ho gaya hai ya nahi!',
                    },
                    {
                      label: '🍔 Khane Ka Sawal Mat Poocho',
                      cmd: 'Aaj khana ya nashta ke baare me user se bilkul mat poocho, seedha padhai shuru karo.',
                    },
                    {
                      label: '📚 Surah Mulk & Yasin Padhao',
                      cmd: 'Aaj class me Surah Mulk aur Surah Yasin ki tilawat aur tarjuma padhao.',
                    },
                    {
                      label: '💯 Test Marks Poocho',
                      cmd: 'Poocho user se ki unke school test me kitne marks aaye hain aur kis subject me help chahiye.',
                    },
                    {
                      label: '❓ Doubts & Questions Poocho',
                      cmd: 'User से pucho kya unhe Maths, Science ya Hindi me koi doubt hai aur board par samjhao.',
                    },
                    {
                      label: '📖 Quran Hifz Status Poocho',
                      cmd: 'User se pucho unhe Quran ke kitne paare aur surah yaad ho chuke hain.',
                    }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendDirective(preset.cmd)}
                      className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/25 hover:border-cyan-400 text-left transition-all active:scale-95 group cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {preset.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Command Box */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#081322] border border-cyan-500/20 space-y-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-cyan-400" />
                  <span>Custom AI Command</span>
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendDirective();
                  }}
                  className="flex flex-col sm:flex-row items-center gap-2"
                >
                  <input
                    type="text"
                    value={newCommandText}
                    onChange={(e) => setNewCommandText(e.target.value)}
                    placeholder="Type AI command..."
                    className="flex-1 w-full px-4 py-3 rounded-2xl bg-slate-950 border border-cyan-500/30 text-white text-xs font-medium focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleStartMicSpeechCommand}
                      className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isListeningMicCommand
                          ? 'bg-rose-600/30 border-rose-500 text-rose-300 animate-pulse'
                          : 'bg-slate-900 border-cyan-500/40 text-cyan-300 hover:bg-cyan-950'
                      }`}
                    >
                      {isListeningMicCommand ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                      <span>{isListeningMicCommand ? 'Listening' : 'Voice'}</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingCommand || !newCommandText.trim()}
                      className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isSendingCommand ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send</span>
                    </button>
                  </div>
                </form>

                {directiveStatus && (
                  <p className="text-xs font-mono font-semibold text-emerald-400 animate-in fade-in">
                    {directiveStatus}
                  </p>
                )}
              </div>

              {/* Active Commands List */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#081322] border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Active Commands ({directives.length})</span>
                  </h3>
                  <button
                    type="button"
                    onClick={fetchDirectives}
                    className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    <span>Refresh</span>
                  </button>
                </div>

                {directives.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <p className="text-xs font-bold text-slate-400">No Active Commands</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {directives.map((dir) => (
                      <div
                        key={dir.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          dir.active
                            ? 'bg-slate-950/90 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                        }`}
                      >
                        <p className="text-xs font-semibold text-white break-words min-w-0">
                          {dir.commandText}
                        </p>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleToggleDirective(dir.id, dir.active)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                              dir.active
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            {dir.active ? 'Active' : 'Paused'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDirective(dir.id)}
                            title="Delete"
                            className="p-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-600/40 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="space-y-4 max-w-6xl mx-auto animate-in fade-in">
              {/* Header Bar - Clean stacked layout on mobile so nothing overlaps behind Auto Reply */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#071322] via-[#0b1d36] to-[#071322] border border-cyan-500/30 shadow-md overflow-hidden">
                <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 w-full sm:w-auto">
                  <h2 className="text-sm sm:text-base font-black text-white truncate">
                    Live Student Complaint Chat
                  </h2>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/40 shrink-0">
                    {complaints.length}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-1.5 w-full sm:w-auto flex-wrap">
                  {/* Auto Reply Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleAiBot}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border shrink-0 ${
                      aiBotEnabled
                        ? 'bg-emerald-950 hover:bg-emerald-900 border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title={aiBotEnabled ? 'Auto-Reply is ON (Taps to pause)' : 'Auto-Reply is Paused (Taps to enable)'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiBotEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                    <span>{aiBotEnabled ? 'Auto Reply: ON' : 'Auto Reply: OFF'}</span>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={fetchComplaints}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Refresh Chat"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>

                    {complaints.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Kya aap sabhi complaints aur chats delete karna chahte hain?')) {
                            handleDeleteComplaint('all');
                            setSelectedThreadKey(null);
                          }
                        }}
                        className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
                        title="Clear All Complaints"
                      >
                        <Trash2 className="w-3 h-3 text-rose-400" />
                        <span>Clear All</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              {replyStatus && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{replyStatus}</span>
                </div>
              )}

              {/* Main Two-Column Professional Chat Desk */}
              {complaints.length === 0 ? (
                <div className="p-12 text-center bg-[#071322]/90 rounded-3xl border border-slate-800/80 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto shadow-inner">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-white">No Student Complaints or Chats Yet</h3>
                </div>
              ) : (
                (() => {
                  // Group complaints into student threads
                  const threadMap: Record<string, any[]> = {};
                  complaints.forEach((c: any) => {
                    const key = c.deviceId || c.studentName || 'student';
                    if (!threadMap[key]) threadMap[key] = [];
                    threadMap[key].push(c);
                  });

                  const threadKeys = Object.keys(threadMap);
                  const activeKey = (selectedThreadKey && threadMap[selectedThreadKey]) ? selectedThreadKey : threadKeys[0];
                  const currentThread = threadMap[activeKey] || [];
                  const latestInActive = currentThread[0] || {};

                  // Filter thread keys by search
                  const filteredKeys = threadKeys.filter((k) => {
                    if (!complaintSearchQuery.trim()) return true;
                    const q = complaintSearchQuery.toLowerCase();
                    const list = threadMap[k];
                    const first = list[0];
                    return (
                      first?.studentName?.toLowerCase().includes(q) ||
                      first?.grade?.toLowerCase().includes(q) ||
                      list.some((item) => item.complaint?.toLowerCase().includes(q))
                    );
                  });

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#050e1a] border border-cyan-500/20 rounded-2xl p-2.5 sm:p-3 shadow-xl min-h-[500px]">
                      {/* Left Column: Student Conversations Directory (4 cols) */}
                      <div className={`md:col-span-4 flex-col gap-2.5 border-b md:border-b-0 md:border-r border-slate-800/80 pr-0 md:pr-3 ${mobileChatView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
                        {/* Search Bar */}
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={complaintSearchQuery}
                            onChange={(e) => setComplaintSearchQuery(e.target.value)}
                            placeholder="Search student or message..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                          />
                        </div>

                        {/* Student Conversations List */}
                        <div className="flex-1 overflow-y-auto space-y-2 max-h-[460px] scrollbar-thin">
                          {filteredKeys.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-500">No matching student found</div>
                          ) : (
                            filteredKeys.map((key) => {
                              const tList = threadMap[key];
                              const latestMsg = tList[0];
                              const isSelected = activeKey === key;
                              const unreadMsgs = tList.filter((item: any) => !item.adminReply);
                              const unreadCount = unreadMsgs.length;
                              const hasUnread = unreadCount > 0;

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => {
                                    setSelectedThreadKey(key);
                                    setMobileChatView('chat');
                                  }}
                                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer border ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-cyan-950/90 to-[#0a233f] border-cyan-400 shadow-lg ring-1 ring-cyan-500/30'
                                      : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700'
                                  }`}
                                >
                                  {/* Avatar with WhatsApp-style badge */}
                                  <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-base shadow-sm">
                                      {latestMsg.studentName ? latestMsg.studentName.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    {hasUnread ? (
                                      <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center border-2 border-[#050e1a] shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-bounce">
                                        {unreadCount}
                                      </span>
                                    ) : (
                                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050e1a]" />
                                    )}
                                  </div>

                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <h4 className="font-bold text-sm text-white truncate">
                                        {latestMsg.studentName || 'Student'}
                                      </h4>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          {new Date(latestMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {hasUnread && (
                                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                                            {unreadCount}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Badges / Message Counter */}
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 shrink-0 font-semibold">
                                        {latestMsg.grade || 'Class 1'}
                                      </span>

                                    </div>

                                    <p className={`text-xs truncate mt-1.5 ${hasUnread ? 'text-white font-medium' : 'text-slate-400'}`}>
                                      {latestMsg.imageUrl ? '📷 Photo ' : ''}
                                      {latestMsg.complaint && latestMsg.complaint !== '[Photo Attachment]' ? latestMsg.complaint : ''}
                                    </p>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Right Column: Dedicated Professional Chat Workspace (8 cols) */}
                      <div className={`md:col-span-8 flex-col h-[520px] bg-[#071322] rounded-xl border border-slate-800/80 overflow-hidden ${mobileChatView === 'list' ? 'hidden md:flex' : 'flex'}`}>
                        {/* Student Header Bar - ALWAYS visible, never disappears when marking messages */}
                        <div className="px-3 sm:px-4 py-2.5 bg-[#0a1829] border-b border-slate-800 flex items-center justify-between shrink-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Mobile Back Button to list */}
                            <button
                              type="button"
                              onClick={() => setMobileChatView('list')}
                              className="md:hidden px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white flex items-center gap-1 text-xs cursor-pointer active:scale-95 shrink-0 border border-slate-700 font-bold"
                              title="Back to Students List"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Back</span>
                            </button>

                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-sm shrink-0">
                              {latestInActive.studentName ? latestInActive.studentName.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-sm text-white truncate">
                                  {latestInActive.studentName || 'Student'}
                                </h3>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 shrink-0">
                                  {latestInActive.grade || 'Class 1'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Selection Action Sub-Bar - Appears neatly below the student header when message(s) are selected */}
                        {adminSelectedMessageIds.length > 0 && (
                          <div className="px-3 sm:px-4 py-2 bg-[#005c4b] border-b border-emerald-500/50 flex items-center justify-between shrink-0 animate-in slide-in-from-top-1 duration-150">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setAdminSelectedMessageIds([])}
                                className="p-1 rounded-full hover:bg-emerald-900/60 text-white transition-all cursor-pointer"
                                title="Cancel Selection"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-xs text-white">
                                {adminSelectedMessageIds.length} Selected
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {adminCopiedToast && (
                                <span className="text-[10px] font-bold text-emerald-200 bg-emerald-900/90 px-2 py-0.5 rounded-full animate-pulse">
                                  Copied! 📋
                                </span>
                              )}
                              {/* Only show Copy button if selected bubbles contain text (hidden for photo only) */}
                              {(() => {
                                const hasText = currentThread.some((m: any) => {
                                  const sid = m.adminReply ? `${m.id}_s` : m.id;
                                  const aid = `${m.id}_a`;
                                  const studentSelected = adminSelectedMessageIds.includes(sid);
                                  const adminSelected = adminSelectedMessageIds.includes(aid);
                                  const entireSelected = adminSelectedMessageIds.includes(m.id);
                                  if ((studentSelected || entireSelected) && m.complaint && m.complaint.trim() !== '[Photo Attachment]' && m.complaint.trim() !== '') return true;
                                  if ((adminSelected || entireSelected) && m.adminReply?.message && m.adminReply.message.trim() !== '[Photo Attachment]' && m.adminReply.message.trim() !== '') return true;
                                  return false;
                                });
                                return hasText ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bubbles: any[] = [];
                                      currentThread.forEach((m: any) => {
                                        if ((m.complaint && m.complaint.trim()) || m.imageUrl) {
                                          bubbles.push({
                                            id: m.adminReply ? `${m.id}_s` : m.id,
                                            sender: 'student',
                                            studentName: m.studentName,
                                            text: (m.complaint && m.complaint.trim() !== '[Photo Attachment]') ? m.complaint.trim() : undefined,
                                          });
                                        }
                                        if (m.adminReply && ((m.adminReply.message && m.adminReply.message.trim()) || m.adminReply.imageUrl)) {
                                          bubbles.push({
                                            id: `${m.id}_a`,
                                            sender: 'admin',
                                            text: (m.adminReply.message && m.adminReply.message.trim() !== '[Photo Attachment]') ? m.adminReply.message.trim() : undefined,
                                          });
                                        }
                                      });
                                      handleCopyAdminSelected(bubbles);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-emerald-900/60 text-white transition-all cursor-pointer active:scale-95"
                                    title="Copy Selected Text"
                                  >
                                    <Copy className="w-4 h-4 text-emerald-100" />
                                  </button>
                                ) : null;
                              })()}

                              <button
                                type="button"
                                onClick={handleDeleteAdminSelected}
                                className="p-1.5 rounded-lg hover:bg-rose-900/60 text-rose-200 transition-all cursor-pointer active:scale-95"
                                title="Delete Selected Messages"
                              >
                                <Trash2 className="w-4 h-4 text-rose-300" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Messages Thread Feed - Completely decoupled bubbles */}
                        <div
                          ref={adminChatScrollRef}
                          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#071322] bg-[radial-gradient(#0e243d_1px,transparent_1px)] [background-size:20px_20px] scrollbar-thin"
                        >
                          {(() => {
                            const bubbles: any[] = [];
                            currentThread.forEach((item: any) => {
                              if ((item.complaint && item.complaint.trim()) || item.imageUrl) {
                                const cleanText = (item.complaint && item.complaint.trim() !== '[Photo Attachment]') ? item.complaint.trim() : undefined;
                                bubbles.push({
                                  id: item.adminReply ? `${item.id}_s` : item.id,
                                  rawId: item.id,
                                  sender: 'student',
                                  text: cleanText,
                                  imageUrl: item.imageUrl,
                                  timestamp: item.timestamp,
                                  studentName: item.studentName,
                                  grade: item.grade,
                                });
                              }
                              if (item.adminReply && ((item.adminReply.message && item.adminReply.message.trim()) || item.adminReply.imageUrl)) {
                                const cleanReply = (item.adminReply.message && item.adminReply.message.trim() !== '[Photo Attachment]') ? item.adminReply.message.trim() : undefined;
                                bubbles.push({
                                  id: `${item.id}_a`,
                                  rawId: item.id,
                                  sender: 'admin',
                                  text: cleanReply,
                                  imageUrl: item.adminReply.imageUrl,
                                  timestamp: item.adminReply.timestamp,
                                  isAiBot: Boolean(item.adminReply.isAiBot || item.adminReply.repliedBy?.includes('AI') || item.adminReply.repliedBy?.includes('Bot')),
                                  repliedBy: item.adminReply.repliedBy,
                                });
                              }
                            });

                            const sortedBubbles = bubbles.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                            if (sortedBubbles.length === 0) {
                              return (
                                <div className="flex items-center justify-center h-full text-center text-xs text-slate-500">
                                  No messages in this chat yet.
                                </div>
                              );
                            }

                            return sortedBubbles.map((bubble: any) => {
                              const isSelected = adminSelectedMessageIds.includes(bubble.id);
                              const isStudent = bubble.sender === 'student';

                              return (
                                <div
                                  key={bubble.id}
                                  className={`flex flex-col ${isStudent ? 'items-start' : 'items-end'}`}
                                  onMouseDown={() => startAdminPressTimer(bubble.id)}
                                  onMouseUp={clearAdminPressTimer}
                                  onTouchStart={() => startAdminPressTimer(bubble.id)}
                                  onTouchEnd={clearAdminPressTimer}
                                  onClick={() => handleAdminBubbleClick(bubble.id)}
                                >
                                  {/* Sender Label */}
                                  {isStudent ? (
                                    <div className="text-[10px] font-mono text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
                                      <User className="w-3 h-3 text-cyan-400" />
                                      <span>{bubble.studentName || 'Student'} ({bubble.grade || 'Class 1'})</span>
                                    </div>
                                  ) : (
                                    <div className="text-[10px] font-mono text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                                      <img
                                        src="/public/assets/aistudio/IMG_20261107_021210_8179414f.png"
                                        alt="Admin"
                                        className="w-3.5 h-3.5 rounded-full object-cover"
                                      />
                                      <span>Admin</span>
                                    </div>
                                  )}

                                  {/* Bubble Container - Selects ONLY this specific bubble */}
                                  <div
                                    className={`relative max-w-[85%] rounded-2xl p-3 shadow-md space-y-2 transition-all cursor-pointer ${
                                      isStudent
                                        ? 'rounded-tl-xs bg-[#0b2138] border border-cyan-500/30 text-white'
                                        : 'rounded-tr-xs bg-gradient-to-br from-[#122e26] to-[#0a1e18] border border-emerald-500/40 text-emerald-100'
                                    } ${isSelected ? 'ring-2 ring-cyan-300 shadow-lg' : ''}`}
                                  >
                                    {isSelected && (
                                      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md z-10">
                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                      </div>
                                    )}

                                    {bubble.imageUrl && (
                                      <img
                                        src={bubble.imageUrl}
                                        alt={isStudent ? 'Student Upload' : 'Admin Attachment'}
                                        onClick={(e) => {
                                          if (adminSelectedMessageIds.length === 0) {
                                            e.stopPropagation();
                                            setPreviewAdminFullImage(bubble.imageUrl);
                                          }
                                        }}
                                        className={`rounded-xl max-h-44 w-full object-cover border cursor-pointer hover:opacity-90 transition-opacity ${
                                          isStudent ? 'border-cyan-400/30' : 'border-emerald-400/30'
                                        }`}
                                      />
                                    )}

                                    {bubble.text && (
                                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{bubble.text}</p>
                                    )}

                                    <div className={`flex items-center justify-end gap-1 text-[9px] font-mono ${
                                      isStudent ? 'text-slate-400' : 'text-emerald-400'
                                    }`}>
                                      <span>{new Date(bubble.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                      {!isStudent && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Quick Preset Answer Chips & AI Assistant Generator */}
                        <div className="px-3 py-1.5 bg-[#0a1829] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                          {/* AI One-Click Auto-Suggest Button */}
                          <button
                            type="button"
                            onClick={() => handleRequestAiSuggestion(currentThread, latestInActive)}
                            disabled={isAiSuggesting}
                            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-950/90 to-cyan-950/90 hover:from-purple-900 hover:to-cyan-900 border border-cyan-400/50 text-cyan-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 shadow-sm disabled:opacity-50"
                            title="AI will analyze the student's problem and craft a smart answer"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${isAiSuggesting ? 'animate-spin' : ''}`} />
                            <span>{isAiSuggesting ? 'AI Soch Raha Hai...' : 'AI Jawab Banaye'}</span>
                          </button>

                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Quick:</span>
                          </span>
                          {[
                            '✅ Aapki samasya solve kar di gayi hai',
                            '📸 Kripya photo khinch kar bhejein',
                            '👍 Ji samajh gaya, theek karta hoon',
                            '👋 Hello! Batayein kya madad chahiye?',
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setReplyText(chip)}
                              className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/60 text-slate-300 hover:text-white text-[10px] font-medium shrink-0 cursor-pointer transition-all active:scale-95"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>

                        {/* Attached Image Preview in Reply Bar */}
                        {replyImage && (
                          <div className="px-3 py-1.5 bg-[#081525] border-t border-slate-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                              <img src={replyImage} alt="Attachment" className="w-8 h-8 rounded object-cover border border-cyan-400" />
                              <span className="text-[10px] text-cyan-200 font-mono">Photo Attached for Reply</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReplyImage(null)}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Reply Form - Clean transparent Send Button */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendComplaintReply(latestInActive.id, undefined, {
                              studentName: latestInActive.studentName,
                              deviceId: latestInActive.deviceId,
                              grade: latestInActive.grade,
                            });
                          }}
                          className="p-2.5 bg-[#0a1829] border-t border-slate-800 flex items-center gap-2 shrink-0"
                        >
                          <input
                            type="file"
                            ref={adminReplyFileRef}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (typeof event.target?.result === 'string') {
                                  setReplyImage(event.target.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }}
                            accept="image/*"
                            className="hidden"
                          />

                          <button
                            type="button"
                            onClick={() => adminReplyFileRef.current?.click()}
                            title="Attach Photo to Reply"
                            className="p-2 rounded-xl hover:bg-slate-800 text-cyan-400 cursor-pointer transition-all active:scale-95 shrink-0 bg-transparent"
                          >
                            <Paperclip className="w-4 h-4" />
                          </button>

                          <textarea
                            rows={1}
                            value={replyText}
                            onChange={(e) => {
                              setReplyText(e.target.value);
                              e.target.style.height = 'auto';
                              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendComplaintReply(latestInActive.id, undefined, {
                                  studentName: latestInActive.studentName,
                                  deviceId: latestInActive.deviceId,
                                  grade: latestInActive.grade,
                                });
                              }
                            }}
                            placeholder={`Reply to ${latestInActive.studentName || 'Student'}...`}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-[#06111f] border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500 resize-none max-h-[120px] overflow-y-auto scrollbar-thin leading-relaxed"
                          />

                          {/* Send Button: Transparent background with clean icon */}
                          <button
                            type="submit"
                            disabled={isSendingReply || (!replyText.trim() && !replyImage)}
                            className="p-2 text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer active:scale-90 disabled:opacity-30 shrink-0 bg-transparent hover:bg-slate-800/60 rounded-full"
                            title="Send Reply"
                          >
                            <Send className="w-5 h-5 text-cyan-400" />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* Full Image Preview Modal for Admin */}
              {previewAdminFullImage && (
                <div
                  className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 animate-in fade-in"
                  onClick={() => setPreviewAdminFullImage(null)}
                >
                  <div className="relative max-w-xl max-h-[90vh]">
                    <img src={previewAdminFullImage} alt="Full View" className="rounded-2xl max-h-[85vh] object-contain shadow-2xl border border-slate-700" />
                    <button
                      onClick={() => setPreviewAdminFullImage(null)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white hover:bg-black"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: APP NOTIFICATIONS & INSTALL ALERTS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 max-w-5xl mx-auto animate-in fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>App Alerts</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    {notifications.length}
                  </span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={fetchNotifications}
                    disabled={isNotificationsLoading}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isNotificationsLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteNotification('all')}
                      className="px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Download Button & APK Link Control */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#09172b] border border-cyan-500/35 shadow-xl space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20">
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    Download Button & APK Link
                  </h3>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border self-start sm:self-auto ${
                    adminButtonVisible
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-950 text-rose-300 border-rose-500/50'
                  }`}>
                    {adminButtonVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-8 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                        APK URL
                      </label>
                      {adminApkUrl && (
                        <a
                          href={adminApkUrl.startsWith('http') ? adminApkUrl : `https://${adminApkUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono font-bold text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Test Link
                        </a>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={adminApkUrl}
                        onChange={(e) => setAdminApkUrl(e.target.value)}
                        placeholder="https://files.catbox.moe/odha8f.apk"
                        className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                      {adminApkUrl && (
                        <button
                          type="button"
                          onClick={() => setAdminApkUrl('')}
                          className="absolute right-2.5 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newVis = !adminButtonVisible;
                        setAdminButtonVisible(newVis);
                        handleSaveAppConfig(adminApkUrl, newVis);
                      }}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        adminButtonVisible
                          ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {adminButtonVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{adminButtonVisible ? 'Hide Button' : 'Show Button'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveAppConfig(adminApkUrl, adminButtonVisible)}
                      disabled={isSavingAppConfig}
                      className="py-2 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      {isSavingAppConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {appConfigSaveStatus && (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{appConfigSaveStatus}</span>
                  </div>
                )}

                {(adminHiddenUsers.length > 0 || adminHiddenDevices.length > 0) && (
                  <div className="pt-2.5 border-t border-cyan-500/20 space-y-2">
                    <span className="text-[11px] font-mono font-bold text-amber-300">
                      Hidden For ({adminHiddenUsers.length + adminHiddenDevices.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {adminHiddenUsers.map((u) => (
                        <span key={u} className="px-2.5 py-1 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                          <span>{u}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleUserDownload('', u, false)}
                            className="p-0.5 rounded-full hover:bg-rose-800 text-rose-200 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {adminHiddenDevices.map((d) => (
                        <span key={d} className="px-2.5 py-1 rounded-xl bg-rose-950 border border-rose-500/50 text-rose-300 font-mono text-[11px] flex items-center gap-1.5">
                          <span>{d.slice(0, 12)}...</span>
                          <button
                            type="button"
                            onClick={() => handleToggleUserDownload(d, '', false)}
                            className="p-0.5 rounded-full hover:bg-rose-800 text-rose-200 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setNotificationsFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notificationsFilter === 'all'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationsFilter('installed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notificationsFilter === 'installed'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Installed ({notifications.filter(n => n.type === 'app_installed').length})
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationsFilter('download')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    notificationsFilter === 'download'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Downloads ({notifications.filter(n => n.type === 'app_download').length})
                </button>
              </div>

              {notifications.length === 0 ? (
                <div className="p-8 text-center bg-[#091526] rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-white">No Alerts</h3>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {notifications
                    .filter(n => {
                      if (notificationsFilter === 'download') return n.type === 'app_download';
                      if (notificationsFilter === 'installed') return n.type === 'app_installed';
                      return true;
                    })
                    .map((n) => {
                      const isInstall = n.type === 'app_installed';
                      const formattedTime = new Date(n.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });

                      return (
                        <div
                          key={n.id}
                          className={`p-3 rounded-2xl border transition-all shadow-md space-y-2 ${
                            isInstall
                              ? 'bg-[#081726] border-emerald-500/40'
                              : 'bg-[#081726] border-cyan-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-black text-white truncate max-w-[140px] sm:max-w-[220px]">
                                {n.studentName}
                              </span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-cyan-300 shrink-0">
                                {n.grade}
                              </span>
                              <span className={`text-[9px] font-bold px-2 py-0.2 rounded-full border shrink-0 ${
                                isInstall
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                  : 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                              }`}>
                                {isInstall ? 'Installed' : 'Download'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] font-mono text-slate-400">
                                {formattedTime}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNotification(n.id)}
                                className="p-1 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] pt-1 border-t border-slate-800/60">
                            {(() => {
                              const isUserHidden = isUserDownloadHidden(n.deviceId, n.studentName);
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserDownload(n.deviceId, n.studentName, !isUserHidden)}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                    isUserHidden
                                      ? 'bg-rose-950 text-rose-300 border border-rose-500/60'
                                      : 'bg-slate-900 text-slate-300 hover:bg-rose-950 hover:text-rose-300 border border-slate-700'
                                  }`}
                                >
                                  {isUserHidden ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-rose-400" />}
                                  <span>{isUserHidden ? 'Show Download' : 'Hide Download'}</span>
                                </button>
                              );
                            })()}

                            <button
                              type="button"
                              onClick={() => {
                                setUserSearchQuery(n.studentName);
                                setActiveTab('users');
                              }}
                              className="ml-auto text-[10px] text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                            >
                              Profile →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Delete / Block User Confirmation Modal (Compact & Topmost) */}
      {userToDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-[270px] bg-[#0a1526] border-2 border-rose-500/50 rounded-2xl p-4 shadow-[0_0_40px_rgba(244,63,94,0.3)] space-y-3 text-center">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-white leading-snug">
              Delete / Block "{userToDeleteConfirm.name}"?
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUserToDeleteConfirm(null)}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30"
              >
                Delete / Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Diagnostic Modal */}
      {selectedUserForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-xs bg-[#0a1526] border border-cyan-500/40 rounded-xl p-3 shadow-2xl space-y-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-lg shrink-0 ${
                  selectedUserForModal.name.toLowerCase().includes('chand')
                    ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 ring-2 ring-amber-400/50'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950'
                }`}>
                  {selectedUserForModal.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">{selectedUserForModal.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    {selectedUserForModal.grade}
                  </span>
                  {selectedUserForModal.role.includes('Admin') && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Visits</span>
                <strong className="text-white text-xs font-mono">{selectedUserForModal.visitCount}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Stars</span>
                <strong className="text-amber-300 text-sm font-mono">{selectedUserForModal.starsCount}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Exam Avg</span>
                <strong className="text-emerald-300 text-sm font-mono">
                  {selectedUserForModal.averageExamScore !== null ? `${selectedUserForModal.averageExamScore}%` : '—'}
                </strong>
              </div>
            </div>

            {selectedUserForModal.learnedTopics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Mastered Topics ({selectedUserForModal.learnedTopics.length})
                </h4>
                <div className="flex flex-wrap gap-1.5 ">
                  {selectedUserForModal.learnedTopics.slice(0,6).map((top, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-200 font-medium">
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedUserForModal.askedQuestions && selectedUserForModal.askedQuestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Recent Questions
                </h4>
                <div className="space-y-1.5 ">
                  {selectedUserForModal.askedQuestions.slice(0,3).map((q, idx) => (
                    <div key={idx} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-200">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUserForModal.weeklyQuestions && selectedUserForModal.weeklyQuestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Weekly Questions
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedUserForModal.weeklyQuestions.slice(0,3).map((wq, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                      <span>{wq.question}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{wq.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-2 rounded-xl bg-[#09182d] border border-cyan-500/30 flex items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-white">Download Button</h4>
              <button
                type="button"
                onClick={() => handleToggleUserDownload(selectedUserForModal.deviceId, selectedUserForModal.name, !isUserDownloadHidden(selectedUserForModal.deviceId, selectedUserForModal.name))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${
                  isUserDownloadHidden(selectedUserForModal.deviceId, selectedUserForModal.name)
                    ? 'bg-amber-950 border-amber-500/60 text-amber-300 hover:bg-amber-900'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/80'
                }`}
              >
                {isUserDownloadHidden(selectedUserForModal.deviceId, selectedUserForModal.name) ? 'Show Download' : 'Hide Download'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleToggleBlock(selectedUserForModal)}
              className={selectedUserForModal.isBlocked ? 'w-full py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 font-bold text-xs cursor-pointer' : 'w-full py-2.5 rounded-2xl bg-amber-600/20 border border-amber-500/50 text-amber-300 font-bold text-xs cursor-pointer'}
            >
              {selectedUserForModal.isBlocked ? 'Unblock User' : 'Block User'}
            </button>

            <button
              type="button"
              onClick={() => handleDeleteUser(selectedUserForModal.id, selectedUserForModal.name)}
              className="w-full py-2.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/50 text-rose-300 font-bold text-xs cursor-pointer transition-all"
            >
              Delete / Block User
            </button>

            <button
              type="button"
              onClick={() => setSelectedUserForModal(null)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
          <form 
            onSubmit={handleCreateStudent}
            className="relative w-full max-w-md bg-[#0a1526] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>Add Student</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Name</label>
              <input
                type="text"
                required
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Student name"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Class</label>
              <select
                value={newStudentGrade}
                onChange={(e) => setNewStudentGrade(e.target.value as GradeLevel)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-sans"
              >
                {ALL_SUPPORTED_GRADES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Stars</label>
              <input
                type="number"
                min={0}
                value={newStudentStars}
                onChange={(e) => setNewStudentStars(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingNewUser || !newStudentName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingNewUser ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

          {/* TAB 5: APP SOURCE CODE & RUNNABLE ZIP EXPORT */}
          {activeTab === 'code' && (
            <div className="space-y-5 max-w-5xl mx-auto animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">App Source Code</h2>
                  {exportFiles.length > 0 && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {exportFiles.length} source files + full assets & lockfile ready in AI_Teacher_Complete_Source.zip
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={handleDownloadVerifiedZip}
                    disabled={isDownloadingZip}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg disabled:opacity-60"
                  >
                    {isDownloadingZip ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{isDownloadingZip ? 'Building Verified ZIP...' : 'Download AI_Teacher_Complete_Source.zip'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const hasReadmeFile = exportFiles.some((f) => f.path === 'README.md');
                      const bundle = [
                        !hasReadmeFile && exportReadme ? `/* === FILE: README.md === */\n${exportReadme}` : '',
                        ...exportFiles.map((f) => `\n/* === FILE: ${f.path} === */\n${f.content}`),
                      ].filter(Boolean).join('\n');
                      if (bundle) {
                        navigator.clipboard.writeText(bundle);
                        setCopiedFileKey('__ALL__');
                        setTimeout(() => setCopiedFileKey(''), 2500);
                      }
                    }}
                    disabled={exportFiles.length === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedFileKey === '__ALL__' ? 'Copied All!' : 'Copy All Files'}</span>
                  </button>
                </div>
              </div>

              {zipDownloadStatus && (
                <div className={`px-4 py-2.5 rounded-2xl border text-xs font-mono ${
                  zipDownloadStatus.startsWith('Export failed')
                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                }`}>
                  {zipDownloadStatus}
                </div>
              )}

              {isLoadingExportFiles ? (
                <div className="p-8 rounded-3xl bg-[#081324] border border-cyan-500/25 flex items-center justify-center gap-2 text-cyan-300 text-xs font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading complete project files...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {exportReadme && !exportFiles.some((f) => f.path === 'README.md') && (
                    <div className="p-4 rounded-3xl bg-[#081324] border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-300">README.md</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(exportReadme);
                            setCopiedFileKey('README');
                            setTimeout(() => setCopiedFileKey(''), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer"
                        >
                          {copiedFileKey === 'README' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-3 rounded-2xl bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-44 border border-slate-800 whitespace-pre-wrap">
                        {exportReadme}
                      </pre>
                    </div>
                  )}

                  {exportFiles.map((fileItem) => (
                    <div key={fileItem.path} className="p-4 rounded-3xl bg-[#081324] border border-cyan-500/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyan-300">{fileItem.path}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fileItem.content);
                            setCopiedFileKey(fileItem.path);
                            setTimeout(() => setCopiedFileKey(''), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer"
                        >
                          {copiedFileKey === fileItem.path ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-3 rounded-2xl bg-slate-950 text-slate-300 text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
                        {fileItem.content.slice(0, 4000)}{fileItem.content.length > 4000 ? '\n... (Use Copy or Download AI_Teacher_Complete_Source.zip for complete file)' : ''}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

      {/* Security Passcode Change Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#0a1829] to-[#040b14] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(6,182,212,0.3)] space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <h3 className="font-extrabold text-base text-white">Change Passcode</h3>
              <button
                type="button"
                onClick={() => setIsPasscodeModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePasscodeChange} className="space-y-3.5 pt-1">
              {passcodeModalError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{passcodeModalError}</span>
                </div>
              )}

              {passcodeModalSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passcodeModalSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Current Passcode</label>
                <input
                  type="password"
                  value={oldPassInput}
                  onChange={(e) => setOldPassInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New Passcode</label>
                <input
                  type="password"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm Passcode</label>
                <input
                  type="password"
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasscodeModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPasscodeChange}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPasscodeChange ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Reset Confirmation Modal */}
      {showFullResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none">
          <div className="relative w-full max-w-md bg-[#0a1526] border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-black text-white">Confirm Full Data Reset?</h3>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFullResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onFullReset) {
                    onFullReset();
                  } else {
                    try {
                      localStorage.clear();
                    } catch (_) {}
                    window.location.reload();
                  }
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-rose-600/30"
              >
                Yes, Full Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

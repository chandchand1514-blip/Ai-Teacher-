import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Volume2,
  X
} from 'lucide-react';

export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'requesting';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  status: MicPermissionState;
  onRequestPermission: () => Promise<boolean>;
  onClose: () => void;
  onContinue: () => void;
}

export const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = () => {
  return null;
};


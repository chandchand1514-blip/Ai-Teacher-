import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardPage } from './AdminDashboardPage';
import { safeFetchJson } from '../utils/safeFetch';

interface AdminPageProps {
  initialVerified?: boolean;
  initialTab?: 'dashboard' | 'notifications' | 'users' | 'schedule' | 'exam' | 'security' | 'code' | 'complaints' | 'aicontrol';
}

export const AdminPage: React.FC<AdminPageProps> = ({
  initialVerified = true,
  initialTab = 'dashboard',
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    safeFetchJson('/api/admin/panel-closed', { method: 'POST' }).catch(() => {});
    navigate('/', { replace: true });
  };

  const handleSpeak = (text: string, voice?: string) => {
    // Disabled browser speech synthesis in Admin Panel per user request
  };

  return (
    <AdminDashboardPage
      currentGrade="Class 1"
      studentName="Chand"
      onClose={handleClose}
      onSpeakText={handleSpeak}
      initialVerified={initialVerified}
      initialTab={initialTab}
    />
  );
};

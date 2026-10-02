/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { RecordsProvider } from './hooks/useRecords';
import { AppLayout } from './components/layout/AppLayout';
import { WelcomeView } from './views/WelcomeView';
import { SignUpView } from './views/SignUpView';
import { SignInView } from './views/SignInView';
import { ForgotPasswordView } from './views/ForgotPasswordView';
import { BiometricSetupView } from './views/BiometricSetupView';
import { BiometricUnlockView } from './views/BiometricUnlockView';
import { DashboardView } from './views/DashboardView';
import { RecordsView } from './views/RecordsView';
import { AddRecordView } from './views/AddRecordView';
import { EditRecordView } from './views/EditRecordView';
import { RecordDetailView } from './views/RecordDetailView';
import { SearchView } from './views/SearchView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { SecurityView } from './views/SecurityView';
import { AboutView } from './views/AboutView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminUsersView } from './views/admin/AdminUsersView';
import { AdminRecordsView } from './views/admin/AdminRecordsView';
import { Lock } from 'lucide-react';

const ScreenRouter: React.FC = () => {
  const { user, activeScreen, loading, isVaultUnlocked } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center animate-pulse">
          <Lock className="w-6 h-6 text-zinc-300" />
        </div>
        <span className="text-xs font-mono tracking-wider text-zinc-500">
          CRYPTOLOCKER INITIALIZING...
        </span>
      </div>
    );
  }

  // Unauthenticated routing
  if (!user) {
    switch (activeScreen) {
      case 'signup':
        return <SignUpView />;
      case 'signin':
        return <SignInView />;
      case 'forgot_password':
        return <ForgotPasswordView />;
      case 'welcome':
      default:
        return <WelcomeView />;
    }
  }

  // Authenticated routing: If vault is locked, require biometric enrollment or biometric unlock
  if (!isVaultUnlocked) {
    if (activeScreen === 'biometric_setup') {
      return <BiometricSetupView />;
    }
    return <BiometricUnlockView />;
  }

  // Authenticated & Unlocked routing
  switch (activeScreen) {
    case 'biometric_unlock':
      return <BiometricUnlockView />;
    case 'biometric_setup':
      return <BiometricSetupView />;
    case 'records':
      return <RecordsView />;
    case 'add_record':
      return <AddRecordView />;
    case 'edit_record':
      return <EditRecordView />;
    case 'record_details':
      return <RecordDetailView />;
    case 'search':
      return <SearchView />;
    case 'settings':
      return <SettingsView />;
    case 'profile':
      return <ProfileView />;
    case 'security':
      return <SecurityView />;
    case 'about':
      return <AboutView />;
    // Admin System Screens
    case 'admin_dashboard':
    case 'admin_activity':
    case 'admin_system':
      return <AdminDashboardView />;
    case 'admin_users':
      return <AdminUsersView />;
    case 'admin_records':
    case 'admin_record_detail':
      return <AdminRecordsView />;
    case 'dashboard':
    default:
      return <DashboardView />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <RecordsProvider>
        <AppLayout>
          <ScreenRouter />
        </AppLayout>
      </RecordsProvider>
    </AuthProvider>
  );
}

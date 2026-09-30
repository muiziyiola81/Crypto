import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { Toast } from '../ui/Toast';
import { OfflineIndicator } from '../ui/OfflineIndicator';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      <Toast />
      <OfflineIndicator />
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {user && <DesktopSidebar />}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-5xl mx-auto w-full pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {user && <BottomNav />}
    </div>
  );
};

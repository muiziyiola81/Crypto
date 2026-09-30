import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-40 flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 shadow-xl backdrop-blur-md">
      <WifiOff className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
      <span>Offline Mode — Using local cryptographic cache</span>
    </div>
  );
};

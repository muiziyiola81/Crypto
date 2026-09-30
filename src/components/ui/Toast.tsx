import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldCheck } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useAuth();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-900/95 text-zinc-100 border border-zinc-700/80 shadow-2xl backdrop-blur-md text-xs font-medium tracking-wide">
        <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

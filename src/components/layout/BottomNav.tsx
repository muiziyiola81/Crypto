import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Key, Plus, Search, Settings } from 'lucide-react';
import { ActiveScreen } from '../../types/auth';

interface NavTab {
  id: ActiveScreen;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAction?: boolean;
}

export const BottomNav: React.FC = () => {
  const { user, activeScreen, navigateTo } = useAuth();

  if (!user) return null;

  const tabs: NavTab[] = [
    { id: 'dashboard', label: 'Vault', icon: LayoutDashboard },
    { id: 'records', label: 'Records', icon: Key },
    { id: 'add_record', label: 'Add', icon: Plus, isAction: true },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 pb-safe">
      <div className="grid grid-cols-5 items-center h-15 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeScreen === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo('add_record')}
                className="flex flex-col items-center justify-center min-h-[44px] cursor-pointer group"
                aria-label="Add Record"
              >
                <div className="w-10 h-10 -mt-3 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-lg group-active:scale-95 transition">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-medium text-zinc-400 mt-1">Add</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className="flex flex-col items-center justify-center min-h-[44px] cursor-pointer relative py-1"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              />
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

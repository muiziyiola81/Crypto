import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Unlock, UserCircle2 } from 'lucide-react';
import { PWAInstallPrompt } from '../ui/PWAInstallPrompt';

export const Header: React.FC = () => {
  const { user, isVaultUnlocked, lockVault, signOut, navigateTo, activeScreen, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo(user && isVaultUnlocked ? 'dashboard' : 'welcome')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
              CL
            </div>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-zinc-200 transition">
              CryptoLocker
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation links only when vault is authenticated AND unlocked */}
        {user && isVaultUnlocked && (
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'dashboard' ? 'text-white font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo('records')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'records' ? 'text-white font-semibold' : ''
              }`}
            >
              Crypto Records
            </button>
            <button
              onClick={() => navigateTo('search')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'search' ? 'text-white font-semibold' : ''
              }`}
            >
              Search
            </button>
            <button
              onClick={() => navigateTo('security')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'security' ? 'text-white font-semibold' : ''
              }`}
            >
              Security
            </button>
            <button
              onClick={() => navigateTo('settings')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'settings' ? 'text-white font-semibold' : ''
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => navigateTo('about')}
              className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
                activeScreen === 'about' ? 'text-white font-semibold' : ''
              }`}
            >
              About
            </button>

            {/* Administrator Only Link */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin_dashboard')}
                className={`transition-colors cursor-pointer whitespace-nowrap px-2 py-0.5 rounded border border-zinc-700 ${
                  activeScreen.startsWith('admin_')
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-300 hover:text-white bg-zinc-900'
                }`}
              >
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <PWAInstallPrompt />

          {user && isVaultUnlocked && (
            <>
              <button
                onClick={lockVault}
                title="Lock Vault immediately"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition cursor-pointer whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-300" />
                <span className="hidden sm:inline">Lock Vault</span>
              </button>

              <button
                onClick={() => navigateTo('profile')}
                title="Profile"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              >
                <UserCircle2 className="w-5 h-5" />
              </button>
            </>
          )}

          {user && !isVaultUnlocked && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Vault Locked</span>
              </div>
              <button
                onClick={signOut}
                className="px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTo('signin')}
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('signup')}
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

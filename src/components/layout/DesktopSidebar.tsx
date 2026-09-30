import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Key,
  PlusCircle,
  Search,
  ShieldCheck,
  Settings,
  User,
  Info,
  Lock,
  Unlock,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { ActiveScreen } from '../../types/auth';

export const DesktopSidebar: React.FC = () => {
  const {
    user,
    activeScreen,
    navigateTo,
    isVaultUnlocked,
    lockVault,
    signOut,
    isAdmin,
  } = useAuth();

  if (!user) return null;

  interface NavItem {
    id: ActiveScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Crypto Records', icon: Key },
    { id: 'add_record', label: 'Add Record', icon: PlusCircle },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'security', label: 'Security & Biometrics', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'about', label: 'About & Encryption', icon: Info },
  ];

  if (isAdmin) {
    navItems.push({
      id: 'admin_dashboard',
      label: 'Admin Console',
      icon: ShieldAlert,
    });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-zinc-950/60 border-r border-zinc-800/80 p-4 min-h-[calc(100vh-3.5rem)]">
      {/* Vault Status Box */}
      <div className="vault-panel p-3.5 rounded-2xl mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isVaultUnlocked ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-xs font-semibold text-zinc-200">
              {isVaultUnlocked ? 'Vault Unlocked' : 'Vault Locked'}
            </span>
          </div>

          {isVaultUnlocked ? (
            <button
              onClick={lockVault}
              title="Lock Vault"
              className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => navigateTo('biometric_unlock')}
              title="Unlock Vault"
              className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-zinc-500 mt-1">
          {isVaultUnlocked
            ? 'Plaintext secrets available'
            : 'Secrets masked in memory'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                isActive
                  ? 'bg-zinc-800/90 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-zinc-800/80 mt-auto">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="truncate mr-2">
            <span className="text-[11px] text-zinc-500 block">Signed in as</span>
            <span className="text-zinc-300 font-mono text-[11px] truncate block">
              {user.email}
            </span>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

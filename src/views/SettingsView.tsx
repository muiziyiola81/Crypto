import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  ShieldCheck,
  Fingerprint,
  Clock,
  Palette,
  Info,
  LogOut,
  Database,
  ChevronRight,
  Download,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { getActiveSupabaseConfig, updateSupabaseConfig } from '../lib/supabase';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const SettingsView: React.FC = () => {
  const { user, signOut, navigateTo, showToast, isAdmin } = useAuth();
  const { isInstallable, install } = usePWAInstall();

  // Custom Supabase configuration dialog
  const [showDbModal, setShowDbModal] = useState(false);
  const activeDb = getActiveSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(activeDb.url || '');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [dbSuccess, setDbSuccess] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const handleSaveDb = (e: React.FormEvent) => {
    e.preventDefault();
    const res = updateSupabaseConfig(supabaseUrl, supabaseKey);
    if (res.success) {
      setDbSuccess(true);
      showToast('Supabase connection updated');
      setTimeout(() => {
        setShowDbModal(false);
        setDbSuccess(false);
        window.location.reload();
      }, 1000);
    } else {
      setDbError(res.error || 'Invalid configuration');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Manage your account, biometric security, Supabase storage, and application preferences.
        </p>
      </div>

      {/* Primary Settings Sections */}
      <div className="vault-panel rounded-2xl divide-y divide-zinc-800/80 overflow-hidden">
        {/* Admin Dashboard Entry (Visible ONLY for authorized administrator) */}
        {isAdmin && (
          <button
            onClick={() => navigateTo('admin_dashboard')}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/80 transition text-left cursor-pointer bg-zinc-900/40 border-l-2 border-l-emerald-400"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white block">Admin Dashboard</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-1.5 py-0.2 rounded">
                    Administrator access verified
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  Inspect registered users, crypto records, and system overview
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        )}

        {/* Account */}
        <button
          onClick={() => navigateTo('profile')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Account</span>
              <span className="text-[11px] text-zinc-400 block truncate max-w-xs">
                {user?.email || 'Authenticated User'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </button>

        {/* Security & Biometric */}
        <button
          onClick={() => navigateTo('security')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Security</span>
              <span className="text-[11px] text-zinc-400 block">
                Biometric setup, passkeys, and memory lock policies
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </button>

        {/* Biometric Passkey quick direct */}
        <button
          onClick={() => navigateTo('biometric_setup')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Biometric / Passkey</span>
              <span className="text-[11px] text-zinc-400 block">
                Configure Touch ID, Face ID, or Windows Hello
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </button>

        {/* Database Configuration */}
        <button
          onClick={() => setShowDbModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Database Connection</span>
              <span className="text-[11px] text-zinc-400 block font-mono">
                {activeDb.isConfigured ? 'Supabase Connected' : 'Supabase (Configure URL/Key)'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </button>

        {/* Session Info */}
        <div className="p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Session</span>
              <span className="text-[11px] text-zinc-400 block">
                Persistent auto-refreshing Supabase session active
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-300">Active</span>
        </div>

        {/* Theme */}
        <div className="p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Theme</span>
              <span className="text-[11px] text-zinc-400 block">
                Monochrome Titanium (Dark)
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-300">Default</span>
        </div>

        {/* Install PWA */}
        {isInstallable && (
          <button
            onClick={install}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Install Progressive Web App</span>
                <span className="text-[11px] text-zinc-400 block">
                  Add CryptoLocker to your home screen or dock
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        )}

        {/* About */}
        <button
          onClick={() => navigateTo('about')}
          className="w-full p-4 flex items-center justify-between hover:bg-zinc-900/60 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">About CryptoLocker</span>
              <span className="text-[11px] text-zinc-400 block">
                Cryptographic architecture, zero-knowledge principles
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600" />
        </button>
      </div>

      {/* Sign Out */}
      <div className="pt-2">
        <button
          onClick={signOut}
          className="w-full py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 text-xs font-medium text-red-300 hover:text-red-200 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of CryptoLocker</span>
        </button>
      </div>

      {/* Supabase Connection Modal */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl vault-panel p-6 shadow-2xl text-zinc-100 border border-zinc-800">
            <h3 className="text-sm font-semibold tracking-tight text-white mb-1">
              Supabase Project Connection
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Connect your Supabase project using the project URL and Anon (public) key. Never use service-role keys in frontend code.
            </p>

            {dbError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-200">
                {dbError}
              </div>
            )}

            {dbSuccess && (
              <div className="mb-4 p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Configuration saved. Reloading vault client...</span>
              </div>
            )}

            <form onSubmit={handleSaveDb} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="vault-input w-full px-3 py-2 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                  Supabase Anon (Public) Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="vault-input w-full px-3 py-2 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDbModal(false)}
                  className="px-3.5 py-2 text-xs text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-xl shadow transition"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


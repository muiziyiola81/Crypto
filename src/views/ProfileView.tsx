import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Shield, Calendar, Key, LogOut, ShieldAlert, ChevronRight } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, session, signOut, navigateTo, isAdmin } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Account Profile
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Vault owner credentials and authentication identity.
        </p>
      </div>

      <div className="vault-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 text-xl font-bold">
            <User className="w-7 h-7 text-zinc-200" />
          </div>
          <div className="truncate">
            <h2 className="text-base font-bold text-white truncate">
              {user?.email || 'Vault Operator'}
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              UID: {user?.id ? `${user.id.slice(0, 14)}...` : 'Unknown'}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-zinc-400">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>Email Address</span>
            </div>
            <span className="text-white font-mono">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-zinc-400">
              <Shield className="w-4 h-4 text-zinc-500" />
              <span>Auth Provider</span>
            </div>
            <span className="text-white font-mono">Supabase Auth (GoTrue)</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-900">
            <div className="flex items-center gap-2 text-zinc-400">
              <Calendar className="w-4 h-4 text-zinc-500" />
              <span>Vault Initialized</span>
            </div>
            <span className="text-zinc-300">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Key className="w-4 h-4 text-zinc-500" />
              <span>Row Level Security (RLS)</span>
            </div>
            <span className="text-zinc-200 font-mono text-[11px]">ENFORCED (auth.uid = user_id)</span>
          </div>
        </div>

        {/* Administrator Dedicated Entry (Strictly for verified admin) */}
        {session && user && isAdmin && (
          <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Admin Dashboard</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.5 rounded">
                      Administrator access verified
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 block mt-0.5">
                    Inspect registered users, crypto records, and system overview
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo('admin_dashboard')}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Open Admin Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800/80">
          <button
            onClick={() => navigateTo('security')}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-white transition cursor-pointer text-center"
          >
            Manage Security & Biometrics
          </button>
          <button
            onClick={signOut}
            className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-red-300 hover:text-red-200 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

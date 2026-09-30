import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { CryptoRecord } from '../../types/crypto';
import {
  ShieldAlert,
  Users,
  Database,
  Layers,
  ArrowRight,
  RefreshCw,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user, navigateTo, lockVault, signOut } = useAuth();
  const { stats, loading, refreshAdminData } = useAdmin();

  const [inspectedRecord, setInspectedRecord] = useState<CryptoRecord | null>(null);
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const toggleFieldReveal = (field: string) => {
    setRevealedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Admin Security Banner */}
      <div className="vault-panel p-6 rounded-3xl border border-zinc-700/80 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-600 text-[10px] font-mono tracking-wider">
                ADMIN CONSOLE
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                <span>Administrator access verified</span>
              </span>
              <span className="text-zinc-600 hidden sm:inline">·</span>
              <span className="text-xs text-zinc-400 font-mono truncate max-w-[200px] sm:max-w-none">
                UID: {user?.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              CryptoLocker Administration
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl">
              Privileged system oversight. Inspect registered user accounts, cryptocurrency records, and chain distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => refreshAdminData()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={lockVault}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-medium transition cursor-pointer"
              title="Lock Console and mask memory"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 border border-zinc-700 text-xs font-medium transition cursor-pointer"
              title="Sign out of administrative session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer"
            >
              User Vault
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-zinc-800">
          <button
            onClick={() => navigateTo('admin_dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 text-xs font-semibold cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => navigateTo('admin_users')}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition cursor-pointer"
          >
            Users ({stats?.totalUsers || 0})
          </button>
          <button
            onClick={() => navigateTo('admin_records')}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition cursor-pointer"
          >
            Crypto Records ({stats?.totalRecords || 0})
          </button>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigateTo('admin_users')}
          className="vault-panel p-4 rounded-2xl text-left hover:border-zinc-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Users</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats ? stats.totalUsers : '-'}
          </div>
          <span className="text-[10px] text-zinc-500">Registered Supabase accounts</span>
        </button>

        <button
          onClick={() => navigateTo('admin_records')}
          className="vault-panel p-4 rounded-2xl text-left hover:border-zinc-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Total Records</span>
            <Database className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats ? stats.totalRecords : '-'}
          </div>
          <span className="text-[10px] text-zinc-500">Stored credentials</span>
        </button>

        <div className="vault-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Categories</span>
            <Layers className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats ? Object.keys(stats.recordsByType).length : '-'}
          </div>
          <span className="text-[10px] text-zinc-500">Active record categories</span>
        </div>

        <div className="vault-panel p-4 rounded-2xl">
          <div className="flex items-center justify-between text-zinc-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Networks</span>
            <ShieldAlert className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {stats ? Object.keys(stats.recordsByNetwork).length : '-'}
          </div>
          <span className="text-[10px] text-zinc-500">Blockchains supported</span>
        </div>
      </div>

      {/* Breakdown by Type and Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="vault-panel p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
            Records by Category Type
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {stats && Object.entries(stats.recordsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-xs py-1">
                <span className="text-zinc-300">{type}</span>
                <span className="font-mono text-zinc-200 tabular-nums font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="vault-panel p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
            Records by Crypto Network
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {stats && Object.entries(stats.recordsByNetwork).map(([net, count]) => (
              <div key={net} className="flex items-center justify-between text-xs py-1">
                <span className="text-zinc-300">{net}</span>
                <span className="font-mono text-zinc-200 tabular-nums font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Records Quick View */}
      <div className="vault-panel p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Recent System Records
          </h3>
          <button
            onClick={() => navigateTo('admin_records')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <span>View All Records & Filter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {stats?.recentRecords.slice(0, 5).map((rec) => (
            <div key={rec.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">
                  {rec.wallet_name}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono truncate block">
                  User: {rec.user_email || rec.user_id.slice(0, 10)} · {rec.record_type} · {rec.crypto_network}
                </span>
              </div>
              <button
                onClick={() => {
                  setRevealedFields({});
                  setInspectedRecord(rec);
                }}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-800 shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Inspect</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Inspector Modal for Overview */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl vault-panel p-6 shadow-2xl text-zinc-100 border border-zinc-800 space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  ADMIN RECORD INSPECTOR
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {inspectedRecord.wallet_name}
                </h2>
                <span className="text-xs text-zinc-400">
                  Provider: {inspectedRecord.exchange_or_wallet_provider} · {inspectedRecord.record_type} ({inspectedRecord.crypto_network})
                </span>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="p-1 text-zinc-500 hover:text-white rounded-md transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Owner UUID: {inspectedRecord.user_id}</span>
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            {/* Masked Secret Fields */}
            <div className="space-y-3 text-xs">
              {[
                { key: 'wallet_password', label: 'Wallet Password', val: inspectedRecord.wallet_password },
                { key: 'pin', label: 'PIN', val: inspectedRecord.pin },
                { key: 'seed_phrase', label: 'Seed Phrase', val: inspectedRecord.seed_phrase, multiline: true },
                { key: 'private_key', label: 'Private Key', val: inspectedRecord.private_key, multiline: true },
                { key: 'two_factor_codes', label: '2FA Codes / Secret', val: inspectedRecord.two_factor_codes },
                { key: 'recovery_codes', label: 'Recovery Codes', val: inspectedRecord.recovery_codes, multiline: true },
                { key: 'wallet_address', label: 'Public Wallet Address', val: inspectedRecord.wallet_address },
                { key: 'username_or_email', label: 'Username / Email', val: inspectedRecord.username_or_email },
                { key: 'notes', label: 'Notes', val: inspectedRecord.notes, multiline: true },
              ].map((f) => {
                if (!f.val) return null;
                const isRevealed = !!revealedFields[f.key];
                return (
                  <div key={f.key} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        {f.label}
                      </span>
                      <button
                        onClick={() => toggleFieldReveal(f.key)}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white font-medium cursor-pointer"
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isRevealed ? 'Mask' : 'Reveal'}</span>
                      </button>
                    </div>

                    <div className="font-mono text-xs text-zinc-200 break-all select-text">
                      {isRevealed ? (
                        f.multiline ? (
                          <pre className="whitespace-pre-wrap leading-relaxed text-zinc-200 font-mono">
                            {f.val}
                          </pre>
                        ) : (
                          <span>{f.val}</span>
                        )
                      ) : (
                        <span className="text-zinc-600 tracking-widest select-none">
                          ••••••••••••••••••••
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RecordCard } from '../components/records/RecordCard';
import {
  Lock,
  Plus,
  Search,
  Settings,
  Layers,
  Shield,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, lockVault, navigateTo, isVaultUnlocked } = useAuth();
  const { records, loading } = useRecords();
  const [quickSearch, setQuickSearch] = useState('');

  const recentRecords = records.slice(0, 5);

  const filteredQuick = quickSearch.trim()
    ? records.filter((r) => {
        const q = quickSearch.toLowerCase();
        return (
          r.wallet_name.toLowerCase().includes(q) ||
          r.exchange_or_wallet_provider.toLowerCase().includes(q) ||
          r.record_type.toLowerCase().includes(q) ||
          r.crypto_network.toLowerCase().includes(q)
        );
      })
    : recentRecords;

  // Breakdown metrics
  const hardwareCount = records.filter((r) => r.record_type === 'Hardware Wallet').length;
  const defiCount = records.filter((r) => r.record_type === 'DeFi' || r.record_type === 'Web3 Account').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="vault-panel p-6 sm:p-7 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                CryptoLocker Protected
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-zinc-400">
                {isVaultUnlocked ? 'Active Unlocked' : 'Locked'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-400 max-w-md">
              Your cryptocurrency credentials and seed phrases are guarded in memory.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigateTo('add_record')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition active:scale-[0.98] shadow cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>

            <button
              onClick={lockVault}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-medium transition cursor-pointer whitespace-nowrap"
              title="Lock Vault"
            >
              <Lock className="w-4 h-4 text-zinc-400" />
              <span className="hidden sm:inline">Lock Vault</span>
            </button>

            <button
              onClick={() => navigateTo('settings')}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards (Zero-pill, tabular numbers) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Total Records
              </span>
              <Layers className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {loading ? '-' : records.length}
            </div>
            <span className="text-[11px] text-zinc-500">Stored credentials</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Cold Hardware
              </span>
              <Shield className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {loading ? '-' : hardwareCount}
            </div>
            <span className="text-[11px] text-zinc-500">Hardware wallets</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-zinc-500 mb-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Web3 & DeFi
              </span>
              <KeyRound className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {loading ? '-' : defiCount}
            </div>
            <span className="text-[11px] text-zinc-500">DeFi operations</span>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Quick search records by wallet, exchange, or network..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          className="vault-input w-full pl-10 pr-4 py-3 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5 pointer-events-none" />
        {quickSearch && (
          <button
            onClick={() => setQuickSearch('')}
            className="absolute right-3 top-3 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
        )}
      </div>

      {/* Recently Added Records */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight text-white">
              {quickSearch ? 'Search Matches' : 'Recently Added Records'}
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              ({filteredQuick.length})
            </span>
          </div>

          <button
            onClick={() => navigateTo('records')}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vault-panel p-4 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : filteredQuick.length === 0 ? (
          <div className="vault-panel p-8 rounded-2xl text-center space-y-3">
            <KeyRound className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-200">No crypto records found</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Add your first Bitcoin, Ethereum, or hardware wallet credentials to the vault.
            </p>
            <button
              onClick={() => navigateTo('add_record')}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Record</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredQuick.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onClick={() => navigateTo('record_details', record.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RecordCard } from '../components/records/RecordCard';
import { RECORD_TYPES, CRYPTO_NETWORKS } from '../lib/constants';
import { RecordType, CryptoNetwork } from '../types/crypto';
import { Plus, Search, Filter, KeyRound } from 'lucide-react';

export const RecordsView: React.FC = () => {
  const { navigateTo } = useAuth();
  const { records, loading } = useRecords();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<RecordType | 'ALL'>('ALL');
  const [selectedNetwork, setSelectedNetwork] = useState<CryptoNetwork | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'created_desc' | 'created_asc' | 'name_asc'>('created_desc');

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        if (selectedType !== 'ALL' && r.record_type !== selectedType) return false;
        if (selectedNetwork !== 'ALL' && r.crypto_network !== selectedNetwork) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = r.wallet_name.toLowerCase().includes(q);
          const matchProvider = r.exchange_or_wallet_provider.toLowerCase().includes(q);
          const matchType = r.record_type.toLowerCase().includes(q);
          const matchNet = r.crypto_network.toLowerCase().includes(q);
          const matchUser = r.username_or_email?.toLowerCase().includes(q);
          const matchAddr = r.wallet_address?.toLowerCase().includes(q);
          if (!matchName && !matchProvider && !matchType && !matchNet && !matchUser && !matchAddr) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'created_desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'created_asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'name_asc') {
          return a.wallet_name.localeCompare(b.wallet_name);
        }
        return 0;
      });
  }, [records, selectedType, selectedNetwork, search, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Crypto Records
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {records.length} credentials stored with Supabase Row Level Security
          </p>
        </div>

        <button
          onClick={() => navigateTo('add_record')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition active:scale-[0.98] shadow cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="vault-panel p-4 rounded-2xl space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search records by name, provider, network, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="vault-input w-full pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <span>Filter:</span>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as RecordType | 'ALL')}
            className="vault-input px-3 py-1.5 rounded-lg text-xs text-white bg-zinc-900 border border-zinc-700/80 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Types</option>
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value as CryptoNetwork | 'ALL')}
            className="vault-input px-3 py-1.5 rounded-lg text-xs text-white bg-zinc-900 border border-zinc-700/80 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Networks</option>
            {CRYPTO_NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'created_desc' | 'created_asc' | 'name_asc')}
            className="vault-input px-3 py-1.5 rounded-lg text-xs text-white bg-zinc-900 border border-zinc-700/80 focus:outline-none cursor-pointer ml-auto"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Record List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="vault-panel p-4 rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="vault-panel p-10 rounded-3xl text-center space-y-3">
          <KeyRound className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-200">No matching records</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or add a new record to your vault.
          </p>
          {(search || selectedType !== 'ALL' || selectedNetwork !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedType('ALL');
                setSelectedNetwork('ALL');
              }}
              className="text-xs text-white underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRecords.map((record) => (
            <RecordCard
              key={record.id}
              record={record}
              onClick={() => navigateTo('record_details', record.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { RecordCard } from '../components/records/RecordCard';
import { Search, X, Layers } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { navigateTo } = useAuth();
  const { records, loading } = useRecords();
  const [query, setQuery] = useState('');

  // Searches only non-sensitive fields
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return records.filter((r) => {
      const matchName = r.wallet_name.toLowerCase().includes(q);
      const matchProvider = r.exchange_or_wallet_provider.toLowerCase().includes(q);
      const matchType = r.record_type.toLowerCase().includes(q);
      const matchNet = r.crypto_network.toLowerCase().includes(q);
      const matchUser = r.username_or_email?.toLowerCase().includes(q) ?? false;
      const matchAddr = r.wallet_address?.toLowerCase().includes(q) ?? false;

      return matchName || matchProvider || matchType || matchNet || matchUser || matchAddr;
    });
  }, [records, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Vault Search
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Query records by wallet name, provider, network, username, or public address.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          autoFocus
          placeholder="Search Bitcoin, MetaMask, Solana, 0x..., Ledger..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="vault-input w-full pl-10 pr-10 py-3.5 rounded-2xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4 pointer-events-none" />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-3.5 p-1 text-zinc-400 hover:text-white rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Quick Searches */}
      {!query && (
        <div className="space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Quick Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {['Hardware Wallet', 'Bitcoin', 'Ethereum', 'Solana', 'DeFi', 'Exchange'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Matches found: <span className="font-mono text-white">{results.length}</span>
            </span>
            <span className="text-[11px] text-zinc-500">
              Secrets excluded from search query
            </span>
          </div>

          {results.length === 0 ? (
            <div className="vault-panel p-8 rounded-2xl text-center space-y-2">
              <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-200">No matching records</h3>
              <p className="text-xs text-zinc-500">
                No wallets or credentials matched &quot;{query}&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((record) => (
                <RecordCard
                  key={record.id}
                  record={record}
                  onClick={() => navigateTo('record_details', record.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

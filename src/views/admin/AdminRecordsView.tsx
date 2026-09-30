import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAdmin } from '../../hooks/useAdmin';
import { CryptoRecord } from '../../types/crypto';
import { shortenAddress } from '../../lib/constants';
import { Modal } from '../../components/ui/Modal';
import {
  ArrowLeft,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  X,
  Lock,
} from 'lucide-react';

export const AdminRecordsView: React.FC = () => {
  const { navigateTo, adminSelectedUserId, setAdminSelectedUserId, showToast } = useAuth();
  const { allRecords, loading, deleteAdminRecord, refreshAdminData } = useAdmin();

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ALL');

  // Inspector modal state
  const [inspectedRecord, setInspectedRecord] = useState<CryptoRecord | null>(null);
  const [revealedFields, setRevealedFields] = useState<Record<string, boolean>>({});

  // Deletion modal state
  const [recordToDelete, setRecordToDelete] = useState<CryptoRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    refreshAdminData();
  }, [refreshAdminData]);

  const toggleFieldReveal = (field: string) => {
    setRevealedFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec) => {
      // User filter
      if (adminSelectedUserId && rec.user_id !== adminSelectedUserId) return false;
      // Type filter
      if (selectedType !== 'ALL' && rec.record_type !== selectedType) return false;
      // Network filter
      if (selectedNetwork !== 'ALL' && rec.crypto_network !== selectedNetwork) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        rec.wallet_name.toLowerCase().includes(q) ||
        rec.exchange_or_wallet_provider.toLowerCase().includes(q) ||
        rec.record_type.toLowerCase().includes(q) ||
        rec.crypto_network.toLowerCase().includes(q) ||
        (rec.wallet_address && rec.wallet_address.toLowerCase().includes(q)) ||
        rec.user_id.toLowerCase().includes(q)
      );
    });
  }, [allRecords, adminSelectedUserId, selectedType, selectedNetwork, query]);

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    setIsDeleting(true);
    const res = await deleteAdminRecord(recordToDelete.id);
    setIsDeleting(false);
    setRecordToDelete(null);

    if (res.success) {
      showToast('Record deleted by administrator');
      if (inspectedRecord?.id === recordToDelete.id) {
        setInspectedRecord(null);
      }
    } else {
      showToast(res.error || 'Failed to remove record');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
        <button
          onClick={() => navigateTo('admin_dashboard')}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </button>

        <h1 className="text-sm font-semibold tracking-tight text-white">
          All User Crypto Records
        </h1>

        <button
          onClick={() => navigateTo('admin_users')}
          className="text-xs text-zinc-400 hover:text-white transition"
        >
          View Users
        </button>
      </div>

      {/* Filter by specific user banner if active */}
      {adminSelectedUserId && (
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white">Filtering User:</span>
            <span className="font-mono text-zinc-400 truncate">{adminSelectedUserId}</span>
          </div>
          <button
            onClick={() => setAdminSelectedUserId(null)}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white underline cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear User Filter</span>
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="vault-panel p-4 rounded-2xl space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search records by wallet name, provider, network, address, or User ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="vault-input w-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 rounded-xl focus:outline-none"
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
            onChange={(e) => setSelectedType(e.target.value)}
            className="vault-input px-3 py-1.5 rounded-lg text-xs text-white bg-zinc-900 border border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            {Array.from(new Set(allRecords.map((r) => r.record_type))).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="vault-input px-3 py-1.5 rounded-lg text-xs text-white bg-zinc-900 border border-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Networks</option>
            {Array.from(new Set(allRecords.map((r) => r.crypto_network))).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <span className="text-xs text-zinc-500 ml-auto font-mono">
            {filteredRecords.length} records found
          </span>
        </div>
      </div>

      {/* Records Table */}
      <div className="vault-panel rounded-3xl overflow-hidden divide-y divide-zinc-800/80">
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">
            Loading system records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No records matched the filter criteria.
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-900/50 transition"
            >
              <div className="space-y-1 truncate flex-1 min-w-0">
                <div className="flex items-baseline gap-2 truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {rec.wallet_name}
                  </span>
                  <span className="text-[11px] text-zinc-400 truncate">
                    / {rec.exchange_or_wallet_provider}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <span>{rec.record_type}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-300">{rec.crypto_network}</span>
                  {rec.wallet_address && (
                    <>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-zinc-400 text-[11px]">
                        {shortenAddress(rec.wallet_address, 6, 4)}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-[10px] font-mono text-zinc-500 truncate">
                  Owner UUID: {rec.user_id} · Created: {new Date(rec.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setRevealedFields({});
                    setInspectedRecord(rec);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Secret Fields</span>
                </button>

                <button
                  onClick={() => setRecordToDelete(rec)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition cursor-pointer"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Inspector Modal */}
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
                className="p-1 text-zinc-500 hover:text-white rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span>Owner UUID: {inspectedRecord.user_id}</span>
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            {/* Masked Secret Fields (Masked by default) */}
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
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Admin Record Removal"
        message={`Permanently remove user record "${recordToDelete?.wallet_name}" (User: ${recordToDelete?.user_id}) from Supabase? This action is permanent.`}
        confirmText="Confirm Removal"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

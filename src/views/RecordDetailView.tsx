import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { MaskedField } from '../components/ui/MaskedField';
import { Modal } from '../components/ui/Modal';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  ExternalLink,
  Shield,
  Lock,
  Unlock,
  Calendar,
} from 'lucide-react';

export const RecordDetailView: React.FC = () => {
  const {
    selectedRecordId,
    navigateTo,
    isVaultUnlocked,
    lockVault,
    showToast,
  } = useAuth();
  const { getRecordById, deleteRecord } = useRecords();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const record = getRecordById(selectedRecordId);

  if (!record) {
    return (
      <div className="vault-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
        <h3 className="text-sm font-semibold text-white">Record Not Found</h3>
        <p className="text-xs text-zinc-400">
          The requested crypto credential was not found or has been removed.
        </p>
        <button
          onClick={() => navigateTo('records')}
          className="px-4 py-2 bg-white text-zinc-950 text-xs font-semibold rounded-xl cursor-pointer"
        >
          Back to Records
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteRecord(record.id);
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res.success) {
      showToast('Record deleted from vault');
      navigateTo('records');
    } else {
      showToast(res.error || 'Failed to delete record');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top Bar Navigation & Actions */}
      <div className="flex items-center justify-between gap-4 sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md py-3 border-b border-zinc-800">
        <button
          onClick={() => navigateTo('records')}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Records</span>
        </button>

        <div className="flex items-center gap-2">
          {isVaultUnlocked ? (
            <button
              onClick={lockVault}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs font-medium transition cursor-pointer"
              title="Mask all sensitive secrets now"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock Vault</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('biometric_unlock')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 border border-zinc-800 text-xs font-medium cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unlock to Reveal</span>
            </button>
          )}

          <button
            onClick={() => navigateTo('edit_record', record.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-medium transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Record Title Header Card */}
      <div className="vault-panel p-6 rounded-3xl space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              {record.exchange_or_wallet_provider}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
              {record.wallet_name}
            </h1>
          </div>

          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        {/* Zero-Pill metadata typography with bullet separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
          <span className="text-zinc-200 font-medium">{record.record_type}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="text-zinc-200 font-medium">{record.crypto_network}</span>
          {record.website_url && (
            <>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <a
                href={record.website_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-zinc-300 hover:text-white underline underline-offset-2"
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Public / General Fields */}
      <div className="vault-panel p-5 rounded-2xl">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 pb-2 border-b border-zinc-800">
          Account & Public Identifiers
        </h3>

        <MaskedField
          label="Wallet / Exchange Provider"
          value={record.exchange_or_wallet_provider}
          monospace={false}
        />

        <MaskedField
          label="Wallet Name"
          value={record.wallet_name}
          monospace={false}
        />

        <MaskedField
          label="Record Type"
          value={record.record_type}
          monospace={false}
        />

        <MaskedField
          label="Crypto Network"
          value={record.crypto_network}
          monospace={false}
        />

        <MaskedField
          label="Username / Email"
          value={record.username_or_email}
          monospace={true}
        />

        <MaskedField
          label="Wallet Address"
          value={record.wallet_address}
          isAddress={true}
          monospace={true}
          description="Public cryptographic receiving address."
        />

        {record.website_url && (
          <MaskedField
            label="Service / Portal URL"
            value={record.website_url}
            monospace={false}
          />
        )}
      </div>

      {/* Protected Sensitive Fields */}
      <div className="vault-panel p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Protected Secrets & Keys
          </h3>
          <span className="text-[10px] text-zinc-400 font-mono">
            {isVaultUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>

        <MaskedField
          label="Wallet Password"
          value={record.wallet_password}
          isSensitive={true}
        />

        <MaskedField
          label="Device / Wallet PIN"
          value={record.pin}
          isSensitive={true}
        />

        <MaskedField
          label="Seed Phrase (12/24 Recovery Words)"
          value={record.seed_phrase}
          isSensitive={true}
          multiline={true}
          description="BIP-39 mnemonic recovery phrase. Reveal only in private."
        />

        <MaskedField
          label="Private Key"
          value={record.private_key}
          isSensitive={true}
          multiline={true}
          description="Elliptic curve private key granting signature authorization."
        />

        <MaskedField
          label="2FA Secret / TOTP Key"
          value={record.two_factor_codes}
          isSensitive={true}
        />

        <MaskedField
          label="Recovery Codes"
          value={record.recovery_codes}
          isSensitive={true}
          multiline={true}
        />
      </div>

      {/* Notes & Metadata */}
      {record.notes && (
        <div className="vault-panel p-5 rounded-2xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 pb-2 border-b border-zinc-800">
            Notes & Storage Location
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
            {record.notes}
          </p>
        </div>
      )}

      {/* Timestamp audit trail */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono px-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Created: {new Date(record.created_at).toLocaleDateString()}</span>
        </div>
        <span>Updated: {new Date(record.updated_at).toLocaleDateString()}</span>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Crypto Record"
        message={`Are you sure you want to permanently delete "${record.wallet_name}"? All associated keys, recovery phrases, and passwords will be erased from Supabase.`}
        confirmText="Permanently Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};

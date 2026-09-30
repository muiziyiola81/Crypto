import React, { useState, useRef } from 'react';
import { CryptoRecord, CryptoRecordInput, RecordType, CryptoNetwork } from '../../types/crypto';
import { RECORD_TYPES, CRYPTO_NETWORKS } from '../../lib/constants';
import { Eye, EyeOff, Save, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface RecordFormProps {
  initialData?: CryptoRecord;
  onSave: (data: CryptoRecordInput) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
  title: string;
}

export const RecordForm: React.FC<RecordFormProps> = ({
  initialData,
  onSave,
  onCancel,
  title,
}) => {
  const [walletName, setWalletName] = useState(initialData?.wallet_name || '');
  const [exchangeName, setExchangeName] = useState(initialData?.exchange_or_wallet_provider || '');
  const [recordType, setRecordType] = useState<RecordType>(initialData?.record_type || 'Hardware Wallet');
  const [usernameOrEmail, setUsernameOrEmail] = useState(initialData?.username_or_email || '');
  const [walletPassword, setWalletPassword] = useState(initialData?.wallet_password || '');
  const [pin, setPin] = useState(initialData?.pin || '');
  const [seedPhrase, setSeedPhrase] = useState(initialData?.seed_phrase || '');
  const [recoveryCodes, setRecoveryCodes] = useState(initialData?.recovery_codes || '');
  const [twoFactorCodes, setTwoFactorCodes] = useState(initialData?.two_factor_codes || '');
  const [privateKey, setPrivateKey] = useState(initialData?.private_key || '');
  const [walletAddress, setWalletAddress] = useState(initialData?.wallet_address || '');
  const [cryptoNetwork, setCryptoNetwork] = useState<CryptoNetwork>(initialData?.crypto_network || 'Bitcoin');
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.website_url || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Toggle visibility for secret inputs during entry
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  // Status
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const walletNameRef = useRef<HTMLInputElement>(null);
  const exchangeNameRef = useRef<HTMLInputElement>(null);

  const clearError = () => {
    if (errorMessage || status === 'error') {
      setErrorMessage(null);
      setStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field Validation
    const cleanWalletName = walletName.trim();
    const cleanExchangeName = exchangeName.trim();

    if (!cleanWalletName) {
      setErrorMessage('Wallet Name is required.');
      setStatus('error');
      walletNameRef.current?.focus();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (!cleanExchangeName) {
      setErrorMessage('Wallet / Exchange Provider Name is required.');
      setStatus('error');
      exchangeNameRef.current?.focus();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    setStatus('saving');
    setErrorMessage(null);

    const payload: CryptoRecordInput = {
      wallet_name: cleanWalletName,
      exchange_or_wallet_provider: cleanExchangeName,
      record_type: recordType,
      crypto_network: cryptoNetwork,
      username_or_email: usernameOrEmail.trim() || undefined,
      wallet_password: walletPassword || undefined,
      pin: pin || undefined,
      seed_phrase: seedPhrase.trim() || undefined,
      recovery_codes: recoveryCodes.trim() || undefined,
      two_factor_codes: twoFactorCodes.trim() || undefined,
      private_key: privateKey.trim() || undefined,
      wallet_address: walletAddress.trim() || undefined,
      website_url: websiteUrl.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const res = await onSave(payload);
      if (res && res.success) {
        setStatus('success');
        // Reset form inputs if new record
        if (!initialData) {
          setWalletName('');
          setExchangeName('');
          setUsernameOrEmail('');
          setWalletPassword('');
          setPin('');
          setSeedPhrase('');
          setRecoveryCodes('');
          setTwoFactorCodes('');
          setPrivateKey('');
          setWalletAddress('');
          setWebsiteUrl('');
          setNotes('');
        }
        setTimeout(() => {
          onCancel();
        }, 500);
      } else {
        setStatus('error');
        setErrorMessage(res?.error || 'Database operation failed. Check connection and user access.');
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred while saving the crypto record.');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md py-3 border-b border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h2 className="text-sm font-semibold tracking-tight text-white">{title}</h2>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={status === 'saving'}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow transition disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{status === 'saving' ? 'Saving...' : 'Save Record'}</span>
        </button>
      </div>

      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Error saving credential</span>
            <p className="mt-0.5 text-red-300">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success banner */}
      {status === 'success' && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Record saved securely to encrypted store.</span>
        </div>
      )}

      {/* Section 1: Identification */}
      <div className="vault-panel p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-2">
          1. Wallet & Provider Info
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Wallet Name <span className="text-zinc-500">*</span>
            </label>
            <input
              ref={walletNameRef}
              type="text"
              required
              placeholder="e.g. Primary Cold Storage"
              value={walletName}
              onChange={(e) => {
                setWalletName(e.target.value);
                clearError();
              }}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Wallet / Exchange Name <span className="text-zinc-500">*</span>
            </label>
            <input
              ref={exchangeNameRef}
              type="text"
              required
              placeholder="e.g. Ledger, Coinbase, MetaMask, Trezor"
              value={exchangeName}
              onChange={(e) => {
                setExchangeName(e.target.value);
                clearError();
              }}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Record Type</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as RecordType)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white bg-zinc-900 border border-zinc-700 focus:outline-none cursor-pointer"
            >
              {RECORD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Crypto Network</label>
            <select
              value={cryptoNetwork}
              onChange={(e) => setCryptoNetwork(e.target.value as CryptoNetwork)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white bg-zinc-900 border border-zinc-700 focus:outline-none cursor-pointer"
            >
              {CRYPTO_NETWORKS.map((net) => (
                <option key={net} value={net}>
                  {net}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Username / Email</label>
            <input
              type="text"
              placeholder="operator@crypto.org"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Website / URL</label>
            <input
              type="text"
              placeholder="https://app.uniswap.org"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1.5">
            Wallet Address (Public)
          </label>
          <input
            type="text"
            placeholder="0x... or bc1q... or 7xKX..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Section 2: Protected Credentials & Keys */}
      <div className="vault-panel p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            2. Protected Cryptographic Secrets
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">ENCRYPTED AT REST</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Wallet Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={walletPassword}
              onChange={(e) => setWalletPassword(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Device / Wallet PIN</label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPin ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              placeholder="e.g. 6-8 digit hardware PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Seed Phrase (12 or 24 Recovery Words)
            </label>
            <button
              type="button"
              onClick={() => setShowSeed(!showSeed)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              {showSeed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showSeed ? 'Mask' : 'Reveal'}</span>
            </button>
          </div>
          {showSeed ? (
            <textarea
              rows={3}
              placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono leading-relaxed resize-none"
            />
          ) : (
            <div
              onClick={() => setShowSeed(true)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-zinc-500 cursor-pointer font-mono tracking-widest"
            >
              {seedPhrase ? '••••••••••••••••••••••••••••••••••••••••' : 'Click to enter seed phrase (masked)'}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-zinc-300">Private Key</label>
            <button
              type="button"
              onClick={() => setShowPrivateKey(!showPrivateKey)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
            >
              {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPrivateKey ? 'Mask' : 'Reveal'}</span>
            </button>
          </div>
          {showPrivateKey ? (
            <textarea
              rows={2}
              placeholder="0x... or Base58 formatted private key string"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono leading-relaxed resize-none"
            />
          ) : (
            <div
              onClick={() => setShowPrivateKey(true)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-zinc-500 cursor-pointer font-mono tracking-widest"
            >
              {privateKey ? '••••••••••••••••••••••••••••••••••••••••' : 'Click to enter private key (masked)'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">2FA Secret / TOTP Key</label>
              <button
                type="button"
                onClick={() => setShow2FA(!show2FA)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {show2FA ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{show2FA ? 'Mask' : 'Reveal'}</span>
              </button>
            </div>
            <input
              type={show2FA ? 'text' : 'password'}
              placeholder="e.g. JBSWY3DPEHPK3PXP"
              value={twoFactorCodes}
              onChange={(e) => setTwoFactorCodes(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">Recovery Codes / Backup Keys</label>
              <button
                type="button"
                onClick={() => setShowRecovery(!showRecovery)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
              >
                {showRecovery ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showRecovery ? 'Mask' : 'Reveal'}</span>
              </button>
            </div>
            <input
              type={showRecovery ? 'text' : 'password'}
              placeholder="REC-1029-4481..."
              value={recoveryCodes}
              onChange={(e) => setRecoveryCodes(e.target.value)}
              className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Notes */}
      <div className="vault-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/80 pb-2">
          3. Security Notes & Safe Deposit Locations
        </h3>
        <textarea
          rows={3}
          placeholder="Physical key location, multisig cosigners, recovery protocols..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none leading-relaxed resize-none"
        />
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      {status === 'error' && errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs font-medium text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={status === 'saving'}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold shadow transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{status === 'saving' ? 'Saving to Vault...' : 'Save Crypto Record'}</span>
        </button>
      </div>
    </form>
  );
};

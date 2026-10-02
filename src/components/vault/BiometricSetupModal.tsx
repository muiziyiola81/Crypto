import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Fingerprint, CheckCircle2, AlertCircle, X, Shield, Info, ExternalLink } from 'lucide-react';
import { WebAuthnDiagnostics } from '../../types/auth';

interface BiometricSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const BiometricSetupModal: React.FC<BiometricSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { enableBiometric, isWebAuthnAvailable, isPlatformBiometricAvailable, lastBiometricDiagnostics } = useAuth();
  const [deviceName, setDeviceName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<WebAuthnDiagnostics | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    setIsProcessing(true);
    setError(null);
    setDiagnostics(null);

    const res = await enableBiometric(deviceName.trim() || undefined);
    setIsProcessing(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onComplete) onComplete();
        onClose();
      }, 1200);
    } else {
      setError(res.error || 'Failed to complete biometric setup.');
      setDiagnostics(res.diagnostics || lastBiometricDiagnostics || null);
    }
  };

  const activeDiagnostics = diagnostics || lastBiometricDiagnostics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl vault-panel p-6 shadow-2xl text-zinc-100 border border-zinc-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 rounded-md transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mb-4">
          <Fingerprint className="w-6 h-6 text-zinc-200" />
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">
          Enroll Device Biometrics
        </h3>
        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
          Use Touch ID, Face ID, Android Biometrics, or Windows Hello for frictionless, hardware-backed vault entry.
        </p>

        {/* Real WebAuthn advisory */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
          <Shield className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
          <span>
            CryptoLocker uses standard browser WebAuthn. Biometric data never leaves your device secure enclave.
          </span>
        </div>

        {!isWebAuthnAvailable && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>WebAuthn hardware authenticator is required to use this vault.</span>
          </div>
        )}

        {error && (
          <div className="mt-4 space-y-2">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="break-words">{error}</div>
            </div>

            {/* Development Diagnostics */}
            {activeDiagnostics && (
              <div className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left text-[10px] font-mono text-zinc-400 space-y-1">
                <div className="flex items-center justify-between text-zinc-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Info className="w-3 h-3 text-zinc-400" />
                    <span>WebAuthn Diagnostics</span>
                  </span>
                  <span className="text-zinc-300 font-semibold px-1 py-0.5 rounded bg-zinc-900 border border-zinc-700">
                    {activeDiagnostics.errorName}
                  </span>
                </div>
                <p className="text-zinc-300 font-sans leading-relaxed">
                  {activeDiagnostics.safeReason}
                </p>
                <div className="pt-1 text-[9px] text-zinc-500 border-t border-zinc-800/80 flex flex-wrap gap-x-2 gap-y-1">
                  <span>RP ID: {activeDiagnostics.rpId}</span>
                  <span>Context: {activeDiagnostics.isIframe ? 'Preview Iframe' : 'Top-Level'}</span>
                </div>
                {activeDiagnostics.isIframe && (
                  <div className="pt-1">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] text-zinc-200 hover:text-white underline cursor-pointer font-sans"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open in top-level window for direct device passkeys</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Passkey credential enrolled successfully!</span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">
              Device Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Pixel 8, MacBook Pro M3"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="vault-input w-full px-3 py-2 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={isProcessing || !isWebAuthnAvailable || success}
            className="w-full h-11 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
          >
            <Fingerprint className="w-4 h-4" />
            <span>{isProcessing ? 'Prompting Device Enclave...' : 'Register Passkey Now'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

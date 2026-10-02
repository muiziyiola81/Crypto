import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, Fingerprint, LogOut, Lock, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { WebAuthnDiagnostics } from '../../types/auth';

export const VaultLockScreen: React.FC = () => {
  const {
    user,
    unlockVaultBiometric,
    signOut,
    registeredPasskeys,
    isWebAuthnAvailable,
    lastBiometricDiagnostics,
    navigateTo,
  } = useAuth();

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<WebAuthnDiagnostics | null>(null);

  const hasPasskey = registeredPasskeys.length > 0;

  const handleBiometricUnlock = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    setDiagnostics(null);

    const res = await unlockVaultBiometric();
    setIsVerifying(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Biometric authentication was not completed.');
      setDiagnostics(res.diagnostics || lastBiometricDiagnostics || null);
    }
  };

  const activeDiagnostics = diagnostics || lastBiometricDiagnostics;

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl vault-panel p-8 text-center border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Subtle radial ambient gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-zinc-800/20 blur-3xl pointer-events-none rounded-full" />

        {/* Central Lock Emblem */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mb-6 shadow-inner">
          <Lock className="w-7 h-7 text-zinc-100" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <ShieldAlert className="w-3 h-3 text-zinc-400" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">Vault Locked</h1>
        <p className="mt-2 text-xs text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
          Sensitive keys, seed phrases, and recovery codes are securely masked in memory.
        </p>

        {user?.email && (
          <div className="mt-3 text-[11px] font-mono text-zinc-500 truncate max-w-full">
            {user.email}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 space-y-2">
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-left text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 break-words">{errorMessage}</div>
            </div>

            {/* Development Diagnostics (Safe non-sensitive error details) */}
            {activeDiagnostics && (
              <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left text-[11px] font-mono text-zinc-400 space-y-1.5">
                <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-zinc-400">
                    <Info className="w-3 h-3 text-zinc-400" />
                    <span>WebAuthn Diagnostics</span>
                  </span>
                  <span className="text-zinc-300 font-semibold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700">
                    {activeDiagnostics.errorName}
                  </span>
                </div>
                <p className="text-zinc-300 text-[11px] font-sans leading-relaxed">
                  {activeDiagnostics.safeReason}
                </p>
                <div className="pt-1.5 text-[10px] text-zinc-500 border-t border-zinc-800/80 flex flex-wrap gap-x-3 gap-y-1">
                  <span>RP ID: {activeDiagnostics.rpId}</span>
                  <span>Context: {activeDiagnostics.isIframe ? 'Preview Iframe' : 'Top-Level Window'}</span>
                </div>
                {activeDiagnostics.isIframe && (
                  <div className="pt-1.5">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-200 hover:text-white underline cursor-pointer font-sans"
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

        <div className="mt-8 space-y-3">
          {hasPasskey && isWebAuthnAvailable ? (
            <button
              onClick={handleBiometricUnlock}
              disabled={isVerifying}
              className="w-full h-12 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2.5 transition active:scale-[0.98] cursor-pointer shadow-lg disabled:opacity-60"
            >
              <Fingerprint className={`w-4 h-4 ${isVerifying ? 'animate-pulse' : ''}`} />
              <span>{isVerifying ? 'Authenticating with Device...' : 'Biometric Unlock'}</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 space-y-2 text-left">
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Biometric Credential Required</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Biometric setup is required to access this vault. Register your device passkey to continue.
              </p>
              <button
                onClick={() => navigateTo('biometric_setup')}
                className="w-full mt-2 h-10 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Set Up Biometric Authentication</span>
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 hover:text-zinc-200 transition text-[11px] cursor-pointer py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out of account</span>
            </button>

            <span className="text-[10px] text-zinc-600 font-mono">WebAuthn FIDO2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

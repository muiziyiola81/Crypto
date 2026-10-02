import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Fingerprint, Shield, CheckCircle2, AlertCircle, Laptop, Smartphone, Info, ExternalLink, LogOut, Lock } from 'lucide-react';
import { WebAuthnDiagnostics } from '../types/auth';

export const BiometricSetupView: React.FC = () => {
  const {
    enableBiometric,
    isWebAuthnAvailable,
    isPlatformBiometricAvailable,
    navigateTo,
    signOut,
    lastBiometricDiagnostics,
  } = useAuth();

  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<WebAuthnDiagnostics | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);
    setDiagnostics(null);

    const res = await enableBiometric(deviceName.trim() || undefined);
    setLoading(false);

    if (res.success) {
      setEnrolled(true);
      setTimeout(() => {
        navigateTo('dashboard');
      }, 1400);
    } else {
      setError(
        res.error ||
          'Biometric setup was cancelled or failed. Biometric registration is required to access and lock your vault.'
      );
      setDiagnostics(res.diagnostics || lastBiometricDiagnostics || null);
    }
  };

  const activeDiagnostics = diagnostics || lastBiometricDiagnostics;

  return (
    <div className="max-w-lg mx-auto py-6 sm:py-10">
      <div className="vault-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Fingerprint className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Set Up Biometric Vault Protection
          </h2>
          <p className="mt-1.5 text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            CryptoLocker enforces biometric-only vault security. Bind your device enclave (Touch ID, Face ID, Android Biometrics, or Windows Hello) to unlock your credentials.
          </p>
        </div>

        {/* Security architecture banner */}
        <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-white font-medium text-xs">
            <Shield className="w-4 h-4 text-zinc-300 shrink-0" />
            <span>Hardware Enclave · Biometric-Only Lock</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Vault secrets are shielded by your physical biometric credential. WebAuthn operates directly on your device chip; raw biometric data is never transmitted or stored.
          </p>
        </div>

        {/* Mandatory Requirement Notice */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-300/90 flex items-start gap-2 mb-6">
          <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            Biometric registration is mandatory. CryptoLocker does not permit alternative password, PIN, or session unlock bypasses.
          </span>
        </div>

        {error && (
          <div className="mb-5 space-y-2">
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block text-red-300">Biometric Setup Required</span>
                <p className="text-[11px] text-red-200/90 leading-relaxed">{error}</p>
              </div>
            </div>

            {/* Development Diagnostics */}
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

        {enrolled ? (
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-700 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Biometric Protection Active</h3>
            <p className="text-xs text-zinc-400">
              Biometric credential enrolled successfully. Entering your vault...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Device / Authenticator Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Pixel 8 Pro, MacBook Pro, Work Station"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="vault-input w-full px-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-300">
                <Smartphone className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Fingerprint / Face ID</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center gap-2.5 text-xs text-zinc-300">
                <Laptop className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>Touch ID / Hello</span>
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={loading || !isWebAuthnAvailable}
              className="w-full h-12 mt-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Fingerprint className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
              <span>{loading ? 'Prompting Device Enclave...' : 'Register Device Biometrics'}</span>
            </button>

            <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-center">
              <button
                onClick={signOut}
                className="py-1.5 px-3 text-xs text-zinc-400 hover:text-zinc-200 transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out of account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

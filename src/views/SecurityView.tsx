import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Fingerprint,
  Shield,
  Lock,
  LogOut,
  Smartphone,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BiometricSetupModal } from '../components/vault/BiometricSetupModal';

export const SecurityView: React.FC = () => {
  const {
    biometricEnabled,
    registeredPasskeys,
    disableBiometric,
    lockVault,
    signOut,
    isWebAuthnAvailable,
  } = useAuth();

  const [showSetupModal, setShowSetupModal] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Security & Biometrics
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Configure hardware passkeys, device credentials, and immediate memory lock controls.
        </p>
      </div>

      {/* WebAuthn Support Status */}
      <div className="vault-panel p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-white block">
              Browser WebAuthn Engine
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {isWebAuthnAvailable
                ? 'Hardware enclave & platform authenticator available'
                : 'WebAuthn not supported in this browser environment'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {isWebAuthnAvailable ? (
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Supported</span>
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unavailable</span>
            </span>
          )}
        </div>
      </div>

      {/* Biometric Entry Section */}
      <div className="vault-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-zinc-200" />
              <h2 className="text-sm font-semibold text-white">Biometric Vault Entry</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Require fingerprint, Touch ID, Face ID, or Windows Hello to unlock credentials.
            </p>
          </div>

          <div className="shrink-0">
            {biometricEnabled ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs font-medium">
                Disabled
              </span>
            )}
          </div>
        </div>

        {/* Registered Devices List */}
        <div className="pt-3 border-t border-zinc-800/80">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2.5">
            Registered Device Passkeys ({registeredPasskeys.length})
          </span>

          {registeredPasskeys.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 text-center">
              <p className="text-xs text-zinc-400">
                No biometric passkeys enrolled for this device.
              </p>
              <button
                onClick={() => setShowSetupModal(true)}
                disabled={!isWebAuthnAvailable}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register This Device</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {registeredPasskeys.map((cred) => (
                <div
                  key={cred.id}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="text-xs font-medium text-white block">
                        {cred.deviceName || 'Biometric Device'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Enrolled: {new Date(cred.createdAt).toLocaleDateString()} · ID: {cred.id.slice(0, 10)}...
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-400 font-mono">Enrolled</span>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowSetupModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Another Passkey</span>
                </button>

                <button
                  onClick={disableBiometric}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-400 hover:text-red-300 text-xs font-medium border border-zinc-800 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disable Biometric Entry</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Immediate Vault Lock */}
      <div className="vault-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-white block">Lock Vault Now</span>
          <span className="text-[11px] text-zinc-400 block">
            Purges unlocked secrets from RAM and requires re-authentication.
          </span>
        </div>

        <button
          onClick={lockVault}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer shadow"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Vault</span>
        </button>
      </div>

      {/* Sign Out Action */}
      <div className="vault-panel p-5 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-white block">Sign Out</span>
          <span className="text-[11px] text-zinc-400 block">
            Terminate the current active session on this device.
          </span>
        </div>

        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-red-300 hover:text-red-200 border border-zinc-800 text-xs font-medium transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <BiometricSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
};

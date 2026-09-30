import React, { useState } from 'react';
import { Shield, Lock, Database, Fingerprint, Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';

export const AboutView: React.FC = () => {
  const { showToast } = useAuth();
  const [copiedSql, setCopiedSql] = useState(false);

  const sqlSample = `-- Supabase Table & RLS Setup
CREATE TABLE IF NOT EXISTS public.crypto_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    wallet_name TEXT NOT NULL,
    exchange_or_wallet_provider TEXT NOT NULL,
    record_type TEXT NOT NULL,
    username_or_email TEXT,
    wallet_password TEXT,
    pin TEXT,
    seed_phrase TEXT,
    recovery_codes TEXT,
    two_factor_codes TEXT,
    private_key TEXT,
    wallet_address TEXT,
    crypto_network TEXT NOT NULL,
    website_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crypto_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own records" ON public.crypto_records
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`;

  const handleCopySql = async () => {
    const ok = await copyToClipboard(sqlSample);
    if (ok) {
      setCopiedSql(true);
      showToast('SQL schema copied to clipboard');
      setTimeout(() => setCopiedSql(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          About CryptoLocker
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Cryptographic principles, hardware security guarantees, and system architecture.
        </p>
      </div>

      <div className="vault-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-bold text-white text-sm">
            CL
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">CryptoLocker v1.0.0</h2>
            <span className="text-xs text-zinc-400">
              Private Cryptocurrency Credential Safe
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          CryptoLocker is designed specifically for Web3 power users, node operators, DeFi traders, and crypto investors who need to securely preserve wallet passwords, hardware PINs, seed phrases, 2FA tokens, and private keys.
        </p>
      </div>

      {/* Security Architecture Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="vault-panel p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Fingerprint className="w-4 h-4 text-zinc-300" />
            <span>WebAuthn FIDO2</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Authenticates directly through the device hardware secure enclave (Touch ID, Face ID, Android Biometrics, Windows Hello).
          </p>
        </div>

        <div className="vault-panel p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Database className="w-4 h-4 text-zinc-300" />
            <span>Row Level Security (RLS)</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Enforced at the PostgreSQL database layer. Users can never query, insert, or modify another user&apos;s cryptographic records.
          </p>
        </div>

        <div className="vault-panel p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Lock className="w-4 h-4 text-zinc-300" />
            <span>Memory Concealment</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Sensitive values remain masked with •••••••••• by default. Locking the vault instantly purges exposed secrets from UI memory.
          </p>
        </div>

        <div className="vault-panel p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Shield className="w-4 h-4 text-zinc-300" />
            <span>Zero-Leak Logging</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            No console logging of secrets, no secret query parameters, and no service-role keys in frontend bundles.
          </p>
        </div>
      </div>

      {/* Supabase Schema Reference */}
      <div className="vault-panel p-5 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Supabase SQL Schema
            </h3>
          </div>

          <button
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs transition cursor-pointer"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-48 leading-relaxed">
          {sqlSample}
        </pre>
      </div>
    </div>
  );
};

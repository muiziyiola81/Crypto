import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, Fingerprint, Lock, Database, ArrowRight, KeyRound } from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const { navigateTo } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        {/* Emblem */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-700/80 shadow-2xl relative mb-2">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-400 flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">
            <Fingerprint className="w-3.5 h-3.5 text-zinc-300" />
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
          CryptoLocker
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          The private, high-security cryptocurrency credential safe. Store wallet seeds, private keys, 2FA tokens, and exchange credentials guarded by hardware biometrics.
        </p>

        {/* Primary CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
          <button
            onClick={() => navigateTo('signup')}
            className="w-full sm:w-auto flex-1 h-12 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg cursor-pointer"
          >
            <span>Create CryptoLocker Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('signin')}
            className="w-full sm:w-auto flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-zinc-400" />
            <span>Open Vault</span>
          </button>
        </div>
      </div>

      {/* 3 Pillar Architectural Features */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="vault-panel p-5 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Fingerprint className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Hardware Biometrics</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Uses standard W3C WebAuthn passkeys. Authenticate with Touch ID, Face ID, Android Biometrics, or Windows Hello.
          </p>
        </div>

        <div className="vault-panel p-5 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Masked Secret Fields</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Seed phrases, private keys, recovery codes, and passwords stay hidden behind strict tap-to-reveal controls.
          </p>
        </div>

        <div className="vault-panel p-5 rounded-2xl space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Supabase Row Security</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            PostgreSQL Row Level Security (RLS) ensures only your authenticated session can access your vault records.
          </p>
        </div>
      </div>

      {/* Supported Chains Footnote */}
      <div className="mt-12 p-5 rounded-2xl bg-zinc-950 border border-zinc-900 text-center">
        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold block mb-2">
          Engineered for all crypto networks
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-300">
          <span>Bitcoin</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Ethereum</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Solana</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>BNB Chain</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Polygon</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Arbitrum</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Optimism</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>Base</span>
        </div>
      </div>
    </div>
  );
};

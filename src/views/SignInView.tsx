import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export const SignInView: React.FC = () => {
  const { signIn, navigateTo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and vault password.');
      return;
    }

    setLoading(true);
    const res = await signIn(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials or user does not exist.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="vault-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Open CryptoLocker</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in with your master credentials to unlock stored accounts
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="break-words">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="keeper@proton.me"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vault-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-zinc-300">
                Master Password
              </label>
              <button
                type="button"
                onClick={() => navigateTo('forgot_password')}
                className="text-[11px] text-zinc-400 hover:text-white transition cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vault-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] shadow cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Vault'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-800 text-center text-xs text-zinc-400">
          <span>Need a new vault? </span>
          <button
            onClick={() => navigateTo('signup')}
            className="text-white font-medium hover:underline cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

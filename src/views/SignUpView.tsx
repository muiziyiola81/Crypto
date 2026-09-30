import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export const SignUpView: React.FC = () => {
  const { signUp, navigateTo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and a strong password.');
      return;
    }

    if (password.length < 8) {
      setError('Master vault password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await signUp(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Failed to create vault account.');
    }
  };

  const hasLength = password.length >= 8;
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasDigitOrSymbol = /[\d\W]/.test(password);

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="vault-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Create CryptoLocker</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Provision a private cryptographic credential safe
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
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Master Vault Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vault-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            </div>

            {/* Password quality meter */}
            {password && (
              <div className="mt-2 space-y-1 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3 h-3 ${hasLength ? 'text-emerald-400' : 'text-zinc-600'}`}
                  />
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3 h-3 ${hasMixed ? 'text-emerald-400' : 'text-zinc-600'}`}
                  />
                  <span>Mixed case (uppercase & lowercase)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2
                    className={`w-3 h-3 ${hasDigitOrSymbol ? 'text-emerald-400' : 'text-zinc-600'}`}
                  />
                  <span>Numbers or special characters</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>{loading ? 'Creating Vault...' : 'Create Account & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-800 text-center text-xs text-zinc-400">
          <span>Already have a vault? </span>
          <button
            onClick={() => navigateTo('signin')}
            className="text-white font-medium hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

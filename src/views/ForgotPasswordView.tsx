import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';

export const ForgotPasswordView: React.FC = () => {
  const { resetPassword, navigateTo } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const res = await resetPassword(email.trim());
    setLoading(false);

    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || 'Failed to dispatch password recovery email.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      <div className="vault-panel p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        <button
          onClick={() => navigateTo('signin')}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6 text-zinc-100" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Reset Password</h2>
          <p className="mt-1 text-xs text-zinc-400">
            We will dispatch an encrypted reset link to your email address
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="break-words">{error}</div>
          </div>
        )}

        {sent ? (
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-700 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Reset Link Dispatched</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If an account is associated with <span className="text-zinc-200 font-mono">{email}</span>, you will receive instructions to reset your master password.
            </p>
            <button
              onClick={() => navigateTo('signin')}
              className="mt-3 w-full py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="keeper@proton.me"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="vault-input w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition active:scale-[0.98] shadow cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Sending Link...' : 'Send Recovery Link'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

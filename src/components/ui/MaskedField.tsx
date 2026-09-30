import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Copy, Check, Lock } from 'lucide-react';
import { copyToClipboard } from '../../lib/constants';
import { useAuth } from '../../hooks/useAuth';

interface MaskedFieldProps {
  label: string;
  value?: string;
  isSensitive?: boolean;
  multiline?: boolean;
  isAddress?: boolean;
  monospace?: boolean;
  description?: string;
}

export const MaskedField: React.FC<MaskedFieldProps> = ({
  label,
  value,
  isSensitive = false,
  multiline = false,
  isAddress = false,
  monospace = true,
  description,
}) => {
  const { isVaultUnlocked, lockVault, showToast } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Automatically conceal value if vault becomes locked
  useEffect(() => {
    if (!isVaultUnlocked) {
      setRevealed(false);
    }
  }, [isVaultUnlocked]);

  if (!value) {
    return (
      <div className="py-2.5 border-b border-zinc-800/80">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="text-xs text-zinc-600 italic mt-0.5">Not set</div>
      </div>
    );
  }

  const handleToggleReveal = () => {
    if (!isVaultUnlocked) {
      showToast('Unlock vault with biometrics to reveal secret');
      lockVault();
      return;
    }
    setRevealed(!revealed);
  };

  const handleCopy = async () => {
    if (isSensitive && !isVaultUnlocked) {
      showToast('Unlock vault before copying secrets');
      lockVault();
      return;
    }
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      showToast(`${label} copied to clipboard (clears in 30s)`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isMasked = isSensitive && (!isVaultUnlocked || !revealed);

  return (
    <div className="py-3 border-b border-zinc-800/80 last:border-none">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="flex items-center gap-1.5">
          {isSensitive && (
            <button
              type="button"
              onClick={handleToggleReveal}
              title={isMasked ? 'Reveal secret' : 'Conceal secret'}
              className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] transition border border-zinc-800 cursor-pointer"
            >
              {!isVaultUnlocked ? (
                <>
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Locked</span>
                </>
              ) : isMasked ? (
                <>
                  <Eye className="w-3 h-3 text-zinc-400" />
                  <span>Show</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-zinc-400" />
                  <span>Hide</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title={`Copy ${label}`}
            className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] transition border border-zinc-800 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-zinc-500 mb-1.5">{description}</p>
      )}

      <div
        className={`px-3 py-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-xs ${
          monospace ? 'font-mono' : ''
        } text-zinc-200 select-text overflow-x-auto break-all`}
      >
        {isMasked ? (
          <span className="text-zinc-500 tracking-widest font-mono select-none">
            ••••••••••••••••••••
          </span>
        ) : multiline ? (
          <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-200 leading-relaxed font-mono">
            {value}
          </pre>
        ) : (
          <span>{value}</span>
        )}
      </div>
    </div>
  );
};

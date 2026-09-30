import React from 'react';
import { CryptoRecord } from '../../types/crypto';
import { shortenAddress } from '../../lib/constants';
import { ChevronRight } from 'lucide-react';

interface RecordCardProps {
  record: CryptoRecord;
  onClick: () => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onClick }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="vault-card p-4 rounded-2xl cursor-pointer hover:border-zinc-700/80 transition-all duration-150 active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 truncate">
            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white truncate">
              {record.exchange_or_wallet_provider || record.wallet_name}
            </h3>
            {record.exchange_or_wallet_provider && record.wallet_name && (
              <span className="text-xs text-zinc-400 truncate">
                / {record.wallet_name}
              </span>
            )}
          </div>

          {/* Zero-Pill unboxed clean typography metadata with typographic separators */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1.5 font-medium">
            <span>{record.record_type}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">{record.crypto_network}</span>
          </div>

          {/* Wallet address partially shortened */}
          {record.wallet_address && (
            <div className="mt-2 text-xs font-mono text-zinc-400 truncate flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px]">ADDR:</span>
              <span className="text-zinc-300">{shortenAddress(record.wallet_address, 8, 6)}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 p-1 rounded-lg text-zinc-600 group-hover:text-zinc-300 transition mt-1">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

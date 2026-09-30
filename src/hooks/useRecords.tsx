import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  fetchUserCryptoRecords,
  insertCryptoRecord,
  updateCryptoRecord,
  deleteCryptoRecord as deleteCryptoRecordFromStorage,
} from '../lib/cryptoStorage';
import { CryptoRecord, CryptoRecordInput } from '../types/crypto';
import { useAuth } from './useAuth';

export interface RecordsContextType {
  records: CryptoRecord[];
  loading: boolean;
  error: string | null;
  refreshRecords: () => Promise<void>;
  saveRecord: (
    input: CryptoRecordInput,
    recordId?: string
  ) => Promise<{ success: boolean; record?: CryptoRecord; error?: string }>;
  deleteRecord: (recordId: string) => Promise<{ success: boolean; error?: string }>;
  getRecordById: (id: string | null) => CryptoRecord | undefined;
  isVaultUnlocked: boolean;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export const RecordsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isVaultUnlocked, session } = useAuth();
  const [records, setRecords] = useState<CryptoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const data = await fetchUserCryptoRecords(user.id);
        setRecords(data);
        // Sync to local cache
        try {
          localStorage.setItem(`cryptolocker_records_${user.id}`, JSON.stringify(data));
        } catch {
          // Ignore storage quota
        }
      } else {
        // Fallback local storage for offline / unconfigured demo
        const local =
          localStorage.getItem(`cryptolocker_records_${user.id}`) ||
          localStorage.getItem(`bankvault_demo_records_${user.id}`);
        if (local) {
          setRecords(JSON.parse(local));
        } else {
          // Pre-seed sample records for initial offline demo
          const seed: CryptoRecord[] = [
            {
              id: 'seed-btc-01',
              user_id: user.id,
              wallet_name: 'Cold Storage Vault',
              exchange_or_wallet_provider: 'Ledger Nano X',
              record_type: 'Hardware Wallet',
              crypto_network: 'Bitcoin',
              wallet_address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
              username_or_email: 'ledger-admin@vault.internal',
              wallet_password: 'SecureKey99!#Vault',
              pin: '839201',
              seed_phrase: 'witch collapse practice feed shame open despair creek road again ice least',
              recovery_codes: 'REC-9941-8821\nREC-4012-7729',
              two_factor_codes: 'JBSWY3DPEHPK3PXP',
              private_key: '5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ',
              website_url: 'https://ledger.com',
              notes: 'Primary long-term Bitcoin cold storage stored in secure physical safety deposit box.',
              created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
              updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
            },
            {
              id: 'seed-eth-02',
              user_id: user.id,
              wallet_name: 'DeFi Mainnet Operations',
              exchange_or_wallet_provider: 'MetaMask Mobile',
              record_type: 'Mobile Wallet',
              crypto_network: 'Ethereum',
              wallet_address: '0x71C8fb866E52e3560ae821C8dE4b5A60f77cD321',
              username_or_email: 'defi_operator@proton.me',
              wallet_password: 'MetaMaskPassphrase$404',
              pin: '4491',
              seed_phrase: 'ocean guitar matrix vibrant rhythm echo cascade silent river timber meadow quartz',
              recovery_codes: 'AUTH-1123-9940',
              two_factor_codes: 'GA-993214',
              private_key: '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d',
              website_url: 'https://metamask.io',
              notes: 'Used for Uniswap liquidity pools, Aave lending, and MakerDAO vaults.',
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
              updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
          ];
          localStorage.setItem(`cryptolocker_records_${user.id}`, JSON.stringify(seed));
          setRecords(seed);
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Failed to load records.');
      // Attempt local storage cache retrieval
      const local = localStorage.getItem(`cryptolocker_records_${user.id}`);
      if (local) {
        try {
          setRecords(JSON.parse(local));
        } catch {
          // Ignore
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const saveRecord = async (
    input: CryptoRecordInput,
    recordId?: string
  ): Promise<{ success: boolean; record?: CryptoRecord; error?: string }> => {
    // 1. Resolve user ID from active user or session
    const currentUserId = user?.id || session?.user?.id;
    if (!currentUserId) {
      return { success: false, error: 'Authentication required. Please sign in to save credentials.' };
    }

    // 2. Validate essential fields
    const cleanWalletName = (input.wallet_name || '').trim();
    const cleanExchangeName = (input.exchange_or_wallet_provider || '').trim();

    if (!cleanWalletName) {
      return { success: false, error: 'Wallet Name is required.' };
    }
    if (!cleanExchangeName) {
      return { success: false, error: 'Wallet / Exchange Provider Name is required.' };
    }

    const payload: CryptoRecordInput = {
      ...input,
      wallet_name: cleanWalletName,
      exchange_or_wallet_provider: cleanExchangeName,
    };

    try {
      if (isSupabaseConfigured()) {
        if (recordId) {
          // UPDATE
          const updated = await updateCryptoRecord(recordId, payload, currentUserId);
          setRecords((prev) => {
            const next = prev.map((r) => (r.id === recordId ? updated : r));
            try {
              localStorage.setItem(`cryptolocker_records_${currentUserId}`, JSON.stringify(next));
            } catch {
              // Ignore
            }
            return next;
          });
          return { success: true, record: updated };
        } else {
          // INSERT
          const created = await insertCryptoRecord(payload, currentUserId);
          setRecords((prev) => {
            const next = [created, ...prev];
            try {
              localStorage.setItem(`cryptolocker_records_${currentUserId}`, JSON.stringify(next));
            } catch {
              // Ignore
            }
            return next;
          });
          return { success: true, record: created };
        }
      } else {
        // Fallback local storage
        const now = new Date().toISOString();
        if (recordId) {
          const updatedRecords = records.map((r) =>
            r.id === recordId
              ? {
                  ...r,
                  ...payload,
                  updated_at: now,
                }
              : r
          );
          setRecords(updatedRecords);
          localStorage.setItem(`cryptolocker_records_${currentUserId}`, JSON.stringify(updatedRecords));
          const found = updatedRecords.find((r) => r.id === recordId);
          return { success: true, record: found };
        } else {
          const newRecord: CryptoRecord = {
            id: 'rec-' + Math.random().toString(36).substring(2, 11),
            user_id: currentUserId,
            ...payload,
            created_at: now,
            updated_at: now,
          };
          const updatedRecords = [newRecord, ...records];
          setRecords(updatedRecords);
          localStorage.setItem(`cryptolocker_records_${currentUserId}`, JSON.stringify(updatedRecords));
          return { success: true, record: newRecord };
        }
      }
    } catch (err: unknown) {
      const e = err as Error;
      return { success: false, error: e.message || 'Failed to save record to vault.' };
    }
  };

  const deleteRecord = async (recordId: string): Promise<{ success: boolean; error?: string }> => {
    const currentUserId = user?.id || session?.user?.id;
    if (!currentUserId) return { success: false, error: 'User is not logged in.' };

    try {
      if (isSupabaseConfigured()) {
        await deleteCryptoRecordFromStorage(recordId);
      }
      setRecords((prev) => {
        const next = prev.filter((r) => r.id !== recordId);
        try {
          localStorage.setItem(`cryptolocker_records_${currentUserId}`, JSON.stringify(next));
        } catch {
          // Ignore
        }
        return next;
      });
      return { success: true };
    } catch (err: unknown) {
      const e = err as Error;
      return { success: false, error: e.message || 'Failed to delete record.' };
    }
  };

  const getRecordById = (id: string | null): CryptoRecord | undefined => {
    if (!id) return undefined;
    return records.find((r) => r.id === id);
  };

  const value: RecordsContextType = {
    records,
    loading,
    error,
    refreshRecords: fetchRecords,
    saveRecord,
    deleteRecord,
    getRecordById,
    isVaultUnlocked,
  };

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
};

export function useRecords(): RecordsContextType {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return context;
}

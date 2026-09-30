import { useState, useCallback, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { isUserAdmin } from '../lib/config';
import { fetchAllAdminCryptoRecords, deleteCryptoRecord } from '../lib/cryptoStorage';
import { CryptoRecord } from '../types/crypto';
import { AdminUserSummary } from '../types/auth';
import { useAuth } from './useAuth';

export interface AdminStats {
  totalUsers: number;
  totalRecords: number;
  recordsByType: Record<string, number>;
  recordsByNetwork: Record<string, number>;
  recentRecords: (CryptoRecord & { user_email?: string })[];
}

export function useAdmin() {
  const { user, isVaultUnlocked } = useAuth();
  const isAdmin = isUserAdmin(user?.id);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [allRecords, setAllRecords] = useState<(CryptoRecord & { user_email?: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear administrative data immediately if user signs out or is not admin
  useEffect(() => {
    if (!user || !isAdmin || !isVaultUnlocked) {
      setStats(null);
      setUsers([]);
      setAllRecords([]);
    }
  }, [user, isAdmin, isVaultUnlocked]);

  const loadAdminData = useCallback(async () => {
    if (!isAdmin || !user) {
      setError('Unauthorized: Administrator access required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const rawRecords = await fetchAllAdminCryptoRecords();

        // Extract distinct users and record counts
        const userMap = new Map<string, { count: number; lastDate: string }>();
        const byType: Record<string, number> = {};
        const byNetwork: Record<string, number> = {};

        rawRecords.forEach((rec) => {
          // Count by type
          byType[rec.record_type] = (byType[rec.record_type] || 0) + 1;
          // Count by network
          byNetwork[rec.crypto_network] = (byNetwork[rec.crypto_network] || 0) + 1;

          // Aggregate by user
          const existing = userMap.get(rec.user_id);
          if (existing) {
            existing.count += 1;
            if (new Date(rec.created_at) > new Date(existing.lastDate)) {
              existing.lastDate = rec.created_at;
            }
          } else {
            userMap.set(rec.user_id, { count: 1, lastDate: rec.created_at });
          }
        });

        // Build user summaries
        const userSummaries: AdminUserSummary[] = [];
        // Include the current admin
        if (!userMap.has(user.id)) {
          userMap.set(user.id, { count: 0, lastDate: user.created_at || new Date().toISOString() });
        }

        userMap.forEach((val, uid) => {
          userSummaries.push({
            id: uid,
            email: uid === user.id ? (user.email || 'admin@cryptolocker.internal') : `user_${uid.slice(0, 8)}@vault.node`,
            created_at: val.lastDate,
            record_count: val.count,
          });
        });

        setUsers(userSummaries);
        setAllRecords(rawRecords);
        setStats({
          totalUsers: userSummaries.length,
          totalRecords: rawRecords.length,
          recordsByType: byType,
          recordsByNetwork: byNetwork,
          recentRecords: rawRecords.slice(0, 10),
        });
      } else {
        // Local demonstration mode for offline / unconfigured admin preview
        const mockUsers: AdminUserSummary[] = [
          {
            id: user.id,
            email: user.email || 'admin@cryptolocker.io',
            created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
            record_count: 3,
          },
          {
            id: 'usr-whale-9921',
            email: 'satoshi_cold@institutional.co',
            created_at: new Date(Date.now() - 86400000 * 18).toISOString(),
            record_count: 5,
          },
          {
            id: 'usr-defi-4481',
            email: 'arbitrum_runner@layer2.eth',
            created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
            record_count: 4,
          },
          {
            id: 'usr-staking-0192',
            email: 'solana_validator@staking.net',
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
            record_count: 2,
          },
        ];

        // Gather local records
        const local = localStorage.getItem(`cryptolocker_records_${user.id}`);
        const userRecs: CryptoRecord[] = local ? JSON.parse(local) : [];

        const mockOtherRecords: (CryptoRecord & { user_email?: string })[] = [
          {
            id: 'adm-rec-01',
            user_id: 'usr-whale-9921',
            user_email: 'satoshi_cold@institutional.co',
            wallet_name: 'BitGo Institutional Custody',
            exchange_or_wallet_provider: 'BitGo Prime',
            record_type: 'Custodial Wallet',
            crypto_network: 'Bitcoin',
            wallet_address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
            username_or_email: 'custody@bitgo.vip',
            wallet_password: 'EnterpriseKey!#991',
            pin: '992019',
            seed_phrase: 'bullet crystal galaxy meadow thunder whisper matrix timber orbit solar nomad flame',
            recovery_codes: 'AUTH-BG-9921\nAUTH-BG-8841',
            two_factor_codes: 'TOTP-883912',
            private_key: 'L4vSgQe6N4u9z5n1rL8Y3x2Wq1Z9e7X8Y5n1rL8Y3x2Wq1Z9e7X8',
            website_url: 'https://bitgo.com',
            notes: 'Multi-sig 3-of-5 corporate treasury vault.',
            created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
          },
          {
            id: 'adm-rec-02',
            user_id: 'usr-defi-4481',
            user_email: 'arbitrum_runner@layer2.eth',
            wallet_name: 'GMX Arbitrum Trading Bot',
            exchange_or_wallet_provider: 'Rabby Wallet',
            record_type: 'Trading Account',
            crypto_network: 'Arbitrum',
            wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
            username_or_email: 'bot_operator@gmx.io',
            wallet_password: 'ArbitrumSecurePass#2026',
            pin: '7721',
            seed_phrase: 'timber whisper flame velvet cascade quartz matrix solar ocean river practice open',
            recovery_codes: 'REC-GMX-4481',
            two_factor_codes: 'TOTP-448192',
            private_key: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            website_url: 'https://app.gmx.io',
            notes: 'Perpetual contract margin account with GLP liquidity.',
            created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 8).toISOString(),
          },
          {
            id: 'adm-rec-03',
            user_id: 'usr-staking-0192',
            user_email: 'solana_validator@staking.net',
            wallet_name: 'Solana Epoch Stake Node',
            exchange_or_wallet_provider: 'Solana CLI Keypair',
            record_type: 'Staking',
            crypto_network: 'Solana',
            wallet_address: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
            username_or_email: 'validator@solana.node',
            wallet_password: 'SolanaNodeKeypair$Pass',
            pin: '3391',
            seed_phrase: 'desert flame galaxy nomad whisper crystal velvet solar timber ocean rhythm quartz',
            recovery_codes: 'SOL-VALIDATOR-KEY',
            two_factor_codes: 'TOTP-109284',
            private_key: '4xJkNm9281nL8Y3x2Wq1Z9e7X8Y5n1rL8Y3x2Wq1Z9e7X8Y5n1rL8Y3x',
            website_url: 'https://solana.com',
            notes: 'Vote account and identity authority keypair.',
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
        ];

        const combinedRecords = [
          ...userRecs.map(r => ({ ...r, user_email: user.email || 'You (Admin)' })),
          ...mockOtherRecords,
        ];

        const byType: Record<string, number> = {};
        const byNetwork: Record<string, number> = {};
        combinedRecords.forEach(r => {
          byType[r.record_type] = (byType[r.record_type] || 0) + 1;
          byNetwork[r.crypto_network] = (byNetwork[r.crypto_network] || 0) + 1;
        });

        setUsers(mockUsers);
        setAllRecords(combinedRecords);
        setStats({
          totalUsers: mockUsers.length,
          totalRecords: combinedRecords.length,
          recordsByType: byType,
          recordsByNetwork: byNetwork,
          recentRecords: combinedRecords.slice(0, 10),
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Error retrieving administrator records.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const deleteAdminRecord = async (recordId: string): Promise<{ success: boolean; error?: string }> => {
    if (!isAdmin) return { success: false, error: 'Unauthorized: Admin privileges required.' };

    try {
      if (isSupabaseConfigured()) {
        await deleteCryptoRecord(recordId);
      }

      setAllRecords(prev => prev.filter(r => r.id !== recordId));
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Failed to remove record.' };
    }
  };

  return {
    isAdmin,
    stats,
    users,
    allRecords,
    loading,
    error,
    refreshAdminData: loadAdminData,
    deleteAdminRecord,
  };
}

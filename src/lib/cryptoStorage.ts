import { supabase, isSupabaseConfigured } from './supabase';
import { CryptoRecord, CryptoRecordInput, RecordType, CryptoNetwork } from '../types/crypto';

interface UserItemRow {
  id: number | string;
  created_at: string;
  category: string;
  title: string;
  content: string;
  user_id: string;
}

let activeTableCache: 'user_items' | 'crypto_records' = 'user_items';

/**
 * Parses a row from `user_items` (where category = 'Crypto') into a full CryptoRecord
 */
export function parseUserItemToCryptoRecord(row: UserItemRow): CryptoRecord {
  const content = row.content || '';
  let meta: Partial<CryptoRecordInput> = {};

  // Extract embedded JSON metadata block if present
  const metaMatch = content.match(/<!--CRYPTOLOCKER_DATA\s*([\s\S]*?)\s*-->/);
  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1]);
    } catch {
      // Fallback to text parsing
    }
  }

  // Parse legacy human-readable key-value lines
  const lines = content.split('\n');
  const kv: Record<string, string> = {};
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim().toLowerCase();
      const val = line.slice(colonIdx + 1).trim();
      kv[key] = val;
    }
  }

  const walletName = meta.wallet_name || row.title || 'Untitled Wallet';
  const provider =
    meta.exchange_or_wallet_provider ||
    kv['exchange / provider'] ||
    kv['exchange / wallet provider'] ||
    kv['provider'] ||
    kv['asset type'] ||
    row.title ||
    'Other';

  const recordType = (meta.record_type || kv['record type'] || 'Hardware Wallet') as RecordType;
  const cryptoNetwork = (meta.crypto_network ||
    kv['network'] ||
    kv['crypto network'] ||
    kv['cryptocurrency network'] ||
    'Bitcoin') as CryptoNetwork;

  return {
    id: String(row.id),
    user_id: row.user_id,
    wallet_name: walletName,
    exchange_or_wallet_provider: provider,
    record_type: recordType,
    crypto_network: cryptoNetwork,
    username_or_email: meta.username_or_email || kv['username / email'] || kv['username'] || undefined,
    wallet_password: meta.wallet_password || kv['wallet password'] || undefined,
    pin: meta.pin || kv['pin'] || undefined,
    seed_phrase:
      meta.seed_phrase ||
      kv['seed phrase'] ||
      kv['secret phrase/private key'] ||
      kv['secret phrase/public key'] ||
      undefined,
    recovery_codes: meta.recovery_codes || kv['recovery codes'] || undefined,
    two_factor_codes: meta.two_factor_codes || kv['2fa codes'] || kv['two factor codes'] || undefined,
    private_key: meta.private_key || kv['private key'] || undefined,
    wallet_address: meta.wallet_address || kv['wallet address'] || kv['public address / identifier'] || undefined,
    website_url: meta.website_url || kv['website / url'] || kv['website'] || undefined,
    notes: meta.notes || kv['notes'] || undefined,
    created_at: row.created_at,
    updated_at: row.created_at,
  };
}

/**
 * Serializes a full 14-field CryptoRecordInput into a user_items row payload
 */
export function formatCryptoRecordToUserItem(input: CryptoRecordInput, userId: string) {
  const meta: CryptoRecordInput = {
    wallet_name: (input.wallet_name || '').trim(),
    exchange_or_wallet_provider: (input.exchange_or_wallet_provider || '').trim(),
    record_type: input.record_type,
    crypto_network: input.crypto_network,
    username_or_email: input.username_or_email ? input.username_or_email.trim() : undefined,
    wallet_password: input.wallet_password || undefined,
    pin: input.pin || undefined,
    seed_phrase: input.seed_phrase ? input.seed_phrase.trim() : undefined,
    recovery_codes: input.recovery_codes ? input.recovery_codes.trim() : undefined,
    two_factor_codes: input.two_factor_codes ? input.two_factor_codes.trim() : undefined,
    private_key: input.private_key ? input.private_key.trim() : undefined,
    wallet_address: input.wallet_address ? input.wallet_address.trim() : undefined,
    website_url: input.website_url ? input.website_url.trim() : undefined,
    notes: input.notes ? input.notes.trim() : undefined,
  };

  const readableLines: string[] = [];
  readableLines.push(`Exchange / Provider: ${input.exchange_or_wallet_provider}`);
  readableLines.push(`Record Type: ${input.record_type}`);
  readableLines.push(`Crypto Network: ${input.crypto_network}`);
  if (input.wallet_address) readableLines.push(`Wallet Address: ${input.wallet_address}`);
  if (input.username_or_email) readableLines.push(`Username / Email: ${input.username_or_email}`);
  if (input.wallet_password) readableLines.push(`Wallet Password: ${input.wallet_password}`);
  if (input.pin) readableLines.push(`PIN: ${input.pin}`);
  if (input.seed_phrase) readableLines.push(`Seed Phrase: ${input.seed_phrase}`);
  if (input.private_key) readableLines.push(`Private Key: ${input.private_key}`);
  if (input.two_factor_codes) readableLines.push(`2FA Codes: ${input.two_factor_codes}`);
  if (input.recovery_codes) readableLines.push(`Recovery Codes: ${input.recovery_codes}`);
  if (input.website_url) readableLines.push(`Website / URL: ${input.website_url}`);
  if (input.notes) readableLines.push(`Notes: ${input.notes}`);

  const content = `${readableLines.join('\n')}\n\n<!--CRYPTOLOCKER_DATA\n${JSON.stringify(meta)}\n-->`;

  return {
    category: 'Crypto',
    title: input.wallet_name,
    content,
    user_id: userId,
  };
}

/**
 * Fetch all records for the current user from Supabase.
 * Uses `user_items` with category = 'Crypto', and supports server proxy fallback.
 */
export async function fetchUserCryptoRecords(userId: string): Promise<CryptoRecord[]> {
  if (!isSupabaseConfigured() || !userId) return [];

  try {
    // 1. Query client-side Supabase user_items for category = 'Crypto'
    const { data: userItemsData, error: userItemsError } = await supabase
      .from('user_items')
      .select('*')
      .eq('category', 'Crypto')
      .order('created_at', { ascending: false });

    if (!userItemsError && userItemsData) {
      return userItemsData.map((row) => parseUserItemToCryptoRecord(row as UserItemRow));
    }

    if (userItemsError) {
      console.warn('Direct user_items fetch issue, falling back to server API:', userItemsError.message);
    }
  } catch (err) {
    console.warn('Direct fetch failed, trying backend API:', err);
  }

  // 2. Fallback to server API proxy
  try {
    const res = await fetch(`/api/records?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.records)) {
        return json.records as CryptoRecord[];
      }
    }
  } catch (backendErr) {
    console.warn('Backend proxy fetch also failed:', backendErr);
  }

  return [];
}

/**
 * Inserts a new crypto record into Supabase.
 */
export async function insertCryptoRecord(input: CryptoRecordInput, userId: string): Promise<CryptoRecord> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('Supabase is not configured or user is not authenticated.');
  }

  const userItemPayload = formatCryptoRecordToUserItem(input, userId);

  // 1. Attempt client-side Supabase insert into user_items table under category 'Crypto'
  try {
    const { data: insertedItem, error: insertError } = await supabase
      .from('user_items')
      .insert([userItemPayload])
      .select();

    if (!insertError && insertedItem && insertedItem[0]) {
      return parseUserItemToCryptoRecord(insertedItem[0] as UserItemRow);
    }

    if (insertError) {
      console.warn('Direct user_items insert failed (e.g. RLS), attempting backend persistence:', insertError.message);
    }
  } catch (clientErr) {
    console.warn('Client insert threw error, attempting backend proxy:', clientErr);
  }

  // 2. Backend proxy fallback using serverSupabase with service role
  try {
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: input, userId }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.record) {
        return json.record as CryptoRecord;
      }
      if (json.error) {
        throw new Error(json.error);
      }
    } else {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `Server responded with status ${res.status}`);
    }
  } catch (backendErr: any) {
    throw new Error(backendErr.message || 'Failed to save crypto record to database.');
  }

  return {
    id: String(Date.now()),
    user_id: userId,
    ...input,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Updates an existing crypto record in Supabase.
 */
export async function updateCryptoRecord(
  recordId: string,
  input: CryptoRecordInput,
  userId: string
): Promise<CryptoRecord> {
  if (!isSupabaseConfigured() || !userId) {
    throw new Error('Supabase is not configured or user is not authenticated.');
  }

  const userItemPayload = formatCryptoRecordToUserItem(input, userId);

  // Check if numeric ID for user_items bigint column
  const isNumericId = /^\d+$/.test(recordId);

  if (isNumericId) {
    try {
      const { data: updatedItem, error: updateError } = await supabase
        .from('user_items')
        .update({
          title: userItemPayload.title,
          content: userItemPayload.content,
          category: 'Crypto',
        })
        .eq('id', recordId)
        .select();

      if (!updateError && updatedItem && updatedItem[0]) {
        return parseUserItemToCryptoRecord(updatedItem[0] as UserItemRow);
      }
    } catch (clientErr) {
      console.warn('Client update failed, falling back to server API:', clientErr);
    }

    // Backend proxy fallback
    try {
      const res = await fetch(`/api/records/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: input, userId }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.record) {
          return json.record as CryptoRecord;
        }
      }
    } catch {
      // Fallback below
    }
  }

  return {
    id: recordId,
    user_id: userId,
    ...input,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Deletes a crypto record from Supabase.
 */
export async function deleteCryptoRecord(recordId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const isNumericId = /^\d+$/.test(recordId);
  if (isNumericId) {
    try {
      const { error: userItemError } = await supabase.from('user_items').delete().eq('id', recordId);
      if (!userItemError) return;
    } catch (clientErr) {
      console.warn('Client delete failed, attempting backend proxy:', clientErr);
    }

    // Backend proxy fallback
    try {
      await fetch(`/api/records/${recordId}`, { method: 'DELETE' });
      return;
    } catch {
      // Ignore
    }
  }
}

/**
 * Admin view: Fetch all crypto records across all users.
 */
export async function fetchAllAdminCryptoRecords(): Promise<(CryptoRecord & { user_email?: string })[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('user_items')
      .select('*')
      .eq('category', 'Crypto')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return (data || []).map((row) => parseUserItemToCryptoRecord(row as UserItemRow));
    }
  } catch (err) {
    console.warn('Client admin fetch failed, falling back to server overview:', err);
  }

  // Fallback to server overview endpoint
  try {
    const res = await fetch('/api/records');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.records)) {
        return json.records;
      }
    }
  } catch {
    // Ignore
  }

  return [];
}

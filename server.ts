import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ADMIN_USER_ID = process.env.VITE_ADMIN_USER_ID || '';

// Server-side Supabase client (only uses service role if provided on backend, never leaked to client)
const serverSupabase = (SUPABASE_URL && (SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY))
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE || SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  : null;

// Administrator Authorization Middleware
async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or malformed Authorization header.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!serverSupabase) {
      // In local offline mode, check mock admin header
      if (req.headers['x-admin-user-id'] === ADMIN_USER_ID && ADMIN_USER_ID) {
        return next();
      }
      res.status(503).json({ error: 'Supabase server client not configured.' });
      return;
    }

    const { data: { user }, error } = await serverSupabase.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired user session token.' });
      return;
    }

    if (!ADMIN_USER_ID || user.id.toLowerCase() !== ADMIN_USER_ID.toLowerCase()) {
      res.status(403).json({ error: 'Forbidden: User is not authorized as an administrator.' });
      return;
    }

    (req as any).adminUser = user;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server authorization error.' });
  }
}

// Admin API Routes
app.get('/api/admin/health', (_req, res) => {
  res.json({
    status: 'ok',
    adminConfigured: !!ADMIN_USER_ID,
    supabaseConfigured: !!SUPABASE_URL,
    serviceRoleConfigured: !!SUPABASE_SERVICE_ROLE,
  });
});

// Helper for parsing user_items row
function parseUserItemRow(row: any) {
  const content = row.content || '';
  let meta: any = {};
  const metaMatch = content.match(/<!--CRYPTOLOCKER_DATA\s*([\s\S]*?)\s*-->/);
  if (metaMatch) {
    try {
      meta = JSON.parse(metaMatch[1]);
    } catch {}
  }

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

  const recordType = meta.record_type || kv['record type'] || 'Hardware Wallet';
  const cryptoNetwork =
    meta.crypto_network ||
    kv['network'] ||
    kv['crypto network'] ||
    kv['cryptocurrency network'] ||
    'Bitcoin';

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

function formatCryptoRecordPayload(input: any, userId: string) {
  const meta = {
    wallet_name: (input.wallet_name || '').trim(),
    exchange_or_wallet_provider: (input.exchange_or_wallet_provider || '').trim(),
    record_type: input.record_type || 'Hardware Wallet',
    crypto_network: input.crypto_network || 'Bitcoin',
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
  readableLines.push(`Exchange / Provider: ${meta.exchange_or_wallet_provider}`);
  readableLines.push(`Record Type: ${meta.record_type}`);
  readableLines.push(`Crypto Network: ${meta.crypto_network}`);
  if (meta.wallet_address) readableLines.push(`Wallet Address: ${meta.wallet_address}`);
  if (meta.username_or_email) readableLines.push(`Username / Email: ${meta.username_or_email}`);
  if (meta.wallet_password) readableLines.push(`Wallet Password: ${meta.wallet_password}`);
  if (meta.pin) readableLines.push(`PIN: ${meta.pin}`);
  if (meta.seed_phrase) readableLines.push(`Seed Phrase: ${meta.seed_phrase}`);
  if (meta.private_key) readableLines.push(`Private Key: ${meta.private_key}`);
  if (meta.two_factor_codes) readableLines.push(`2FA Codes: ${meta.two_factor_codes}`);
  if (meta.recovery_codes) readableLines.push(`Recovery Codes: ${meta.recovery_codes}`);
  if (meta.website_url) readableLines.push(`Website / URL: ${meta.website_url}`);
  if (meta.notes) readableLines.push(`Notes: ${meta.notes}`);

  const content = `${readableLines.join('\n')}\n\n<!--CRYPTOLOCKER_DATA\n${JSON.stringify(meta)}\n-->`;

  return {
    category: 'Crypto',
    title: meta.wallet_name,
    content,
    user_id: userId,
  };
}

// Crypto Records API Routes (secure backend proxy with service role persistence)
app.post('/api/records', async (req, res) => {
  try {
    if (!serverSupabase) {
      res.status(503).json({ error: 'Database service is not configured.' });
      return;
    }

    const { record, userId } = req.body;
    if (!record || !userId) {
      res.status(400).json({ error: 'Missing record payload or userId.' });
      return;
    }

    const payload = formatCryptoRecordPayload(record, userId);
    const { data, error } = await serverSupabase
      .from('user_items')
      .insert([payload])
      .select();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (data && data[0]) {
      const parsed = parseUserItemRow(data[0]);
      res.json({ success: true, record: parsed });
      return;
    }

    res.status(500).json({ error: 'No data returned from database insert.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save crypto record.' });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    if (!serverSupabase) {
      res.status(503).json({ error: 'Database service is not configured.' });
      return;
    }

    const userId = req.query.userId as string;
    let query = serverSupabase
      .from('user_items')
      .select('*')
      .eq('category', 'Crypto');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const parsed = (data || []).map(parseUserItemRow);
    res.json({ success: true, records: parsed });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve crypto records.' });
  }
});

app.put('/api/records/:id', async (req, res) => {
  try {
    if (!serverSupabase) {
      res.status(503).json({ error: 'Database service is not configured.' });
      return;
    }

    const recordId = req.params.id;
    const { record, userId } = req.body;
    if (!record || !userId) {
      res.status(400).json({ error: 'Missing record payload or userId.' });
      return;
    }

    const payload = formatCryptoRecordPayload(record, userId);
    const { data, error } = await serverSupabase
      .from('user_items')
      .update({
        title: payload.title,
        content: payload.content,
        category: 'Crypto',
      })
      .eq('id', recordId)
      .select();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (data && data[0]) {
      const parsed = parseUserItemRow(data[0]);
      res.json({ success: true, record: parsed });
      return;
    }

    res.status(500).json({ error: 'Failed to update record in database.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update crypto record.' });
  }
});

app.delete('/api/records/:id', async (req, res) => {
  try {
    if (!serverSupabase) {
      res.status(503).json({ error: 'Database service is not configured.' });
      return;
    }

    const recordId = req.params.id;
    const { error } = await serverSupabase
      .from('user_items')
      .delete()
      .eq('id', recordId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete crypto record.' });
  }
});

app.get('/api/admin/overview', requireAdmin, async (_req, res) => {
  try {
    if (!serverSupabase) {
      res.json({ users: 0, records: 0 });
      return;
    }

    let records: any[] = [];
    const { data: cryptoData, error: cryptoError } = await serverSupabase
      .from('crypto_records')
      .select('id, user_id, record_type, crypto_network, created_at');

    if (!cryptoError && cryptoData) {
      records = cryptoData;
    } else if (cryptoError && cryptoError.code === 'PGRST205') {
      const { data: userItemsData, error: userItemsError } = await serverSupabase
        .from('user_items')
        .select('id, user_id, created_at')
        .eq('category', 'Crypto');

      if (userItemsError) {
        res.status(500).json({ error: userItemsError.message });
        return;
      }
      records = (userItemsData || []).map(r => ({
        id: r.id,
        user_id: r.user_id,
        record_type: 'Wallet',
        crypto_network: 'Bitcoin',
        created_at: r.created_at,
      }));
    } else if (cryptoError) {
      res.status(500).json({ error: cryptoError.message });
      return;
    }

    const distinctUsers = new Set((records || []).map(r => r.user_id));

    res.json({
      totalUsers: distinctUsers.size,
      totalRecords: records?.length || 0,
      records: records || [],
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Mount Vite or static build
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CryptoLocker Server running on port ${PORT}`);
  });
}

startServer();

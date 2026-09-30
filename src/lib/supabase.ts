import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read from Vite environment variables
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback to locally stored connection overrides (useful for instant runtime configuration)
function getInitialConfig() {
  if (typeof window === 'undefined') {
    return { url: ENV_URL, key: ENV_KEY };
  }
  const storedUrl = localStorage.getItem('bankvault_supabase_url');
  const storedKey = localStorage.getItem('bankvault_supabase_anon_key');
  return {
    url: storedUrl || ENV_URL,
    key: storedKey || ENV_KEY,
  };
}

let currentConfig = getInitialConfig();

export function isSupabaseConfigured(): boolean {
  return !!(
    currentConfig.url &&
    currentConfig.key &&
    currentConfig.url.startsWith('https://') &&
    currentConfig.url !== 'https://your-project.supabase.co'
  );
}

export function createSupabaseInstance(url: string, key: string): SupabaseClient {
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'bankvault_supabase_auth_token',
    },
  });
}

// Fallback safe client so imports never crash before configuration
const dummyUrl = 'https://placeholder.supabase.co';
const dummyKey = 'placeholder-anon-key';

export let supabase: SupabaseClient = createSupabaseInstance(
  isSupabaseConfigured() ? currentConfig.url : dummyUrl,
  isSupabaseConfigured() ? currentConfig.key : dummyKey
);

export function updateSupabaseConfig(url: string, key: string): { success: boolean; error?: string } {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = key.trim();

    if (!trimmedUrl.startsWith('https://')) {
      return { success: false, error: 'Supabase URL must start with https://' };
    }
    if (!trimmedKey) {
      return { success: false, error: 'Supabase Anon Key is required.' };
    }

    localStorage.setItem('bankvault_supabase_url', trimmedUrl);
    localStorage.setItem('bankvault_supabase_anon_key', trimmedKey);

    currentConfig = { url: trimmedUrl, key: trimmedKey };
    supabase = createSupabaseInstance(trimmedUrl, trimmedKey);

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message || 'Failed to update Supabase configuration.' };
  }
}

export function getActiveSupabaseConfig() {
  return {
    url: currentConfig.url,
    isCustom: !!localStorage.getItem('bankvault_supabase_url'),
    isConfigured: isSupabaseConfigured(),
  };
}

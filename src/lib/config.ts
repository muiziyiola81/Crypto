// Configuration constants for CryptoLocker

export const APP_NAME = 'CryptoLocker';
export const APP_SHORT_NAME = 'CryptoLocker';
export const APP_TAGLINE = 'Private Cryptocurrency Credential Safe';

// The administrator UUID configured strictly via the VITE_ADMIN_USER_ID environment variable
const ENV_ADMIN_USER_ID = (import.meta.env.VITE_ADMIN_USER_ID || '').trim();

// Ensure any legacy client-side admin override in localStorage is removed
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('cryptolocker_admin_user_id');
  } catch {
    // Ignore storage errors
  }
}

/**
 * Checks if the given authenticated Supabase user UUID matches the configured VITE_ADMIN_USER_ID.
 * Strictly verifies exact UUID match against VITE_ADMIN_USER_ID — never relies on localStorage, email, or username.
 */
export function isUserAdmin(userId?: string | null): boolean {
  if (!userId || !ENV_ADMIN_USER_ID) return false;
  return userId.trim().toLowerCase() === ENV_ADMIN_USER_ID.toLowerCase();
}



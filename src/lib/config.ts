// Configuration constants for CryptoLocker

export const APP_NAME = 'CryptoLocker';
export const APP_SHORT_NAME = 'CryptoLocker';
export const APP_TAGLINE = 'Private Cryptocurrency Credential Safe';

// The administrator UUID configured via environment variable
const DEFAULT_ADMIN_USER_ID = 'cbeab3b8-b717-4020-8b9a-7e26596ca946';
const ENV_ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID || '';

/**
 * Retrieves the configured Administrator UUID.
 * Reads from localStorage override, VITE_ADMIN_USER_ID, or the default configured admin UUID.
 */
export function getAdminUserId(): string {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('cryptolocker_admin_user_id');
    if (local && local.trim()) return local.trim();
  }
  return (ENV_ADMIN_USER_ID || DEFAULT_ADMIN_USER_ID).trim();
}

/**
 * Checks if the given user UUID matches the configured administrator UUID.
 * Strictly verifies UUID match - never relies on email or username.
 */
export function isUserAdmin(userId?: string | null): boolean {
  if (!userId) return false;
  const adminId = getAdminUserId();
  if (!adminId) return false;
  return userId.trim().toLowerCase() === adminId.trim().toLowerCase();
}

/**
 * Configures the administrator UUID dynamically (stored in device settings if set).
 */
export function setAdminUserId(adminId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cryptolocker_admin_user_id', adminId.trim());
  }
}


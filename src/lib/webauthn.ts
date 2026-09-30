import { StoredPasskeyCredential, WebAuthnDiagnostics } from '../types/auth';

/**
 * Utility functions to convert between ArrayBuffer and Base64URL
 */
export function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlToBuffer(base64Url: string): ArrayBuffer {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Check if running inside an iframe (e.g. AI Studio development preview).
 * WebAuthn in cross-origin or sandboxed iframes requires explicit permissions policy delegation.
 */
export function isRunningInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Get the exact Relying Party ID (rpId) matching the current runtime HTTPS domain.
 * Never hardcodes preview/development URLs.
 */
export function getRpId(): string {
  if (typeof window === 'undefined') return 'localhost';
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost') return 'localhost';
  return hostname;
}

/**
 * Detects whether the current browser environment supports the WebAuthn API.
 */
export function isWebAuthnSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator.credentials !== 'undefined' &&
    typeof navigator.credentials.create === 'function' &&
    typeof navigator.credentials.get === 'function'
  );
}

/**
 * Checks whether a platform biometric authenticator (Touch ID, Face ID, Android Biometrics, Windows Hello)
 * is available on this physical device.
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

const PRIMARY_STORAGE_KEY_PREFIX = 'cryptolocker_passkey_cred_';
const LEGACY_STORAGE_KEY_PREFIX = 'bankvault_passkey_cred_';

/**
 * Retrieves registered passkey credentials for the given user.
 * Checks both primary and legacy namespace prefixes to maintain backward compatibility.
 */
export function getStoredPasskeys(userId: string): StoredPasskeyCredential[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw =
      localStorage.getItem(`${PRIMARY_STORAGE_KEY_PREFIX}${userId}`) ||
      localStorage.getItem(`${LEGACY_STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves a registered passkey credential for the authenticated user.
 */
export function saveStoredPasskey(userId: string, cred: StoredPasskeyCredential): void {
  if (typeof window === 'undefined' || !userId) return;
  const existing = getStoredPasskeys(userId).filter((c) => c.id !== cred.id);
  existing.push(cred);
  localStorage.setItem(`${PRIMARY_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(existing));
}

/**
 * Removes all passkey credentials for the specified user from this device.
 */
export function removeAllPasskeys(userId: string): void {
  if (typeof window === 'undefined' || !userId) return;
  localStorage.removeItem(`${PRIMARY_STORAGE_KEY_PREFIX}${userId}`);
  localStorage.removeItem(`${LEGACY_STORAGE_KEY_PREFIX}${userId}`);
}

/**
 * Parses and categorizes WebAuthn errors without leaking any sensitive data.
 * Distinguishes user cancellation, timeouts, missing credentials, iframe permissions restrictions, etc.
 */
export function parseWebAuthnError(
  err: unknown,
  operation: 'registration' | 'authentication'
): { userMessage: string; diagnostics: WebAuthnDiagnostics } {
  const error = err as Error;
  const errorName = error?.name || 'UnknownError';
  const rawMessage = error?.message || '';
  const isIframe = isRunningInIframe();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const rpId = getRpId();

  // Strip any accidental long hashes or potential secret tokens from diagnostics
  const safeMessage = rawMessage.replace(/[A-Za-z0-9+/=_-]{32,}/g, '[REDACTED_TOKEN]');
  let userMessage = 'Biometric authentication failed. Please try again.';
  let safeReason = `${errorName}: ${safeMessage || 'No specific error message provided by browser.'}`;

  // 1. Insecure Context check
  if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
    userMessage = 'WebAuthn requires an HTTPS secure context. Biometric operations cannot run over unencrypted HTTP.';
    safeReason = 'Insecure context: window.isSecureContext is false.';
    return {
      userMessage,
      diagnostics: { errorName: 'InsecureContext', safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  const lowerMsg = safeMessage.toLowerCase();

  // 2. Iframe / Permissions Policy restrictions (common in embedded preview environments)
  const isIframeBlocked =
    isIframe &&
    (lowerMsg.includes('permission') ||
      lowerMsg.includes('policy') ||
      lowerMsg.includes('cross-origin') ||
      lowerMsg.includes('not allowed to use publickeycredentials') ||
      lowerMsg.includes('feature policy') ||
      lowerMsg.includes('iframe') ||
      (errorName === 'NotAllowedError' &&
        !lowerMsg.includes('cancel') &&
        !lowerMsg.includes('abort') &&
        !lowerMsg.includes('time') &&
        !lowerMsg.includes('dismiss')));

  if (isIframeBlocked) {
    userMessage =
      'Biometric authentication is restricted inside the preview iframe by browser security policies. Please open CryptoLocker directly in a separate browser window or tab to use biometric passkeys.';
    safeReason = `Iframe permissions restriction: WebAuthn blocked by parent container sandbox or Permissions-Policy (${errorName}: ${safeMessage || 'Access denied in iframe'}).`;
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 3. Genuine Timeout
  if (
    errorName === 'TimeoutError' ||
    lowerMsg.includes('timed out') ||
    lowerMsg.includes('timeout') ||
    lowerMsg.includes('time-out')
  ) {
    userMessage = 'Biometric authentication timed out. Please try again.';
    safeReason = 'The biometric prompt timed out waiting for touch/verification from the user.';
    return {
      userMessage,
      diagnostics: { errorName: 'TimeoutError', safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 4. Genuine User Cancellation / Dismissal
  if (
    errorName === 'NotAllowedError' &&
    (lowerMsg.includes('cancel') ||
      lowerMsg.includes('abort') ||
      lowerMsg.includes('dismiss') ||
      lowerMsg.includes('user cancelled') ||
      lowerMsg.includes('user canceled') ||
      lowerMsg.includes('the operation was aborted') ||
      lowerMsg.includes('denied by user') ||
      lowerMsg.includes('user denied'))
  ) {
    userMessage = 'Biometric authentication was cancelled.';
    safeReason = 'User dismissed or cancelled the device biometric/passkey prompt.';
    return {
      userMessage,
      diagnostics: { errorName: 'UserCancelled', safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 5. No matching credential on this device
  if (
    lowerMsg.includes('no credentials') ||
    lowerMsg.includes('no matching') ||
    lowerMsg.includes('not found') ||
    lowerMsg.includes('no passkey') ||
    lowerMsg.includes('no available credential')
  ) {
    userMessage = 'No biometric credential is registered for this device.';
    safeReason = 'No credential on this device matched the allowed passkey IDs.';
    return {
      userMessage,
      diagnostics: { errorName: 'NoMatchingCredential', safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 6. SecurityError (RP ID or Origin mismatch)
  if (errorName === 'SecurityError') {
    userMessage = 'WebAuthn security validation failed for this domain (RP ID mismatch or untrusted origin).';
    safeReason = `SecurityError: RP ID "${rpId}" is invalid for origin "${origin}" (${safeMessage}).`;
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 7. NotSupportedError
  if (errorName === 'NotSupportedError') {
    userMessage = 'This device or browser does not support the required biometric authentication features.';
    safeReason = `NotSupportedError: ${safeMessage || 'Algorithm or authenticator type not supported.'}`;
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 8. ConstraintError (e.g. platform enclave constraint could not be met)
  if (errorName === 'ConstraintError') {
    userMessage = 'The requested biometric authenticator constraint (e.g. platform hardware enclave) could not be met.';
    safeReason = `ConstraintError: ${safeMessage || 'Authenticator constraint cannot be satisfied.'}`;
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 9. InvalidStateError
  if (errorName === 'InvalidStateError') {
    userMessage =
      operation === 'registration'
        ? 'A biometric passkey with these credentials is already registered on this device.'
        : 'The authenticator is in an invalid state. Please restart the browser and try again.';
    safeReason = `InvalidStateError: ${safeMessage || 'Authenticator state conflict.'}`;
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // 10. General NotAllowedError fallback
  if (errorName === 'NotAllowedError') {
    if (isIframe) {
      userMessage =
        'Biometric authentication was cancelled or blocked by the preview frame security policy. Open CryptoLocker directly in a new tab if running in preview.';
      safeReason = `NotAllowedError in iframe: May be user cancellation or iframe restriction (${safeMessage || 'operation disallowed'}).`;
    } else {
      userMessage = 'Biometric authentication was cancelled.';
      safeReason = `NotAllowedError: Biometric verification was cancelled or disallowed by device (${safeMessage || 'prompt closed'}).`;
    }
    return {
      userMessage,
      diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
    };
  }

  // General fallback
  userMessage =
    operation === 'registration'
      ? 'Failed to enroll biometric passkey. Please check device security settings.'
      : 'Biometric authentication could not be completed.';

  return {
    userMessage,
    diagnostics: { errorName, safeReason, origin, rpId, isIframe, timestamp: new Date().toISOString() },
  };
}

/**
 * Real WebAuthn passkey registration.
 * Requests device biometric / passkey prompt through navigator.credentials.create()
 */
export async function registerDevicePasskey(
  user: { id: string; email: string },
  deviceName?: string
): Promise<{ success: boolean; credential?: StoredPasskeyCredential; error?: string; diagnostics?: WebAuthnDiagnostics }> {
  try {
    const supported = isWebAuthnSupported();
    if (!supported) {
      const diag: WebAuthnDiagnostics = {
        errorName: 'WebAuthnNotSupported',
        safeReason: 'The browser does not implement window.PublicKeyCredential or navigator.credentials API.',
        origin: typeof window !== 'undefined' ? window.location.origin : '',
        rpId: getRpId(),
        isIframe: isRunningInIframe(),
        timestamp: new Date().toISOString(),
      };
      return {
        success: false,
        error: 'WebAuthn is not supported on this browser or platform.',
        diagnostics: diag,
      };
    }

    // Cryptographically random 32-byte challenge
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // User ID buffer (UUID string encoded to UTF-8 bytes)
    const encoder = new TextEncoder();
    const userIdBuffer = encoder.encode(user.id);

    // Detect browser/device label
    const ua = navigator.userAgent;
    let detectedName = deviceName || 'Biometric Device Key';
    if (!deviceName) {
      if (/iPhone|iPad/.test(ua)) detectedName = 'Face ID / Touch ID (iOS)';
      else if (/Android/.test(ua)) detectedName = 'Android Biometrics';
      else if (/Macintosh/.test(ua)) detectedName = 'Touch ID (Mac)';
      else if (/Windows/.test(ua)) detectedName = 'Windows Hello';
      else detectedName = 'Platform Passkey';
    }

    const currentRpId = getRpId();

    const creationOptions: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: {
          name: 'CryptoLocker',
          id: currentRpId,
        },
        user: {
          id: userIdBuffer,
          name: user.email,
          displayName: user.email.split('@')[0] || 'Vault Keeper',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256 (ECDSA w/ SHA-256) - Android & iOS standard
          { type: 'public-key', alg: -257 }, // RS256 (RSA w/ SHA-256) - Windows Hello standard
          { type: 'public-key', alg: -8 },   // Ed25519 (EdDSA)
          { type: 'public-key', alg: -37 },  // PS256 (RSA-PSS w/ SHA-256)
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required', // Required for authenticating private vault access
          residentKey: 'discouraged',  // Do not require discoverable credentials
        },
        timeout: 60000, // 60s timeout appropriate for Android and desktop
        attestation: 'none',
      },
    };

    const credential = (await navigator.credentials.create(creationOptions)) as PublicKeyCredential | null;

    if (!credential) {
      const diag: WebAuthnDiagnostics = {
        errorName: 'NullCredentialReturned',
        safeReason: 'navigator.credentials.create() returned null without an explicit exception.',
        origin: window.location.origin,
        rpId: currentRpId,
        isIframe: isRunningInIframe(),
        timestamp: new Date().toISOString(),
      };
      return {
        success: false,
        error: 'Biometric passkey creation did not return credentials.',
        diagnostics: diag,
      };
    }

    const credIdBase64 = bufferToBase64Url(credential.rawId);

    // Retrieve transports if provided by the authenticator response
    const attestationResponse = credential.response as AuthenticatorAttestationResponse;
    const transports =
      typeof attestationResponse.getTransports === 'function'
        ? (attestationResponse.getTransports() as string[])
        : undefined;

    const stored: StoredPasskeyCredential = {
      id: credIdBase64,
      rawId: credIdBase64,
      type: credential.type,
      deviceName: detectedName,
      createdAt: new Date().toISOString(),
      userId: user.id,
      transports,
    };

    saveStoredPasskey(user.id, stored);

    return { success: true, credential: stored };
  } catch (err: unknown) {
    const { userMessage, diagnostics } = parseWebAuthnError(err, 'registration');
    return { success: false, error: userMessage, diagnostics };
  }
}

/**
 * Real WebAuthn passkey verification.
 * Requests device biometric / passkey prompt through navigator.credentials.get()
 */
export async function authenticateWithPasskey(
  userId: string
): Promise<{ success: boolean; error?: string; diagnostics?: WebAuthnDiagnostics }> {
  try {
    const supported = isWebAuthnSupported();
    if (!supported) {
      const diag: WebAuthnDiagnostics = {
        errorName: 'WebAuthnNotSupported',
        safeReason: 'WebAuthn is not supported by this browser.',
        origin: typeof window !== 'undefined' ? window.location.origin : '',
        rpId: getRpId(),
        isIframe: isRunningInIframe(),
        timestamp: new Date().toISOString(),
      };
      return { success: false, error: 'WebAuthn is not supported on this browser.', diagnostics: diag };
    }

    const passkeys = getStoredPasskeys(userId);
    if (passkeys.length === 0) {
      const diag: WebAuthnDiagnostics = {
        errorName: 'NoRegisteredCredentials',
        safeReason: `User ${userId.slice(0, 8)}... has zero enrolled passkey credentials on this device.`,
        origin: window.location.origin,
        rpId: getRpId(),
        isIframe: isRunningInIframe(),
        timestamp: new Date().toISOString(),
      };
      return {
        success: false,
        error: 'No biometric credential is registered for this device.',
        diagnostics: diag,
      };
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    // Construct allowCredentials without overly restricting transports
    const allowCredentials: PublicKeyCredentialDescriptor[] = passkeys.map((pk) => {
      const descriptor: PublicKeyCredentialDescriptor = {
        id: base64UrlToBuffer(pk.id),
        type: 'public-key',
      };
      if (pk.transports && pk.transports.length > 0) {
        descriptor.transports = pk.transports as AuthenticatorTransport[];
      }
      return descriptor;
    });

    const currentRpId = getRpId();

    const requestOptions: CredentialRequestOptions = {
      publicKey: {
        challenge,
        rpId: currentRpId,
        allowCredentials,
        userVerification: 'required',
        timeout: 60000, // 60s timeout appropriate for Android prompt
      },
    };

    const assertion = (await navigator.credentials.get(requestOptions)) as PublicKeyCredential | null;

    if (!assertion) {
      const diag: WebAuthnDiagnostics = {
        errorName: 'NullAssertionReturned',
        safeReason: 'navigator.credentials.get() returned null without an exception.',
        origin: window.location.origin,
        rpId: currentRpId,
        isIframe: isRunningInIframe(),
        timestamp: new Date().toISOString(),
      };
      return {
        success: false,
        error: 'Biometric verification did not return credentials.',
        diagnostics: diag,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const { userMessage, diagnostics } = parseWebAuthnError(err, 'authentication');
    return { success: false, error: userMessage, diagnostics };
  }
}

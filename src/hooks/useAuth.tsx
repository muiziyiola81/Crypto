import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isUserAdmin } from '../lib/config';
import {
  authenticateWithPasskey,
  getStoredPasskeys,
  registerDevicePasskey,
  removeAllPasskeys,
  isPlatformAuthenticatorAvailable,
  isWebAuthnSupported,
} from '../lib/webauthn';
import { ActiveScreen, StoredPasskeyCredential, WebAuthnDiagnostics } from '../types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  
  // Vault lock state
  isVaultUnlocked: boolean;
  biometricEnabled: boolean;
  registeredPasskeys: StoredPasskeyCredential[];
  isWebAuthnAvailable: boolean;
  isPlatformBiometricAvailable: boolean;
  lastBiometricDiagnostics: WebAuthnDiagnostics | null;
  
  // Vault lock actions
  lockVault: () => void;
  unlockVaultBiometric: () => Promise<{ success: boolean; error?: string; diagnostics?: WebAuthnDiagnostics }>;
  unlockVaultFallback: () => void;
  enableBiometric: (deviceName?: string) => Promise<{ success: boolean; error?: string; diagnostics?: WebAuthnDiagnostics }>;
  disableBiometric: () => void;
  
  // Auth methods
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;

  // Navigation
  activeScreen: ActiveScreen;
  selectedRecordId: string | null;
  adminSelectedUserId: string | null;
  setAdminSelectedUserId: (uid: string | null) => void;
  navigateTo: (screen: ActiveScreen, recordId?: string | null, targetUserId?: string | null) => void;
  
  // Global message / notification state
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Vault state
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [registeredPasskeys, setRegisteredPasskeys] = useState<StoredPasskeyCredential[]>([]);
  const [isWebAuthnAvailable, setIsWebAuthnAvailable] = useState(false);
  const [isPlatformBiometricAvailable, setIsPlatformBiometricAvailable] = useState(false);
  const [lastBiometricDiagnostics, setLastBiometricDiagnostics] = useState<WebAuthnDiagnostics | null>(null);
  
  // Navigation
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('welcome');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [adminSelectedUserId, setAdminSelectedUserId] = useState<string | null>(null);

  // Global toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Helper to parse route from URL hash or pathname
  const parseRouteFromLocation = (): { screen: ActiveScreen; recordId?: string | null; targetUserId?: string | null } | null => {
    if (typeof window === 'undefined') return null;
    const rawHash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    const rawPath = window.location.pathname.replace(/^\//, '').toLowerCase().trim();
    const target = rawHash || rawPath;

    if (target === 'admin' || target === 'admin/dashboard' || target === 'admin_dashboard' || target === 'admin-dashboard') {
      return { screen: 'admin_dashboard' };
    }
    if (target === 'admin/users' || target === 'admin_users') {
      return { screen: 'admin_users' };
    }
    if (target === 'admin/records' || target === 'admin_records') {
      return { screen: 'admin_records' };
    }
    if (target === 'settings') return { screen: 'settings' };
    if (target === 'profile') return { screen: 'profile' };
    if (target === 'security') return { screen: 'security' };
    if (target === 'records') return { screen: 'records' };
    if (target === 'search') return { screen: 'search' };
    if (target === 'about') return { screen: 'about' };
    if (target === 'add_record' || target === 'add') return { screen: 'add_record' };
    if (target === 'signin') return { screen: 'signin' };
    if (target === 'signup') return { screen: 'signup' };

    return null;
  };

  const syncRouteToUrl = (screen: ActiveScreen) => {
    if (typeof window === 'undefined') return;
    let targetHash = '';
    switch (screen) {
      case 'admin_dashboard':
      case 'admin_activity':
      case 'admin_system':
        targetHash = '#/admin';
        break;
      case 'admin_users':
        targetHash = '#/admin/users';
        break;
      case 'admin_records':
      case 'admin_record_detail':
        targetHash = '#/admin/records';
        break;
      case 'dashboard':
        targetHash = '#/dashboard';
        break;
      case 'records':
        targetHash = '#/records';
        break;
      case 'add_record':
        targetHash = '#/add';
        break;
      case 'search':
        targetHash = '#/search';
        break;
      case 'settings':
        targetHash = '#/settings';
        break;
      case 'profile':
        targetHash = '#/profile';
        break;
      case 'security':
        targetHash = '#/security';
        break;
      case 'about':
        targetHash = '#/about';
        break;
      default:
        break;
    }
    if (targetHash && window.location.hash !== targetHash) {
      try {
        window.history.replaceState(null, '', targetHash);
      } catch {
        // Fallback for restricted contexts
        window.location.hash = targetHash;
      }
    }
  };

  const configured = useMemo(() => isSupabaseConfigured(), []);
  // Verify both active session and user UUID match configured Admin User ID
  const isAdmin = useMemo(() => Boolean(session && user && isUserAdmin(user.id)), [session, user]);

  // Check hardware WebAuthn capabilities on mount
  useEffect(() => {
    async function checkCapabilities() {
      const webAuthn = isWebAuthnSupported();
      setIsWebAuthnAvailable(webAuthn);
      if (webAuthn) {
        const platform = await isPlatformAuthenticatorAvailable();
        setIsPlatformBiometricAvailable(platform);
      }
    }
    checkCapabilities();
  }, []);

  // Update biometric states when user changes
  useEffect(() => {
    if (user) {
      const storedBio = localStorage.getItem(`cryptolocker_biometric_enabled_${user.id}`) ||
                        localStorage.getItem(`bankvault_biometric_enabled_${user.id}`);
      const passkeys = getStoredPasskeys(user.id);
      setRegisteredPasskeys(passkeys);
      setBiometricEnabled(storedBio === 'true' && passkeys.length > 0);
    } else {
      setBiometricEnabled(false);
      setRegisteredPasskeys([]);
      setIsVaultUnlocked(false);
    }
  }, [user]);

  // Initialize Supabase session & listen to auth changes
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        if (!isSupabaseConfigured()) {
          setLoading(false);
          return;
        }

        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session retrieval notice:', error.message);
        }

        if (mounted) {
          const initialRoute = parseRouteFromLocation();

          if (initialSession?.user) {
            setSession(initialSession);
            setUser(initialSession.user);
            const userIsAdmin = isUserAdmin(initialSession.user.id);

            // Require biometric or fallback unlock upon fresh app start if biometric was set
            const hasBio = localStorage.getItem(`cryptolocker_biometric_enabled_${initialSession.user.id}`) === 'true' ||
                           localStorage.getItem(`bankvault_biometric_enabled_${initialSession.user.id}`) === 'true';

            if (hasBio) {
              setIsVaultUnlocked(false);
              setActiveScreen('biometric_unlock');
            } else {
              setIsVaultUnlocked(true);
              if (initialRoute?.screen && initialRoute.screen.startsWith('admin_')) {
                if (userIsAdmin) {
                  setActiveScreen(initialRoute.screen);
                  syncRouteToUrl(initialRoute.screen);
                } else {
                  showToast('Access Denied: Administrator credentials required.');
                  setActiveScreen('dashboard');
                  syncRouteToUrl('dashboard');
                }
              } else if (initialRoute) {
                setActiveScreen(initialRoute.screen);
                syncRouteToUrl(initialRoute.screen);
              } else {
                setActiveScreen('dashboard');
              }
            }
          } else {
            if (initialRoute?.screen === 'signup') {
              setActiveScreen('signup');
            } else if (initialRoute?.screen === 'signin') {
              setActiveScreen('signin');
            } else {
              setActiveScreen('welcome');
            }
          }
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initSession();

    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (!newSession?.user) {
          setIsVaultUnlocked(false);
          setActiveScreen('welcome');
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for hash changes so direct browser URL navigation works seamlessly
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseRouteFromLocation();
      if (route) {
        if (route.screen.startsWith('admin_')) {
          if (user && isUserAdmin(user.id)) {
            setActiveScreen(route.screen);
          } else {
            showToast('Access Denied: Administrator credentials required.');
            setActiveScreen(user ? 'dashboard' : 'welcome');
          }
        } else {
          setActiveScreen(route.screen);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  const navigateTo = (screen: ActiveScreen, recordId: string | null = null, targetUserId: string | null = null) => {
    // Security Guard: Prevent normal users from accessing any admin screens
    if (screen.startsWith('admin_')) {
      if (!user || !isUserAdmin(user.id)) {
        showToast('Access Denied: Administrator credentials required.');
        setActiveScreen('dashboard');
        syncRouteToUrl('dashboard');
        return;
      }
    }

    if (targetUserId !== undefined) {
      setAdminSelectedUserId(targetUserId);
    }
    setSelectedRecordId(recordId);
    setActiveScreen(screen);
    syncRouteToUrl(screen);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const lockVault = () => {
    setIsVaultUnlocked(false);
    showToast('Vault locked. Credentials masked.');
    setActiveScreen('biometric_unlock');
  };

  const unlockVaultBiometric = async (): Promise<{ success: boolean; error?: string; diagnostics?: WebAuthnDiagnostics }> => {
    if (!user) return { success: false, error: 'No active session.' };
    
    const result = await authenticateWithPasskey(user.id);
    setLastBiometricDiagnostics(result.diagnostics || null);

    if (result.success) {
      setIsVaultUnlocked(true);
      showToast('Vault unlocked via biometric verification');
      setActiveScreen('dashboard');
      return { success: true };
    }
    return { success: false, error: result.error, diagnostics: result.diagnostics };
  };

  const unlockVaultFallback = () => {
    setIsVaultUnlocked(true);
    showToast('Vault unlocked via authenticated session fallback');
    setActiveScreen('dashboard');
  };

  const enableBiometric = async (deviceName?: string): Promise<{ success: boolean; error?: string; diagnostics?: WebAuthnDiagnostics }> => {
    if (!user) return { success: false, error: 'User is not logged in.' };
    const res = await registerDevicePasskey({ id: user.id, email: user.email ?? 'user@cryptolocker' }, deviceName);
    setLastBiometricDiagnostics(res.diagnostics || null);

    if (res.success && res.credential) {
      localStorage.setItem(`cryptolocker_biometric_enabled_${user.id}`, 'true');
      setBiometricEnabled(true);
      setRegisteredPasskeys(getStoredPasskeys(user.id));
      showToast('Biometric passkey registered successfully');
      return { success: true };
    }
    return { success: false, error: res.error || 'Failed to register biometric', diagnostics: res.diagnostics };
  };

  const disableBiometric = () => {
    if (user) {
      localStorage.removeItem(`cryptolocker_biometric_enabled_${user.id}`);
      localStorage.removeItem(`bankvault_biometric_enabled_${user.id}`);
      removeAllPasskeys(user.id);
      setBiometricEnabled(false);
      setRegisteredPasskeys([]);
      showToast('Biometric entry disabled');
    }
  };

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured. Please enter project credentials in Settings.' };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsVaultUnlocked(true);
        navigateTo('biometric_setup');
        return { success: true };
      }

      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'An error occurred during registration.' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured. Please enter project credentials in Settings.' };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        const hasBio = localStorage.getItem(`cryptolocker_biometric_enabled_${data.user.id}`) === 'true' ||
                       localStorage.getItem(`bankvault_biometric_enabled_${data.user.id}`) === 'true';
        if (hasBio) {
          setIsVaultUnlocked(false);
          navigateTo('biometric_unlock');
        } else {
          setIsVaultUnlocked(true);
          navigateTo('dashboard');
        }
        return { success: true };
      }

      return { success: false, error: 'Unable to authenticate user.' };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'An error occurred during sign in.' };
    }
  };

  const signOut = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
    } finally {
      setUser(null);
      setSession(null);
      setIsVaultUnlocked(false);
      setAdminSelectedUserId(null);
      navigateTo('welcome');
      showToast('Signed out of CryptoLocker');
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Supabase is not configured.' };
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message || 'Failed to send reset link.' };
    }
  };

  const value = {
    user,
    session,
    loading,
    isConfigured: configured,
    isAdmin,
    isVaultUnlocked,
    biometricEnabled,
    registeredPasskeys,
    isWebAuthnAvailable,
    isPlatformBiometricAvailable,
    lastBiometricDiagnostics,
    lockVault,
    unlockVaultBiometric,
    unlockVaultFallback,
    enableBiometric,
    disableBiometric,
    signUp,
    signIn,
    signOut,
    resetPassword,
    activeScreen,
    selectedRecordId,
    adminSelectedUserId,
    setAdminSelectedUserId,
    navigateTo,
    toastMessage,
    showToast,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

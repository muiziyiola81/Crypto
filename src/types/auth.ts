export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  biometric_enabled: boolean;
  passkey_enrolled_at?: string;
  passkey_device_name?: string;
}

export interface StoredPasskeyCredential {
  id: string; // Base64URL string of credential ID
  rawId: string;
  type: string;
  deviceName: string;
  createdAt: string;
  userId: string;
  transports?: string[];
}

export interface WebAuthnDiagnostics {
  errorName: string;
  safeReason: string;
  origin: string;
  rpId: string;
  isIframe: boolean;
  timestamp: string;
}

export interface AdminUserSummary {
  id: string;
  email: string;
  created_at: string;
  record_count: number;
  last_sign_in?: string;
}

export type ActiveScreen =
  | 'landing'
  | 'welcome'
  | 'signup'
  | 'signin'
  | 'forgot_password'
  | 'biometric_setup'
  | 'biometric_unlock'
  | 'dashboard'
  | 'records'
  | 'add_record'
  | 'edit_record'
  | 'record_details'
  | 'search'
  | 'settings'
  | 'profile'
  | 'security'
  | 'about'
  // Admin System Screens
  | 'admin_dashboard'
  | 'admin_users'
  | 'admin_records'
  | 'admin_record_detail'
  | 'admin_activity'
  | 'admin_system';

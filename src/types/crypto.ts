export type RecordType =
  | 'Wallet'
  | 'Exchange'
  | 'DeFi'
  | 'Trading Account'
  | 'Staking'
  | 'Mining'
  | 'NFT'
  | 'Web3 Account'
  | 'Hardware Wallet'
  | 'Software Wallet'
  | 'Mobile Wallet'
  | 'Browser Wallet'
  | 'Desktop Wallet'
  | 'Custodial Wallet'
  | 'Non-Custodial Wallet'
  | 'Crypto Payment'
  | 'Crypto Card'
  | 'DAO'
  | 'Blockchain Account'
  | 'Other';

export type CryptoNetwork =
  | 'Bitcoin'
  | 'Ethereum'
  | 'Solana'
  | 'BNB Chain'
  | 'Polygon'
  | 'XRP'
  | 'Cardano'
  | 'Avalanche'
  | 'Dogecoin'
  | 'Litecoin'
  | 'Tron'
  | 'Arbitrum'
  | 'Optimism'
  | 'Base'
  | 'Other';

export interface CryptoRecord {
  id: string;
  user_id: string;
  // 14 Required Fields:
  wallet_name: string;
  exchange_or_wallet_provider: string; // "Wallet/Exchange Name"
  record_type: RecordType;
  username_or_email?: string;
  wallet_password?: string;
  pin?: string;
  seed_phrase?: string;
  recovery_codes?: string;
  two_factor_codes?: string;
  private_key?: string;
  wallet_address?: string;
  crypto_network: CryptoNetwork;
  website_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type CryptoRecordInput = Omit<CryptoRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export interface FilterOptions {
  searchQuery: string;
  recordType?: RecordType | 'ALL';
  cryptoNetwork?: CryptoNetwork | 'ALL';
  sortBy: 'created_desc' | 'created_asc' | 'name_asc' | 'name_desc';
}

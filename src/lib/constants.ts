import { RecordType, CryptoNetwork } from '../types/crypto';

export const RECORD_TYPES: RecordType[] = [
  'Wallet',
  'Exchange',
  'DeFi',
  'Trading Account',
  'Staking',
  'Mining',
  'NFT',
  'Web3 Account',
  'Hardware Wallet',
  'Software Wallet',
  'Mobile Wallet',
  'Browser Wallet',
  'Desktop Wallet',
  'Custodial Wallet',
  'Non-Custodial Wallet',
  'Crypto Payment',
  'Crypto Card',
  'DAO',
  'Blockchain Account',
  'Other',
];

export const CRYPTO_NETWORKS: CryptoNetwork[] = [
  'Bitcoin',
  'Ethereum',
  'Solana',
  'BNB Chain',
  'Polygon',
  'XRP',
  'Cardano',
  'Avalanche',
  'Dogecoin',
  'Litecoin',
  'Tron',
  'Arbitrum',
  'Optimism',
  'Base',
  'Other',
];

export function shortenAddress(address?: string, startChars = 6, endChars = 4): string {
  if (!address) return '';
  const trimmed = address.trim();
  if (trimmed.length <= startChars + endChars + 3) return trimmed;
  return `${trimmed.slice(0, startChars)}...${trimmed.slice(-endChars)}`;
}

export function maskSecret(value?: string, maskLength = 10): string {
  if (!value) return '';
  return '•'.repeat(maskLength);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
}

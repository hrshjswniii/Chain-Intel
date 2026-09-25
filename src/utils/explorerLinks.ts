import { BlockchainType } from '../types';

export function getExplorerAddressUrl(chain: BlockchainType | string | undefined, address: string | undefined): string | null {
  if (!address || address === 'Not available') return null;
  const cleanAddr = address.trim();
  const normalizedChain = (chain || 'Ethereum').toString().toLowerCase();

  switch (normalizedChain) {
    case 'ethereum':
      return `https://etherscan.io/address/${cleanAddr}`;
    case 'polygon':
      return `https://polygonscan.com/address/${cleanAddr}`;
    case 'bnb':
    case 'bsc':
      return `https://bscscan.com/address/${cleanAddr}`;
    case 'solana':
      return `https://solscan.io/account/${cleanAddr}`;
    case 'tron':
      return `https://tronscan.org/#/address/${cleanAddr}`;
    case 'bitcoin':
      return `https://mempool.space/address/${cleanAddr}`;
    default:
      return `https://etherscan.io/address/${cleanAddr}`;
  }
}

export function getExplorerTxUrl(chain: BlockchainType | string | undefined, txHash: string | undefined): string | null {
  if (!txHash || txHash === 'Not available') return null;
  const cleanHash = txHash.trim();
  const normalizedChain = (chain || 'Ethereum').toString().toLowerCase();

  switch (normalizedChain) {
    case 'ethereum':
      return `https://etherscan.io/tx/${cleanHash}`;
    case 'polygon':
      return `https://polygonscan.com/tx/${cleanHash}`;
    case 'bnb':
    case 'bsc':
      return `https://bscscan.com/tx/${cleanHash}`;
    case 'solana':
      return `https://solscan.io/tx/${cleanHash}`;
    case 'tron':
      return `https://tronscan.org/#/transaction/${cleanHash}`;
    case 'bitcoin':
      return `https://mempool.space/tx/${cleanHash}`;
    default:
      return `https://etherscan.io/tx/${cleanHash}`;
  }
}

export function getChainExplorerName(chain: BlockchainType | string | undefined): string {
  const normalizedChain = (chain || 'Ethereum').toString().toLowerCase();

  switch (normalizedChain) {
    case 'ethereum':
      return 'Etherscan';
    case 'polygon':
      return 'Polygonscan';
    case 'bnb':
    case 'bsc':
      return 'BscScan';
    case 'solana':
      return 'Solscan';
    case 'tron':
      return 'Tronscan';
    case 'bitcoin':
      return 'Mempool.space';
    default:
      return 'Block Explorer';
  }
}

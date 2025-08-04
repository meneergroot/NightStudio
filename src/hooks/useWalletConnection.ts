import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export const useWalletConnection = () => {
  const { publicKey, connected, connecting, disconnecting } = useWallet();
  
  const walletAddress = useMemo(() => {
    return publicKey?.toBase58() || null;
  }, [publicKey]);

  return {
    walletAddress,
    connected,
    connecting,
    disconnecting,
    publicKey
  };
}; 
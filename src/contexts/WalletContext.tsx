import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connecting: boolean;
  disconnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};

interface WalletContextProviderProps {
  children: React.ReactNode;
}

export const WalletContextProvider: React.FC<WalletContextProviderProps> = ({ children }) => {
  const { connected, publicKey, connecting, disconnecting } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
      console.log('Wallet connected:', publicKey.toBase58());
    } else {
      setWalletAddress(null);
      console.log('Wallet disconnected');
    }
  }, [connected, publicKey]);

  const value: WalletContextType = {
    isConnected: connected,
    walletAddress,
    connecting,
    disconnecting
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 
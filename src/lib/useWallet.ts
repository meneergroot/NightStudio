'use client';

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState, useEffect } from 'react';
import { WalletState } from '../types';

export const useWallet = () => {
  const { publicKey, connected, disconnect, select, wallet } = useSolanaWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<{ sol: number; usdc: number }>({ sol: 0, usdc: 0 });
  const [loading, setLoading] = useState(false);

  // Get SOL balance
  useEffect(() => {
    const getBalance = async () => {
      if (!publicKey || !connected) {
        setBalance({ sol: 0, usdc: 0 });
        return;
      }

      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        
        // For now, we'll set USDC to 0 - in a real app you'd fetch USDC token balance
        setBalance({ sol: solBalance, usdc: 0 });
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance({ sol: 0, usdc: 0 });
      } finally {
        setLoading(false);
      }
    };

    getBalance();
  }, [publicKey, connected, connection]);

  const connectWallet = async () => {
    try {
      setLoading(true);
      // This will trigger the wallet modal
      await select('phantom');
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  const walletState: WalletState = {
    connected,
    address: publicKey?.toString() || null,
    balance
  };

  return {
    wallet: walletState,
    connectWallet,
    disconnectWallet,
    loading,
    publicKey,
    walletAdapter: wallet
  };
}; 
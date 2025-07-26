import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

// USDC mint address on mainnet
const USDC_MAINNET_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

interface WalletBalance {
  sol: number;
  usdc: number;
  loading: boolean;
}

export const useWalletBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<WalletBalance>({
    sol: 0,
    usdc: 0,
    loading: false,
  });

  const fetchBalances = async () => {
    if (!publicKey || !connection) {
      setBalance({ sol: 0, usdc: 0, loading: false });
      return;
    }

    setBalance(prev => ({ ...prev, loading: true }));

    try {
      // Fetch SOL balance
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;

      // Fetch USDC balance
      let usdcAmount = 0;
      try {
        const usdcTokenAccount = await getAssociatedTokenAddress(
          USDC_MAINNET_MINT,
          publicKey
        );
        
        const accountInfo = await getAccount(connection, usdcTokenAccount);
        usdcAmount = Number(accountInfo.amount) / Math.pow(10, 6); // USDC has 6 decimals
      } catch (error) {
        console.log('USDC account not found or error fetching balance:', error);
        // USDC account might not exist, which is normal
      }

      setBalance({
        sol: solAmount,
        usdc: usdcAmount,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
      setBalance({ sol: 0, usdc: 0, loading: false });
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [publicKey, connection]);

  // Utility function to check minimum balances
  const hasMinimumBalance = (): boolean => {
    return balance.sol >= 0.1 && balance.usdc >= 1;
  };

  const checkSufficientBalance = (amount: number, currency: 'SOL' | 'USDC'): boolean => {
    if (currency === 'SOL') {
      return balance.sol >= amount;
    } else {
      return balance.usdc >= amount;
    }
  };

  const refreshBalance = () => {
    fetchBalances();
  };

  return {
    balance,
    hasMinimumBalance,
    checkSufficientBalance,
    refreshBalance,
  };
};
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { connection } from './solana';
import { purchasesApi } from './api';

// USDC mint address (mainnet)
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export interface PaymentResult {
  success: boolean;
  txSignature?: string;
  error?: string;
}

// Payment service
export const paymentService = {
  // Process USDC payment for content unlock
  async processContentPayment(
    buyerWallet: PublicKey,
    sellerWallet: PublicKey,
    amount: number,
    postId: string,
    userId: string
  ): Promise<PaymentResult> {
    try {
      // For now, we'll simulate a payment since USDC transfers require additional setup
      // In a real implementation, you'd use @solana/spl-token for USDC transfers
      
      console.log(`Processing payment: ${amount} USDC from ${buyerWallet.toString()} to ${sellerWallet.toString()}`);
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction signature
      const txSignature = `simulated_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Record the purchase in the database
      const purchaseRecorded = await purchasesApi.recordPurchase({
        user_id: userId,
        post_id: postId,
        tx_signature: txSignature,
        paid_amount: amount,
      });
      
      if (!purchaseRecorded) {
        return {
          success: false,
          error: 'Failed to record purchase in database'
        };
      }
      
      return {
        success: true,
        txSignature
      };
      
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  },

  // Get SOL balance
  async getSolBalance(walletAddress: PublicKey): Promise<number> {
    try {
      const balance = await connection.getBalance(walletAddress);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  },

  // Send SOL (for testing purposes)
  async sendSol(
    fromWallet: PublicKey,
    toWallet: PublicKey,
    amount: number
  ): Promise<PaymentResult> {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet,
          toPubkey: toWallet,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Note: In a real app, you'd get the transaction signed by the user's wallet
      // For now, this is just a placeholder
      console.log(`Would send ${amount} SOL from ${fromWallet.toString()} to ${toWallet.toString()}`);
      
      return {
        success: true,
        txSignature: `sol_tx_${Date.now()}`
      };
      
    } catch (error) {
      console.error('SOL transfer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown SOL transfer error'
      };
    }
  },

  // Validate wallet address
  isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },

  // Format amount for display
  formatAmount(amount: number, currency: 'SOL' | 'USDC' = 'USDC'): string {
    if (currency === 'SOL') {
      return `${amount.toFixed(4)} SOL`;
    }
    return `$${amount.toFixed(2)} USDC`;
  }
}; 
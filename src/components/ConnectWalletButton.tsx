import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className = '' }) => {
  const { connected, disconnect, publicKey } = useWallet();

  // Debug logging
  console.log('Wallet state:', { connected, publicKey: publicKey?.toString() });

  // Force disconnect on component mount to clear any cached state
  useEffect(() => {
    const clearWalletCache = async () => {
      // Clear any cached wallet state
      if (connected && publicKey) {
        console.log('Clearing cached wallet state...');
        await disconnect();
      }
    };
    
    clearWalletCache();
  }, []);

  return (
    <WalletMultiButton 
      className={`!bg-[#1a1a1a] !text-white !border !border-gray-600 hover:!bg-[#512da8] hover:!border-[#00ff9f] hover:!shadow-lg hover:!shadow-[#00ff9f]/25 !px-4 !py-2 !rounded-lg !font-medium !transition-all ${className}`}
    />
  );
};

export default ConnectWalletButton;
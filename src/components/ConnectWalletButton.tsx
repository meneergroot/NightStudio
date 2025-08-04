import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '../contexts/WalletContext';

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className = '' }) => {
  const { connected, publicKey } = useWallet();
  const { isConnected, walletAddress } = useWalletContext();

  // Debug logging
  console.log('Wallet state:', { connected, isConnected, walletAddress, publicKey: publicKey?.toString() });

  return (
    <WalletMultiButton 
      className={`!bg-[#1a1a1a] !text-white !border !border-gray-600 hover:!bg-[#512da8] hover:!border-[#00ff9f] hover:!shadow-lg hover:!shadow-[#00ff9f]/25 !px-4 !py-2 !rounded-lg !font-medium !transition-all ${className}`}
    />
  );
};

export default ConnectWalletButton;
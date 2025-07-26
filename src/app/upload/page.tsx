'use client';

import { useWallet } from '@/lib/useWallet';
import Navbar from '@/components/Navbar';
import Upload from '@/components/Upload';

export default function UploadPage() {
  const { wallet, connectWallet, disconnectWallet, loading } = useWallet();

  const handleWalletConnect = () => {
    if (wallet.connected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <Navbar
        walletConnected={wallet.connected}
        walletAddress={wallet.address}
        onWalletConnect={handleWalletConnect}
        loading={loading}
      />
      <Upload />
    </div>
  );
} 
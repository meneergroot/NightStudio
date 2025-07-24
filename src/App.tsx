import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';
import { WalletState } from './types';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: { sol: 0, usdc: 0 }
  });

  const handleWalletConnect = () => {
    if (wallet.connected) {
      // Disconnect wallet
      setWallet({
        connected: false,
        address: null,
        balance: { sol: 0, usdc: 0 }
      });
    } else {
      // Mock wallet connection - in real app, integrate with Solana wallet adapter
      setWallet({
        connected: true,
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        balance: { sol: 2.5, usdc: 150.75 }
      });
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0E0E10]">
        <Navbar
          walletConnected={wallet.connected}
          walletAddress={wallet.address}
          onWalletConnect={handleWalletConnect}
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
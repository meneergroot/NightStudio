import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletContextProvider } from './lib/wallet';
import { useWallet } from './lib/useWallet';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';

function AppContent() {
  const { wallet, connectWallet, disconnectWallet, loading } = useWallet();

  const handleWalletConnect = () => {
    if (wallet.connected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0E0E10]">
        <Navbar
          walletConnected={wallet.connected}
          walletAddress={wallet.address}
          onWalletConnect={handleWalletConnect}
          loading={loading}
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

function App() {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
}

export default App;
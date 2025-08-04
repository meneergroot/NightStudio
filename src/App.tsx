import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletContextProvider from './components/WalletProvider';
import { WalletContextProvider as CustomWalletContextProvider } from './contexts/WalletContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';

function App() {
  return (
    <WalletContextProvider>
      <CustomWalletContextProvider>
        <Router>
          <div className="min-h-screen bg-[#0E0E10]">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </Router>
      </CustomWalletContextProvider>
    </WalletContextProvider>
  );
}

export default App;
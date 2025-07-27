import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletContextProvider from './components/WalletProvider';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Upload from './components/Upload';
import Profile from './components/Profile';

function App() {
  return (
    <WalletContextProvider>
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
    </WalletContextProvider>
  );
}

export default App;
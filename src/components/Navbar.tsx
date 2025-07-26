import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, User } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#512da8] to-[#00ff9f] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">N</span>
            </div>
            <span className="text-white text-xl font-bold hidden sm:block">NightStudio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/') 
                  ? 'text-[#00ff9f] bg-[#00ff9f]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/upload"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/upload') 
                  ? 'text-[#512da8] bg-[#512da8]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Upload size={20} />
              <span>Upload</span>
            </Link>
            <Link
              to="/profile"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isActive('/profile') 
                  ? 'text-[#00ff9f] bg-[#00ff9f]/10' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
          </div>

          {/* Wallet Connect Button */}
          <ConnectWalletButton />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive('/') 
                    ? 'text-[#00ff9f] bg-[#00ff9f]/10' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <Link
                to="/upload"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive('/upload') 
                    ? 'text-[#512da8] bg-[#512da8]/10' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Upload size={20} />
                <span>Upload</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive('/profile') 
                    ? 'text-[#00ff9f] bg-[#00ff9f]/10' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <User size={20} />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Menu, X, Upload, Home, User, Search } from 'lucide-react';
import { formatSolanaAddress } from '@/lib/solana';

export default function Navigation() {
  const { publicKey } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-solana-dark/95 backdrop-blur-md border-b border-solana-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-solana-gradient rounded-lg flex items-center justify-center">
              <span className="text-solana-dark font-bold text-sm">NS</span>
            </div>
            <span className="text-xl font-bold solana-gradient-text">NightStudio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            {publicKey && (
              <Link 
                href="/upload" 
                className="text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Upload</span>
              </Link>
            )}

            <div className="flex items-center space-x-4">
              <WalletMultiButton className="bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-4 py-2 text-solana-dark font-semibold" />
              
              {publicKey && (
                <Link 
                  href={`/@${formatSolanaAddress(publicKey.toString())}`}
                  className="text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-solana-green transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-solana-gray rounded-lg mt-2">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              
              {publicKey && (
                <Link 
                  href="/upload" 
                  className="block px-3 py-2 text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Upload size={20} />
                  <span>Upload</span>
                </Link>
              )}

              {publicKey && (
                <Link 
                  href={`/@${formatSolanaAddress(publicKey.toString())}`}
                  className="block px-3 py-2 text-gray-300 hover:text-solana-green transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              )}

              <div className="px-3 py-2">
                <WalletMultiButton className="bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-4 py-2 text-solana-dark font-semibold w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 
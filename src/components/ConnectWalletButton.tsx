import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useWalletBalance } from '../hooks/useWalletBalance';

interface ConnectWalletButtonProps {
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className = '' }) => {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { balance, hasMinimumBalance, refreshBalance } = useWalletBalance();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    setVisible(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    setShowDropdown(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (!connected || !publicKey) {
    return (
      <button
        onClick={handleConnect}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-[#1a1a1a] text-white hover:bg-[#512da8] border border-gray-600 hover:border-[#00ff9f] hover:shadow-lg hover:shadow-[#00ff9f]/25 ${className}`}
      >
        <Wallet size={18} />
        <span className="hidden sm:block">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-[#512da8] text-white hover:bg-[#512da8]/80 hover:shadow-lg hover:shadow-[#00ff9f]/25 border border-[#00ff9f] ${className}`}
      >
        <Wallet size={18} />
        <span className="hidden sm:block">
          {formatAddress(publicKey.toString())}
        </span>
        <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Phantom Wallet</p>
                <p className="text-gray-400 text-sm font-mono">
                  {formatAddress(publicKey.toString())}
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-[#00ff9f] transition-colors"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Balances */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-[#512da8] to-[#00ff9f] rounded-full"></div>
                <span className="text-white font-medium">SOL</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {balance.loading ? '...' : balance.sol.toFixed(4)}
                </p>
                <p className="text-gray-400 text-xs">Solana</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-white font-medium">USDC</span>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  {balance.loading ? '...' : balance.usdc.toFixed(2)}
                </p>
                <p className="text-gray-400 text-xs">USD Coin</p>
              </div>
            </div>

            {/* Balance Status */}
            <div className="pt-2 border-t border-gray-700">
              <div className={`flex items-center space-x-2 text-sm ${
                hasMinimumBalance() ? 'text-[#00ff9f]' : 'text-orange-400'
              }`}>
                {hasMinimumBalance() ? (
                  <CheckCircle size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                <span>
                  {hasMinimumBalance() 
                    ? 'Ready for transactions' 
                    : 'Need 0.1 SOL + 1 USDC minimum'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleDisconnect}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ConnectWalletButton;
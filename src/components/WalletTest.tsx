import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import ConnectWalletButton from './ConnectWalletButton';

const WalletTest: React.FC = () => {
  const { publicKey, connected, connecting, disconnect, wallets, select } = useWallet();
  const { balance, hasMinimumBalance, refreshBalance } = useWalletBalance();

  // Debug logging
  console.log('WalletTest - Available wallets:', wallets.map(w => w.adapter.name));
  console.log('WalletTest - Connection state:', { connected, connecting, publicKey: publicKey?.toString() });

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Wallet Connection Test</h2>
      
      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-4">
          <ConnectWalletButton />
          <div className="text-white">
            <p>Status: {connected ? 'Connected' : connecting ? 'Connecting...' : 'Disconnected'}</p>
            {publicKey && (
              <p className="text-gray-400 text-sm">Address: {formatAddress(publicKey.toString())}</p>
            )}
          </div>
        </div>

        {/* Wallet Information */}
        {connected && publicKey && (
          <div className="bg-[#0E0E10] p-4 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-3">Wallet Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">SOL Balance:</span>
                <span className="text-white font-mono">
                  {balance.loading ? 'Loading...' : `${balance.sol.toFixed(4)} SOL`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">USDC Balance:</span>
                <span className="text-white font-mono">
                  {balance.loading ? 'Loading...' : `${balance.usdc.toFixed(2)} USDC`}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ready for transactions:</span>
                <span className={hasMinimumBalance() ? 'text-green-400' : 'text-orange-400'}>
                  {hasMinimumBalance() ? 'Yes' : 'No (Need 0.1 SOL + 1 USDC minimum)'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={refreshBalance}
                className="px-4 py-2 bg-[#512da8] text-white rounded-lg hover:bg-[#512da8]/80 transition-colors"
              >
                Refresh Balance
              </button>
              <button
                onClick={disconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!connected && (
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">How to Connect:</h3>
            <ol className="text-blue-300 text-sm space-y-1">
              <li>1. Click the "Connect Wallet" button above</li>
              <li>2. Select "Phantom" from the wallet list</li>
              <li>3. Approve the connection in your Phantom wallet</li>
              <li>4. Make sure you're connected to Mainnet (not Devnet)</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletTest; 
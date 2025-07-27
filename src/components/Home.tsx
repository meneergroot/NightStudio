import React from 'react';
import PostCard from './PostCard';
import { mockPosts } from '../data/mockData';
import { Sparkles } from 'lucide-react';
import WalletTest from './WalletTest';

const Home: React.FC = () => {
  const handleUnlock = (postId: string) => {
    console.log('Unlocking post:', postId);
    // TODO: Implement actual Solana payment transaction
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="text-[#00ff9f]" size={24} />
            <h1 className="text-2xl font-bold text-white">Premium Feed</h1>
          </div>
          <p className="text-gray-400">Discover exclusive content from your favorite creators</p>
        </div>

        {/* Wallet Test Component */}
        <div className="mb-8">
          <WalletTest />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} onUnlock={handleUnlock} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
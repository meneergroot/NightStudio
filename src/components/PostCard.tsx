'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { Lock, Unlock, Eye, DollarSign, User } from 'lucide-react';
import { formatUSDC } from '@/lib/solana';

interface Post {
  id: string;
  title: string;
  teaser_text: string;
  media_url: string;
  price_usdc: number;
  is_locked: boolean;
  created_at: string;
  users: {
    username: string;
    avatar_url: string | null;
    bio: string | null;
  };
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { publicKey } = useWallet();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Solana payment logic
      console.log('Unlocking post:', post.id, 'Price:', post.price_usdc);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsUnlocked(true);
    } catch (error) {
      console.error('Error unlocking post:', error);
      alert('Failed to unlock content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-solana-gray rounded-lg overflow-hidden border border-solana-light-gray hover:border-solana-green/50 transition-all duration-300">
      {/* Media Section */}
      <div className="relative aspect-video bg-solana-dark">
        {post.media_url ? (
          <Image
            src={post.media_url}
            alt={post.title}
            fill
            className={`object-cover ${!isUnlocked && post.is_locked ? 'blur-sm' : ''}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-solana-dark">
            <Eye className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Lock overlay for locked content */}
        {post.is_locked && !isUnlocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-solana-green mx-auto mb-2" />
              <p className="text-white font-semibold">Premium Content</p>
              <p className="text-gray-300 text-sm">Unlock to view</p>
            </div>
          </div>
        )}
        
        {/* Price badge */}
        {post.is_locked && (
          <div className="absolute top-4 right-4 bg-solana-gradient px-3 py-1 rounded-full">
            <div className="bg-solana-dark px-2 py-1 rounded-full">
              <span className="text-solana-green font-semibold text-sm flex items-center gap-1">
                <DollarSign size={14} />
                {formatUSDC(post.price_usdc)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-solana-gradient p-0.5">
            {post.users.avatar_url ? (
              <Image
                src={post.users.avatar_url}
                alt={post.users.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-solana-dark flex items-center justify-center">
                <User className="w-5 h-5 text-solana-green" />
              </div>
            )}
          </div>
          <div>
            <Link 
              href={`/@${post.users.username}`}
              className="text-solana-green font-semibold hover:underline"
            >
              @{post.users.username}
            </Link>
            <p className="text-gray-400 text-sm">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-xl font-bold text-white mb-3">{post.title}</h3>

        {/* Post Content */}
        <p className="text-gray-300 mb-4 line-clamp-3">
          {isUnlocked ? post.teaser_text : `${post.teaser_text.substring(0, 100)}...`}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {post.is_locked && !isUnlocked ? (
            <button
              onClick={handleUnlock}
              disabled={isLoading}
              className="flex-1 bg-solana-gradient hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 rounded-lg px-4 py-3 text-solana-dark font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-solana-dark border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Unlock size={18} />
                  Unlock Content
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/post/${post.id}`}
              className="flex-1 bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-4 py-3 text-solana-dark font-semibold flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              View Full Post
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Unlock, Eye, DollarSign, User, ArrowLeft, Calendar } from 'lucide-react';
import { formatUSDC } from '@/lib/solana';
import Link from 'next/link';

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

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { publicKey } = useWallet();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_creator_id_fkey (
            username,
            avatar_url,
            bio
          )
        `)
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/');
        return;
      }

      setPost(data);
      
      // Check if user has already purchased this post
      if (publicKey) {
        const { data: purchase } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', publicKey.toString())
          .eq('post_id', params.id)
          .single();

        if (purchase) {
          setIsUnlocked(true);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    if (!post) return;

    setIsUnlocking(true);
    try {
      // TODO: Implement Solana payment logic
      console.log('Unlocking post:', post.id, 'Price:', post.price_usdc);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Record purchase in database
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: publicKey.toString(),
          post_id: post.id,
          tx_signature: 'simulated_transaction_' + Date.now(),
          paid_amount: post.price_usdc,
        });

      if (error) {
        throw error;
      }

      setIsUnlocked(true);
    } catch (error) {
      console.error('Error unlocking post:', error);
      alert('Failed to unlock content. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-solana-dark">
        <Navigation />
        <div className="pt-16 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="bg-solana-gray rounded-lg h-96 mb-6"></div>
              <div className="bg-solana-gray rounded-lg h-8 mb-4"></div>
              <div className="bg-solana-gray rounded-lg h-4 mb-2"></div>
              <div className="bg-solana-gray rounded-lg h-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-solana-dark">
      <Navigation />
      
      <main className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-solana-green hover:text-solana-purple transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Feed
          </Link>

          {/* Post Content */}
          <div className="bg-solana-gray rounded-lg overflow-hidden border border-solana-light-gray">
            {/* Media Section */}
            <div className="relative aspect-video bg-solana-dark">
              {post.media_url ? (
                <>
                  {post.media_url.includes('.mp4') || post.media_url.includes('.webm') ? (
                    <video
                      src={post.media_url}
                      controls
                      className={`w-full h-full object-cover ${!isUnlocked && post.is_locked ? 'blur-sm' : ''}`}
                    />
                  ) : (
                    <img
                      src={post.media_url}
                      alt={post.title}
                      className={`w-full h-full object-cover ${!isUnlocked && post.is_locked ? 'blur-sm' : ''}`}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-solana-dark">
                  <Eye className="w-16 h-16 text-gray-500" />
                </div>
              )}
              
              {/* Lock overlay for locked content */}
              {post.is_locked && !isUnlocked && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-16 h-16 text-solana-green mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Premium Content</h3>
                    <p className="text-gray-300 mb-4">Unlock to view this exclusive content</p>
                    <div className="bg-solana-gradient p-0.5 rounded-lg inline-block">
                      <div className="bg-solana-dark px-4 py-2 rounded-lg">
                        <span className="text-solana-green font-semibold text-lg">
                          {formatUSDC(post.price_usdc)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Creator Info */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-solana-gradient p-0.5">
                  {post.users.avatar_url ? (
                    <img
                      src={post.users.avatar_url}
                      alt={post.users.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-solana-dark flex items-center justify-center">
                      <User className="w-6 h-6 text-solana-green" />
                    </div>
                  )}
                </div>
                <div>
                  <Link 
                    href={`/@${post.users.username}`}
                    className="text-solana-green font-semibold hover:underline text-lg"
                  >
                    @{post.users.username}
                  </Link>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Post Title */}
              <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

              {/* Post Content */}
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {isUnlocked ? post.teaser_text : `${post.teaser_text.substring(0, 200)}...`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {post.is_locked && !isUnlocked ? (
                  <button
                    onClick={handleUnlock}
                    disabled={isUnlocking}
                    className="flex-1 bg-solana-gradient hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 rounded-lg px-6 py-4 text-solana-dark font-semibold text-lg flex items-center justify-center gap-3"
                  >
                    {isUnlocking ? (
                      <>
                        <div className="w-5 h-5 border-2 border-solana-dark border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Unlock size={20} />
                        Unlock Content - {formatUSDC(post.price_usdc)}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="flex-1 bg-solana-green/10 border border-solana-green/30 rounded-lg px-6 py-4 flex items-center justify-center gap-3">
                    <Unlock size={20} className="text-solana-green" />
                    <span className="text-solana-green font-semibold">Content Unlocked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
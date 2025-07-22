import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import { supabase } from '@/lib/supabase';

async function getPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_creator_id_fkey (
          username,
          avatar_url,
          bio
        )
      `)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }

    return posts || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-solana-dark">
      <Navigation />
      
      <main className="pt-16 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="solana-gradient-text">NightStudio</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover and unlock exclusive content from creators using Solana payments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-solana-gradient p-0.5 rounded-lg">
                <div className="bg-solana-dark rounded-lg px-6 py-3">
                  <span className="text-solana-green font-semibold">Connect Wallet to Start</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Latest Content</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-solana-gray rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
                  <p className="text-gray-400 mb-4">Be the first to upload content and start earning!</p>
                  <div className="bg-solana-gradient p-0.5 rounded-lg inline-block">
                    <div className="bg-solana-dark rounded-lg px-6 py-3">
                      <span className="text-solana-green font-semibold">Upload Content</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

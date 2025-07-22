import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import { supabase } from '@/lib/supabase';
import { User, Users, DollarSign, Calendar } from 'lucide-react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

async function getProfile(username: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

async function getProfilePosts(creatorId: string) {
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
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

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

async function getFollowerCount(userId: string) {
  try {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('followed_id', userId);

    if (error) {
      console.error('Error fetching follower count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching follower count:', error);
    return 0;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfile(params.username);
  
  if (!profile) {
    notFound();
  }

  const [posts, followerCount] = await Promise.all([
    getProfilePosts(profile.id),
    getFollowerCount(profile.id)
  ]);

  return (
    <div className="min-h-screen bg-solana-dark">
      <Navigation />
      
      <main className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-solana-gray rounded-lg p-6 mb-8 border border-solana-light-gray">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-solana-gradient p-1">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-solana-dark flex items-center justify-center">
                    <User className="w-12 h-12 text-solana-green" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  @{profile.username}
                </h1>
                {profile.bio && (
                  <p className="text-gray-300 mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users size={18} />
                    <span className="font-semibold">{followerCount}</span>
                    <span>followers</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign size={18} />
                    <span className="font-semibold">{posts.length}</span>
                    <span>posts</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={18} />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Follow Button */}
              <button className="bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-6 py-3 text-solana-dark font-semibold">
                Follow
              </button>
            </div>
          </div>

          {/* Posts Grid */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
            
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-solana-gray rounded-lg p-8">
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-gray-400">
                    @{profile.username} hasn't uploaded any content yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
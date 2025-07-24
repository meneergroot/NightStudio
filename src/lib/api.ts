import { supabase } from './supabase';
import type { Database } from './supabase';

type User = Database['public']['Tables']['users']['Row'];
type Post = Database['public']['Tables']['posts']['Row'];
type PostWithUser = Post & {
  users: {
    username: string;
    avatar_url: string | null;
    bio: string | null;
  };
};

// User API functions
export const userApi = {
  // Get user by wallet address
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  },

  // Create or update user
  async upsertUser(userData: {
    wallet_address: string;
    username: string;
    avatar_url?: string;
    bio?: string;
  }): Promise<User | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'wallet_address' })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting user:', error);
      return null;
    }
    
    return data;
  },

  // Get follower count
  async getFollowerCount(userId: string): Promise<number> {
    if (!supabase) return 0;
    
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('followed_id', userId);
    
    if (error) {
      console.error('Error fetching follower count:', error);
      return 0;
    }
    
    return count || 0;
  }
};

// Posts API functions
export const postsApi = {
  // Get all posts with creator info
  async getPosts(limit = 20): Promise<PostWithUser[]> {
    if (!supabase) return [];
    
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
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    
    return data || [];
  },

  // Get posts by creator
  async getPostsByCreator(creatorId: string): Promise<PostWithUser[]> {
    if (!supabase) return [];
    
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
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching creator posts:', error);
      return [];
    }
    
    return data || [];
  },

  // Get single post by ID
  async getPostById(postId: string): Promise<PostWithUser | null> {
    if (!supabase) return null;
    
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
      .eq('id', postId)
      .single();
    
    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }
    
    return data;
  },

  // Create new post
  async createPost(postData: {
    creator_id: string;
    title: string;
    teaser_text: string;
    media_url: string;
    price_usdc: number;
    is_locked: boolean;
  }): Promise<Post | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      return null;
    }
    
    return data;
  }
};

// Purchases API functions
export const purchasesApi = {
  // Check if user has purchased a post
  async hasUserPurchased(userId: string, postId: string): Promise<boolean> {
    if (!supabase) return false;
    
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  },

  // Record a purchase
  async recordPurchase(purchaseData: {
    user_id: string;
    post_id: string;
    tx_signature: string;
    paid_amount: number;
  }): Promise<boolean> {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('purchases')
      .insert(purchaseData);
    
    if (error) {
      console.error('Error recording purchase:', error);
      return false;
    }
    
    return true;
  }
};

// Storage API functions
export const storageApi = {
  // Upload file to Supabase Storage
  async uploadFile(
    file: File,
    path: string
  ): Promise<{ url: string; error: string | null }> {
    if (!supabase) {
      return { url: '', error: 'Supabase not initialized' };
    }
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(path, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      return { url: '', error: error.message };
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(path);
    
    return { url: publicUrl, error: null };
  },

  // Delete file from Supabase Storage
  async deleteFile(path: string): Promise<boolean> {
    if (!supabase) return false;
    
    const { error } = await supabase.storage
      .from('media')
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  }
}; 
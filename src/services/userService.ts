import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export class UserService {
  // Get user by wallet address
  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    try {
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
    } catch (error) {
      console.error('Error in getUserByWallet:', error);
      return null;
    }
  }

  // Create new user
  static async createUser(userData: UserInsert): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createUser:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUser(userId: string, updates: UserUpdate): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  }

  // Upload file to Supabase Storage
  static async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<string | null> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return null;
    }
  }

  // Delete file from Supabase Storage
  static async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return false;
    }
  }

  // Get user's posts
  static async getUserPosts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:users!posts_creator_id_fkey(*)
        `)
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserPosts:', error);
      return [];
    }
  }

  // Follow a user
  static async followUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({
          follower_id: followerId,
          following_id: followingId
        });

      if (error) {
        console.error('Error following user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in followUser:', error);
      return false;
    }
  }

  // Unfollow a user
  static async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in unfollowUser:', error);
      return false;
    }
  }

  // Check if user is following another user
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking follow status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isFollowing:', error);
      return false;
    }
  }
} 
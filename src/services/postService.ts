import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';

// USDC mint address on mainnet
const USDC_MAINNET_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

type Post = Database['public']['Tables']['posts']['Row'];
type PostInsert = Database['public']['Tables']['posts']['Insert'];
type PostUpdate = Database['public']['Tables']['posts']['Update'];

export class PostService {
  // Create a new post
  static async createPost(postData: PostInsert): Promise<Post | null> {
    try {
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
    } catch (error) {
      console.error('Error in createPost:', error);
      return null;
    }
  }

  // Get all posts with creator information
  static async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:users!posts_creator_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return [];
    }
  }

  // Get post by ID
  static async getPostById(postId: string) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          creator:users!posts_creator_id_fkey(*)
        `)
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPostById:', error);
      return null;
    }
  }

  // Update post
  static async updatePost(postId: string, updates: PostUpdate): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        console.error('Error updating post:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updatePost:', error);
      return null;
    }
  }

  // Delete post
  static async deletePost(postId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      return false;
    }
  }

  // Like a post
  static async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike the post
        const { error: unlikeError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (unlikeError) {
          console.error('Error unliking post:', unlikeError);
          return false;
        }

        // Decrease likes count
        await this.updatePostLikesCount(postId, -1);
        return true;
      } else {
        // Like the post
        const { error: likeError } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: userId
          });

        if (likeError) {
          console.error('Error liking post:', likeError);
          return false;
        }

        // Increase likes count
        await this.updatePostLikesCount(postId, 1);
        return true;
      }
    } catch (error) {
      console.error('Error in likePost:', error);
      return false;
    }
  }

  // Update post likes count
  private static async updatePostLikesCount(postId: string, increment: number): Promise<void> {
    try {
      const { error } = await supabase.rpc('increment_post_likes', {
        post_id: postId,
        increment_amount: increment
      });

      if (error) {
        console.error('Error updating post likes count:', error);
      }
    } catch (error) {
      console.error('Error in updatePostLikesCount:', error);
    }
  }

  // Check if user has liked a post
  static async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking like status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasUserLikedPost:', error);
      return false;
    }
  }

  // Process payment for unlocking a post
  static async processPayment(
    connection: Connection,
    buyerPublicKey: PublicKey,
    sellerPublicKey: PublicKey,
    amount: number,
    currency: 'SOL' | 'USDC'
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      const transaction = new Transaction();

      if (currency === 'SOL') {
        // Transfer SOL
        const transferInstruction = SystemProgram.transfer({
          fromPubkey: buyerPublicKey,
          toPubkey: sellerPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        });
        transaction.add(transferInstruction);
      } else if (currency === 'USDC') {
        // Transfer USDC
        const buyerTokenAccount = await getAssociatedTokenAddress(
          USDC_MAINNET_MINT,
          buyerPublicKey
        );
        
        const sellerTokenAccount = await getAssociatedTokenAddress(
          USDC_MAINNET_MINT,
          sellerPublicKey
        );

        const transferInstruction = createTransferInstruction(
          buyerTokenAccount,
          sellerTokenAccount,
          buyerPublicKey,
          amount * Math.pow(10, 6) // USDC has 6 decimals
        );
        transaction.add(transferInstruction);
      }

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyerPublicKey;

      return { success: true };
    } catch (error) {
      console.error('Error in processPayment:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Unlock a post (after payment)
  static async unlockPost(postId: string): Promise<boolean> {
    try {
      // This would typically be called after successful payment
      // For now, we'll just mark the post as unlocked for the user
      // In a real implementation, you might have a separate table for user_post_access
      
      const { error } = await supabase
        .from('posts')
        .update({ is_unlocked: true })
        .eq('id', postId);

      if (error) {
        console.error('Error unlocking post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in unlockPost:', error);
      return false;
    }
  }
} 
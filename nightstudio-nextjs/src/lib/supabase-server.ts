import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database types (same as client-side)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          teaser_text: string;
          media_url: string;
          price_usdc: number;
          is_locked: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          teaser_text: string;
          media_url: string;
          price_usdc: number;
          is_locked?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          teaser_text?: string;
          media_url?: string;
          price_usdc?: number;
          is_locked?: boolean;
          created_at?: string;
        };
      };
      followers: {
        Row: {
          id: string;
          follower_id: string;
          followed_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          followed_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          followed_id?: string;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          tx_signature: string;
          paid_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          tx_signature: string;
          paid_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          tx_signature?: string;
          paid_amount?: number;
          created_at?: string;
        };
      };
    };
  };
} 
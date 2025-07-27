import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://opzddwxdrdqrxfkdhixa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wemRkd3hkcmRxcnhma2RoaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mjk3NzUsImV4cCI6MjA2OTEwNTc3NX0.er-wrgIl_v-hcFhJlhlFdtHx3V4ZfxLU09ld4PF2nQU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          wallet_address: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          cover_photo_url: string | null;
          bio: string | null;
          followers_count: number;
          following_count: number;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          cover_photo_url?: string | null;
          bio?: string | null;
          followers_count?: number;
          following_count?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          cover_photo_url?: string | null;
          bio?: string | null;
          followers_count?: number;
          following_count?: number;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          creator_id: string;
          content: string;
          image_url: string | null;
          price: number;
          currency: 'USDC' | 'SOL';
          is_unlocked: boolean;
          likes_count: number;
          comments_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          content: string;
          image_url?: string | null;
          price: number;
          currency: 'USDC' | 'SOL';
          is_unlocked?: boolean;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          content?: string;
          image_url?: string | null;
          price?: number;
          currency?: 'USDC' | 'SOL';
          is_unlocked?: boolean;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      post_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
} 
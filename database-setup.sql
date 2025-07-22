-- NightStudio Database Setup Script
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  teaser_text TEXT NOT NULL,
  media_url TEXT NOT NULL,
  price_usdc DECIMAL(10,2) DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Followers table
CREATE TABLE IF NOT EXISTS followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  followed_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, followed_id)
);

-- Purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tx_signature TEXT NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_creator_id ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_followed_id ON followers(followed_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_post_id ON purchases(post_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (wallet_address = current_user);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (wallet_address = current_user);

-- RLS Policies for posts table
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (creator_id = current_user);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (creator_id = current_user);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (creator_id = current_user);

-- RLS Policies for followers table
CREATE POLICY "Followers are viewable by everyone" ON followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow others" ON followers
  FOR INSERT WITH CHECK (follower_id = current_user);

CREATE POLICY "Users can unfollow others" ON followers
  FOR DELETE USING (follower_id = current_user);

-- RLS Policies for purchases table
CREATE POLICY "Users can view their own purchases" ON purchases
  FOR SELECT USING (user_id = current_user);

CREATE POLICY "Users can create purchases" ON purchases
  FOR INSERT WITH CHECK (user_id = current_user);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own uploads" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for common operations

-- Function to get user by wallet address
CREATE OR REPLACE FUNCTION get_user_by_wallet(wallet TEXT)
RETURNS TABLE (
  id UUID,
  wallet_address TEXT,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.wallet_address, u.username, u.avatar_url, u.bio, u.created_at
  FROM users u
  WHERE u.wallet_address = wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get posts with creator info
CREATE OR REPLACE FUNCTION get_posts_with_creator(limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  creator_id TEXT,
  title TEXT,
  teaser_text TEXT,
  media_url TEXT,
  price_usdc DECIMAL(10,2),
  is_locked BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  creator_username TEXT,
  creator_avatar_url TEXT,
  creator_bio TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.creator_id,
    p.title,
    p.teaser_text,
    p.media_url,
    p.price_usdc,
    p.is_locked,
    p.created_at,
    u.username,
    u.avatar_url,
    u.bio
  FROM posts p
  JOIN users u ON p.creator_id = u.wallet_address
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has purchased a post
CREATE OR REPLACE FUNCTION has_user_purchased_post(user_wallet TEXT, post_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchases 
    WHERE user_id = user_wallet AND post_id = post_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing
INSERT INTO users (wallet_address, username, bio) VALUES
  ('11111111111111111111111111111111', 'solana_creator', 'Building the future of content creation on Solana'),
  ('22222222222222222222222222222222', 'crypto_artist', 'Digital artist exploring the intersection of art and blockchain')
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (creator_id, title, teaser_text, media_url, price_usdc, is_locked) VALUES
  ('11111111111111111111111111111111', 'My First NFT Collection', 'Exploring the world of digital art and blockchain technology...', 'https://example.com/sample-image.jpg', 5.00, true),
  ('22222222222222222222222222222222', 'Crypto Art Tutorial', 'Learn how to create and sell your digital artwork...', 'https://example.com/tutorial-video.mp4', 10.00, true),
  ('11111111111111111111111111111111', 'Free Content Sample', 'Here is some free content to get you started...', 'https://example.com/free-content.jpg', 0.00, false)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 
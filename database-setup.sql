-- NightStudio Database Setup
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  title TEXT NOT NULL,
  teaser_text TEXT NOT NULL,
  media_url TEXT NOT NULL,
  price_usdc DECIMAL(10,2) DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create followers table
CREATE TABLE IF NOT EXISTS followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  followed_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, followed_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(wallet_address) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tx_signature TEXT NOT NULL,
  paid_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_creator_id ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_followed_id ON followers(followed_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_post_id ON purchases(post_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = wallet_address);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = wallet_address);

-- RLS Policies for posts table
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own posts" ON posts
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = creator_id);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.jwt() ->> 'wallet_address' = creator_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.jwt() ->> 'wallet_address' = creator_id);

-- RLS Policies for followers table
CREATE POLICY "Followers are viewable by everyone" ON followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow/unfollow" ON followers
  FOR ALL USING (auth.jwt() ->> 'wallet_address' = follower_id);

-- RLS Policies for purchases table
CREATE POLICY "Users can view their own purchases" ON purchases
  FOR SELECT USING (auth.jwt() ->> 'wallet_address' = user_id);

CREATE POLICY "Users can record their own purchases" ON purchases
  FOR INSERT WITH CHECK (auth.jwt() ->> 'wallet_address' = user_id);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Media files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Users can upload their own media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND auth.jwt() ->> 'wallet_address' IS NOT NULL
  );

CREATE POLICY "Users can update their own media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' 
    AND auth.jwt() ->> 'wallet_address' IS NOT NULL
  );

CREATE POLICY "Users can delete their own media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' 
    AND auth.jwt() ->> 'wallet_address' IS NOT NULL
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
INSERT INTO users (wallet_address, username, bio) VALUES
  ('11111111111111111111111111111111', 'alice_creator', 'Digital artist and content creator'),
  ('22222222222222222222222222222222', 'bob_creator', 'Photographer and storyteller'),
  ('33333333333333333333333333333333', 'charlie_creator', 'Video producer and filmmaker')
ON CONFLICT (wallet_address) DO NOTHING;

INSERT INTO posts (creator_id, title, teaser_text, media_url, price_usdc, is_locked) VALUES
  ('11111111111111111111111111111111', 'Sunset Photography', 'Beautiful sunset captured at the beach', 'https://example.com/sunset.jpg', 5.00, true),
  ('22222222222222222222222222222222', 'City Life', 'Urban photography from downtown', 'https://example.com/city.jpg', 0.00, false),
  ('33333333333333333333333333333333', 'Mountain Adventure', 'Epic mountain climbing video', 'https://example.com/mountain.mp4', 10.00, true)
ON CONFLICT DO NOTHING; 
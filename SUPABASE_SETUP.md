# Supabase Database Setup for NightStudio

This guide will help you set up the Supabase database schema for the NightStudio application.

## Database Schema

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  cover_photo_url TEXT,
  bio TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for wallet address lookups
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
```

### 2. Posts Table

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT CHECK (currency IN ('SOL', 'USDC')) NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_creator_id ON posts(creator_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### 3. User Follows Table

```sql
CREATE TABLE user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create indexes
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);
```

### 4. Post Likes Table

```sql
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

## Functions

### 1. Update Updated At Trigger

```sql
-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Increment Post Likes Function

```sql
-- Function to increment post likes count
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID, increment_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE posts 
  SET likes_count = likes_count + increment_amount
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. Update Follow Counts Function

```sql
-- Function to update follow counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment following count for follower
    UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    -- Increment followers count for following
    UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement following count for follower
    UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    -- Decrement followers count for following
    UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for follow counts
CREATE TRIGGER update_follow_counts_trigger
  AFTER INSERT OR DELETE ON user_follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts();
```

## Storage Buckets

Create the following storage buckets in Supabase:

### 1. Avatars Bucket
- Name: `avatars`
- Public: `true`
- File size limit: `5MB`
- Allowed MIME types: `image/*`

### 2. Cover Photos Bucket
- Name: `cover-photos`
- Public: `true`
- File size limit: `10MB`
- Allowed MIME types: `image/*`

### 3. Post Images Bucket
- Name: `post-images`
- Public: `true`
- File size limit: `20MB`
- Allowed MIME types: `image/*`

## Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

### Users Table Policies

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = wallet_address);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = wallet_address);
```

### Posts Table Policies

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Allow creators to insert posts
CREATE POLICY "Creators can insert posts" ON posts
  FOR INSERT WITH CHECK (
    creator_id IN (
      SELECT id FROM users WHERE wallet_address = auth.uid()::text
    )
  );

-- Allow creators to update their posts
CREATE POLICY "Creators can update own posts" ON posts
  FOR UPDATE USING (
    creator_id IN (
      SELECT id FROM users WHERE wallet_address = auth.uid()::text
    )
  );

-- Allow creators to delete their posts
CREATE POLICY "Creators can delete own posts" ON posts
  FOR DELETE USING (
    creator_id IN (
      SELECT id FROM users WHERE wallet_address = auth.uid()::text
    )
  );
```

### User Follows Table Policies

```sql
-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Follows are viewable by everyone" ON user_follows
  FOR SELECT USING (true);

-- Allow users to follow/unfollow
CREATE POLICY "Users can manage follows" ON user_follows
  FOR ALL USING (
    follower_id IN (
      SELECT id FROM users WHERE wallet_address = auth.uid()::text
    )
  );
```

### Post Likes Table Policies

```sql
-- Enable RLS
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Likes are viewable by everyone" ON post_likes
  FOR SELECT USING (true);

-- Allow users to like/unlike posts
CREATE POLICY "Users can manage likes" ON post_likes
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE wallet_address = auth.uid()::text
    )
  );
```

## Environment Variables

Make sure to set these environment variables in your Vercel deployment:

```
VITE_SUPABASE_URL=https://opzddwxdrdqrxfkdhixa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wemRkd3hkcmRxcnhma2RoaXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mjk3NzUsImV4cCI6MjA2OTEwNTc3NX0.er-wrgIl_v-hcFhJlhlFdtHx3V4ZfxLU09ld4PF2nQU
```

## Testing the Setup

After setting up the database, you can test the connection by running:

```bash
npm run dev
```

The application should now be able to:
- Connect to Supabase
- Create and manage user profiles
- Upload files to storage buckets
- Create and manage posts
- Handle user follows and post likes
- Process Solana payments (SOL and USDC) 
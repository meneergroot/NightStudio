# NightStudio Backend Setup Guide

## 🚀 Quick Start

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Solana Configuration
VITE_SOLANA_NETWORK=mainnet-beta
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 2. Supabase Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Set up the Database**:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `database-setup.sql`
   - Run the SQL script

3. **Configure Storage**:
   - Go to Storage in your Supabase dashboard
   - The `media` bucket should be created automatically
   - Make sure it's set to public

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. Backend Features Added

✅ **Database Integration**:
- User profiles with wallet addresses
- Posts with content locking
- Purchase tracking
- Follower system

✅ **File Storage**:
- Supabase Storage for media files
- Public access to uploaded content
- Secure upload permissions

✅ **Payment System**:
- USDC payment processing (simulated)
- Transaction recording
- Purchase verification

✅ **API Services**:
- User management (`userApi`)
- Post management (`postsApi`)
- Purchase tracking (`purchasesApi`)
- File storage (`storageApi`)

### 5. Usage Examples

#### Fetching Posts
```typescript
import { postsApi } from './lib/api';

// Get all posts
const posts = await postsApi.getPosts();

// Get posts by creator
const creatorPosts = await postsApi.getPostsByCreator(walletAddress);
```

#### User Management
```typescript
import { userApi } from './lib/api';

// Get user by wallet
const user = await userApi.getUserByWallet(walletAddress);

// Create/update user
const newUser = await userApi.upsertUser({
  wallet_address: walletAddress,
  username: 'my_username',
  bio: 'My bio'
});
```

#### File Upload
```typescript
import { storageApi } from './lib/api';

const file = event.target.files[0];
const path = `uploads/${walletAddress}/${Date.now()}_${file.name}`;

const { url, error } = await storageApi.uploadFile(file, path);
```

#### Payment Processing
```typescript
import { paymentService } from './lib/payments';

const result = await paymentService.processContentPayment(
  buyerWallet,
  sellerWallet,
  amount,
  postId,
  userId
);
```

### 6. Database Schema

#### Users Table
- `id`: UUID primary key
- `wallet_address`: Unique Solana wallet address
- `username`: Unique username
- `avatar_url`: Optional profile image
- `bio`: Optional user bio
- `created_at`, `updated_at`: Timestamps

#### Posts Table
- `id`: UUID primary key
- `creator_id`: References user wallet address
- `title`: Post title
- `teaser_text`: Preview text
- `media_url`: File URL
- `price_usdc`: Price in USDC
- `is_locked`: Whether content is locked
- `created_at`, `updated_at`: Timestamps

#### Purchases Table
- `id`: UUID primary key
- `user_id`: Buyer wallet address
- `post_id`: References post ID
- `tx_signature`: Transaction signature
- `paid_amount`: Amount paid in USDC
- `created_at`: Timestamp

#### Followers Table
- `id`: UUID primary key
- `follower_id`: Follower wallet address
- `followed_id`: Followed user wallet address
- `created_at`: Timestamp

### 7. Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **JWT-based authentication** with wallet addresses
✅ **Secure file uploads** with user permissions
✅ **Purchase verification** to prevent duplicate purchases

### 8. Next Steps

1. **Connect your components** to the API services
2. **Add wallet connection** to your existing UI
3. **Test the payment flow** with real USDC transactions
4. **Deploy to production** with your Supabase credentials

### 9. Production Considerations

- Use a custom RPC endpoint for better performance
- Set up proper error handling and loading states
- Implement real USDC transfers using SPL tokens
- Add rate limiting and abuse prevention
- Set up monitoring and analytics

---

**Note**: The frontend layout and styling remain untouched as requested. Only backend functionality has been added. 
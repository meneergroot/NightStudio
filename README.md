# NightStudio - Premium Content Sharing Platform

A modern, decentralized content sharing platform built with Next.js, Solana blockchain integration, and Supabase backend.

## 🚀 Features

- **Real Phantom Wallet Integration** - Connect your Solana wallet securely
- **Premium Content System** - Lock/unlock content with USDC payments
- **Creator Profiles** - Verified creator accounts with follower system
- **Modern UI/UX** - Beautiful dark theme with neon accents
- **PWA Ready** - Progressive Web App capabilities
- **Real-time Updates** - Live content feeds and notifications

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Blockchain**: Solana (Phantom Wallet)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nightstudio-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Solana Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL script in `database-setup.sql` in your Supabase SQL editor
3. Configure storage buckets for media uploads

## 🔗 Deployment

The project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🎨 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with wallet provider
│   ├── page.tsx           # Home page
│   ├── upload/page.tsx    # Upload page
│   └── profile/page.tsx   # Profile page
├── components/            # React components
│   ├── Navbar.tsx        # Navigation with wallet connection
│   ├── Home.tsx          # Home feed component
│   ├── Upload.tsx        # Content upload component
│   ├── Profile.tsx       # User profile component
│   └── PostCard.tsx      # Individual post component
├── lib/                  # Utilities and configurations
│   ├── wallet.tsx        # Wallet context provider
│   ├── useWallet.ts      # Wallet hook
│   ├── supabase.ts       # Supabase client
│   ├── solana.ts         # Solana configuration
│   └── payments.ts       # Payment processing
├── types/                # TypeScript type definitions
│   └── index.ts          # User, Post, Wallet types
└── data/                 # Mock data and constants
    └── mockData.ts       # Sample posts and users
```

## 🔐 Wallet Integration

The platform uses the Solana Wallet Adapter for secure wallet connections:

- **Phantom Wallet** - Primary wallet support
- **Auto-connect** - Remembers user's wallet preference
- **Balance Display** - Shows SOL and USDC balances
- **Transaction Signing** - Secure payment processing

## 💰 Payment System

- **USDC Payments** - Stable coin for content purchases
- **SOL Transactions** - Native Solana token support
- **Purchase Tracking** - Database records of all transactions
- **Creator Revenue** - Direct payments to content creators

## 🎯 Key Features

### For Users
- Browse premium content feed
- Connect Phantom wallet securely
- Purchase locked content with USDC
- Follow favorite creators
- View transaction history

### For Creators
- Upload premium content
- Set pricing in USDC
- Track earnings and analytics
- Manage profile and bio
- Engage with followers

## 🚀 Getting Started

1. **Install Phantom Wallet** - Download from [phantom.app](https://phantom.app)
2. **Add SOL/USDC** - Fund your wallet for purchases
3. **Connect Wallet** - Click "Connect Wallet" in the navbar
4. **Browse Content** - Explore the premium feed
5. **Purchase Content** - Unlock exclusive posts with USDC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**NightStudio** - Where creators meet blockchain technology 🚀

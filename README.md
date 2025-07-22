# NightStudio 🌙

A Solana-powered Progressive Web App (PWA) platform for content creators to monetize their content with cryptocurrency payments.

![NightStudio](https://img.shields.io/badge/NightStudio-Solana%20Powered-green?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🎨 Solana Branding**: Beautiful dark theme with Solana's signature green and purple gradients
- **📱 PWA Ready**: Installable mobile app experience with offline capabilities
- **💳 Wallet Integration**: Connect Phantom wallet for seamless payments
- **🔒 Premium Content**: Lock/unlock content with USDC payments
- **👥 Creator Profiles**: Follow creators and view their content
- **📤 Content Upload**: Easy media upload with drag & drop support
- **🎯 Responsive Design**: Optimized for desktop, tablet, and mobile
- **⚡ Real-time Updates**: Live content feed and notifications

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Blockchain**: Solana Web3.js, Phantom Wallet
- **Payments**: Solana Pay, USDC transfers
- **Hosting**: Vercel (with PWA support)
- **UI**: Lucide React icons, Framer Motion

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Phantom wallet (for testing)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NightStudio.git
   cd NightStudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # Solana Configuration
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_NAME=NightStudio
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase project:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     wallet_address TEXT UNIQUE NOT NULL,
     username TEXT UNIQUE NOT NULL,
     avatar_url TEXT,
     bio TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Posts table
   CREATE TABLE posts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     creator_id TEXT NOT NULL REFERENCES users(wallet_address),
     title TEXT NOT NULL,
     teaser_text TEXT NOT NULL,
     media_url TEXT NOT NULL,
     price_usdc DECIMAL(10,2) DEFAULT 0,
     is_locked BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Followers table
   CREATE TABLE followers (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     follower_id TEXT NOT NULL REFERENCES users(wallet_address),
     followed_id TEXT NOT NULL REFERENCES users(wallet_address),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(follower_id, followed_id)
   );

   -- Purchases table
   CREATE TABLE purchases (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id TEXT NOT NULL REFERENCES users(wallet_address),
     post_id UUID NOT NULL REFERENCES posts(id),
     tx_signature TEXT NOT NULL,
     paid_amount DECIMAL(10,2) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Set up Supabase Storage**
   
   Create a storage bucket named `media` with the following policy:
   ```sql
   CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
   CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Basic offline functionality
- **App-like Experience**: Full-screen mode and native feel
- **Push Notifications**: (Coming soon)

## 🔗 API Routes

- `GET /` - Home feed with latest posts
- `GET /@[username]` - Creator profile page
- `GET /post/[id]` - Individual post detail page
- `GET /upload` - Content upload page (wallet required)

## 🎨 Customization

### Colors
The app uses Solana's brand colors defined in `tailwind.config.ts`:
- `solana-green`: #00FFA3
- `solana-purple`: #DC1FFF
- `solana-dark`: #0E0E10

### Styling
- Global styles in `src/app/globals.css`
- Component-specific styles using Tailwind classes
- Custom CSS variables for consistent theming

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── @[username]/     # Dynamic profile routes
│   ├── post/[id]/       # Dynamic post routes
│   ├── upload/          # Upload page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── Navigation.tsx   # Main navigation
│   ├── PostCard.tsx     # Post display component
│   └── providers/       # Context providers
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client
│   └── solana.ts        # Solana utilities
└── types/               # TypeScript type definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Solana](https://solana.com/) for the blockchain infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact us at support@nightstudio.com

---

**Made with ❤️ by the NightStudio team**

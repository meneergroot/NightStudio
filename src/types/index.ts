export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
  walletAddress?: string;
}

export interface Post {
  id: string;
  creator: User;
  content: string;
  image: string;
  price: number;
  currency: 'USDC' | 'SOL';
  timestamp: Date;
  isUnlocked: boolean;
  likes: number;
  comments: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: {
    sol: number;
    usdc: number;
  };
}
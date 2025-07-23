import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-solana-dark">
      <Navigation />
      <div className="pt-16 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-bold text-solana-green mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-300 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <Link 
            href="/"
            className="bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-6 py-3 text-solana-dark font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
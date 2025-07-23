'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import Navigation from '@/components/Navigation';
import { Upload, DollarSign, Lock, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function UploadPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [teaserText, setTeaserText] = useState('');
  const [price, setPrice] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [publicKey, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-solana-dark">
        <Navigation />
        <div className="pt-16 pb-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana-green mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publicKey) {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title || !teaserText) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    if (isLocked && (!price || parseFloat(price) <= 0)) {
      alert('Please set a valid price for locked content');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${publicKey.toString()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Create post in database
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          creator_id: publicKey.toString(),
          title,
          teaser_text: teaserText,
          media_url: publicUrl,
          price_usdc: isLocked ? parseFloat(price) : 0,
          is_locked: isLocked,
        });

      if (postError) {
        throw postError;
      }

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('Failed to upload post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-solana-dark">
      <Navigation />
      
      <main className="pt-16 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-solana-gray rounded-lg p-6 border border-solana-light-gray">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Upload className="text-solana-green" />
              Upload Content
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Media File (Image or Video)
                </label>
                <div className="border-2 border-dashed border-solana-light-gray rounded-lg p-6 text-center hover:border-solana-green/50 transition-colors duration-200">
                  {previewUrl ? (
                    <div className="relative">
                      <div className="aspect-video bg-solana-dark rounded-lg overflow-hidden mb-4">
                        {selectedFile?.type.startsWith('image/') ? (
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <video
                            src={previewUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="mx-auto w-16 h-16 bg-solana-light-gray rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-300 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-gray-500 text-sm">
                        PNG, JPG, GIF, MP4 up to 10MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!previewUrl && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 bg-solana-gradient hover:opacity-90 transition-opacity duration-200 rounded-lg px-6 py-3 text-solana-dark font-semibold"
                    >
                      Choose File
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-solana-dark border border-solana-light-gray rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-solana-green focus:outline-none transition-colors duration-200"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Teaser Text */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  value={teaserText}
                  onChange={(e) => setTeaserText(e.target.value)}
                  rows={4}
                  className="w-full bg-solana-dark border border-solana-light-gray rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-solana-green focus:outline-none transition-colors duration-200 resize-none"
                  placeholder="Describe your content..."
                  required
                />
              </div>

              {/* Lock Content Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="lockContent"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="w-5 h-5 text-solana-green bg-solana-dark border-solana-light-gray rounded focus:ring-solana-green focus:ring-2"
                />
                <label htmlFor="lockContent" className="text-white font-semibold flex items-center gap-2">
                  <Lock size={18} />
                  Make this premium content
                </label>
              </div>

              {/* Price Input */}
              {isLocked && (
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Price (USDC) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full bg-solana-dark border border-solana-light-gray rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:border-solana-green focus:outline-none transition-colors duration-200"
                      placeholder="0.00"
                      required
                    />
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-solana-gradient hover:opacity-90 disabled:opacity-50 transition-opacity duration-200 rounded-lg px-6 py-4 text-solana-dark font-semibold flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-solana-dark border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Content
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 
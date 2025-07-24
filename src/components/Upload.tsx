import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, Image, DollarSign, Type, Eye } from 'lucide-react';

const Upload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<'USDC' | 'SOL'>('USDC');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handlePublish = () => {
    if (!selectedFile || !caption || !price) {
      alert('Please fill in all fields');
      return;
    }
    
    console.log('Publishing post:', {
      file: selectedFile,
      caption,
      price: parseFloat(price),
      currency,
    });
    
    // TODO: Implement actual upload logic
    alert('Post published successfully!');
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
          <p className="text-gray-400">Share your premium content with your audience</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Image className="mr-2 text-[#00FFA3]" size={24} />
                Media Upload
              </h2>
              
              {!selectedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-[#00FFA3] transition-colors"
                >
                  <UploadIcon className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-300 mb-2">Drag and drop your image here</p>
                  <p className="text-gray-500 text-sm">or click to browse files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Type className="mr-2 text-[#DC1FFF]" size={24} />
                Caption
              </h2>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a compelling caption for your premium content..."
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00FFA3] focus:outline-none resize-none"
                maxLength={500}
              />
              <div className="text-right text-gray-500 text-sm mt-2">
                {caption.length}/500
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-[#00FFA3]" size={24} />
                Pricing
              </h2>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#00FFA3] focus:outline-none"
                  />
                </div>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USDC' | 'SOL')}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00FFA3] focus:outline-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="SOL">SOL</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Eye className="mr-2 text-[#DC1FFF]" size={24} />
                Preview
              </h2>
              
              {selectedFile && caption && price ? (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Mock Post Header */}
                  <div className="flex items-center space-x-3 p-4">
                    <img
                      src="https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-white font-semibold">Your Name</h3>
                      <p className="text-gray-400 text-sm">@your_username</p>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div className="px-4 pb-3">
                    <p className="text-gray-300">{caption}</p>
                  </div>
                  
                  {/* Image with Overlay */}
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover filter blur-sm brightness-50"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black px-6 py-3 rounded-lg font-semibold">
                        Unlock for {price} {currency}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Upload an image and add details to see preview</p>
                </div>
              )}
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={!selectedFile || !caption || !price}
              className="w-full bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-[#00FFA3]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
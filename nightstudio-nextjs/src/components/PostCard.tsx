import React from 'react';
import { Heart, MessageCircle, Clock, Lock, CheckCircle } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onUnlock: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUnlock }) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.creator.avatar}
            alt={post.creator.displayName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">{post.creator.displayName}</h3>
              {post.creator.verified && (
                <CheckCircle size={16} className="text-[#00FFA3]" />
              )}
            </div>
            <p className="text-gray-400 text-sm">@{post.creator.username}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock size={14} className="mr-1" />
          {formatTimeAgo(post.timestamp)}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-300 leading-relaxed">
          {post.isUnlocked ? post.content : `${post.content.slice(0, 120)}...`}
        </p>
      </div>

      {/* Image */}
      <div className="relative">
        <img
          src={post.image}
          alt="Post content"
          className={`w-full h-64 sm:h-80 object-cover ${
            !post.isUnlocked ? 'filter blur-sm brightness-50' : ''
          }`}
        />
        
        {!post.isUnlocked && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <button
              onClick={() => onUnlock(post.id)}
              className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:shadow-lg hover:shadow-[#00FFA3]/25 transition-all duration-300 transform hover:scale-105"
            >
              <Lock size={18} />
              <span>Unlock for {post.price} {post.currency}</span>
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={20} />
            <span className="text-sm">{post.likes}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-[#00FFA3] transition-colors">
            <MessageCircle size={20} />
            <span className="text-sm">{post.comments}</span>
          </button>
        </div>
        
        {post.isUnlocked && (
          <div className="flex items-center text-[#00FFA3] text-sm font-medium">
            <CheckCircle size={16} className="mr-1" />
            Unlocked
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
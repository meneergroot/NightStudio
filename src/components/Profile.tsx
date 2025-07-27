import React, { useState } from 'react';
import { MapPin, Calendar, UserPlus, Settings, CheckCircle } from 'lucide-react';
import { mockUsers, mockPosts } from '../data/mockData';
import PostCard from './PostCard';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
  const user = mockUsers[0]; // Current user profile
  const userPosts = mockPosts.filter(post => post.creator.id === user.id);

  const handleUnlock = (postId: string) => {
    console.log('Unlocking post:', postId);
  };

  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 lg:h-80">
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="relative px-4 pb-6">
          {/* Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4">
              <img
                src={user.avatar}
                alt={user.displayName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#0E0E10] bg-[#0E0E10]"
              />
              <div className="mt-4 sm:mt-0 sm:mb-4">
                <div className="flex items-center space-x-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.displayName}</h1>
                  {user.verified && (
                    <CheckCircle size={24} className="text-[#00FFA3]" />
                  )}
                </div>
                <p className="text-gray-400 text-lg">@{user.username}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00FFA3]/25 transition-all">
                <UserPlus size={18} />
                <span>Follow</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Settings size={18} />
                <span className="hidden sm:block">Settings</span>
              </button>
            </div>
          </div>

          {/* Bio and Stats */}
          <div className="mt-6 space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{user.bio}</p>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Joined March 2023</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin size={16} />
                <span>Los Angeles, CA</span>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{user.following.toLocaleString()}</span>
                <span className="text-gray-400">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-white font-semibold">{user.followers.toLocaleString()}</span>
                <span className="text-gray-400">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex space-x-8 px-4">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'border-[#00FFA3] text-[#00FFA3]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'media'
                  ? 'border-[#00FFA3] text-[#00FFA3]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Media
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} onUnlock={handleUnlock} />
              ))}
              {userPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {userPosts.map((post) => (
                <div key={post.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                  <img
                    src={post.image}
                    alt="Media"
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                      !post.isUnlocked ? 'filter blur-sm brightness-50' : ''
                    }`}
                  />
                  {!post.isUnlocked && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-sm font-medium">{post.price} {post.currency}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
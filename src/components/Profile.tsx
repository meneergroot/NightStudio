import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, UserPlus, Settings, CheckCircle, Edit } from 'lucide-react';
import { mockUsers, mockPosts } from '../data/mockData';
import PostCard from './PostCard';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { UserService } from '../services/userService';
import type { User } from '../types';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    username: '',
    bio: '',
    avatar: '',
    coverPhoto: ''
  });

  const { walletAddress, connected } = useWalletConnection();

  // Fetch user profile based on wallet address
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!connected || !walletAddress) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let userData = await UserService.getUserByWallet(walletAddress);
        
        if (!userData) {
          // Create new user profile if none exists
          const newUser = {
            wallet_address: walletAddress,
            display_name: 'New User',
            username: `user_${walletAddress.slice(0, 8)}`,
            bio: 'Welcome to NightStudio! Update your profile to get started.',
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
            cover_photo_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
            followers_count: 0,
            following_count: 0,
            verified: false
          };
          
          userData = await UserService.createUser(newUser);
        }

        if (userData) {
          // Transform database user to frontend User type
          const transformedUser: User = {
            id: userData.id,
            displayName: userData.display_name,
            username: userData.username,
            avatar: userData.avatar_url || '',
            coverPhoto: userData.cover_photo_url || '',
            bio: userData.bio || '',
            followers: userData.followers_count || 0,
            following: userData.following_count || 0,
            verified: userData.verified || false,
            walletAddress: userData.wallet_address
          };
          
          setUser(transformedUser);
          setEditForm({
            displayName: transformedUser.displayName,
            username: transformedUser.username,
            bio: transformedUser.bio,
            avatar: transformedUser.avatar,
            coverPhoto: transformedUser.coverPhoto
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [walletAddress, connected]);

  const handleUnlock = (postId: string) => {
    console.log('Unlocking post:', postId);
  };

  const handleSaveProfile = async () => {
    if (!user || !walletAddress) return;

    try {
      const updatedUser = await UserService.updateUser(user.id, {
        display_name: editForm.displayName,
        username: editForm.username,
        bio: editForm.bio,
        avatar_url: editForm.avatar,
        cover_photo_url: editForm.coverPhoto
      });

      if (updatedUser) {
        const transformedUser: User = {
          id: updatedUser.id,
          displayName: updatedUser.display_name,
          username: updatedUser.username,
          avatar: updatedUser.avatar_url || '',
          coverPhoto: updatedUser.cover_photo_url || '',
          bio: updatedUser.bio || '',
          followers: updatedUser.followers_count || 0,
          following: updatedUser.following_count || 0,
          verified: updatedUser.verified || false,
          walletAddress: updatedUser.wallet_address
        };
        
        setUser(transformedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FFA3] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
          <p className="text-gray-400">Unable to load your profile. Please try again.</p>
        </div>
      </div>
    );
  }

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
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#00FFA3]/25 transition-all"
              >
                <Edit size={18} />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                <Settings size={18} />
                <span className="hidden sm:block">Settings</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <div className="mt-6 p-6 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FFA3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FFA3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FFA3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FFA3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Photo URL</label>
                  <input
                    type="url"
                    value={editForm.coverPhoto}
                    onChange={(e) => setEditForm({...editForm, coverPhoto: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00FFA3]"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-[#00FFA3] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00E694] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bio and Stats */}
          {!isEditing && (
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
          )}
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
              {/* For now, show mock posts. Later this will be fetched from the database */}
              {mockPosts.filter(post => post.creator.id === user.id).map((post) => (
                <PostCard key={post.id} post={post} onUnlock={handleUnlock} />
              ))}
              {mockPosts.filter(post => post.creator.id === user.id).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockPosts.filter(post => post.creator.id === user.id).map((post) => (
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
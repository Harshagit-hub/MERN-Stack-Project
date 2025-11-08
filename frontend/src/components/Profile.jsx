import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import axios from 'axios';
import { Heart, MessageCircle, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const { userProfile, user } = useSelector(store => store.auth);
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const isLoggedInUserProfile = user?._id === userProfile?._id;

  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.includes(user._id));
      setFollowersCount(userProfile.followers.length);
      setFollowingCount(userProfile.following.length);
    }
  }, [userProfile, user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `https://socialbutterfly.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
      console.log(res.data.message);

      setIsFollowing(prev => !prev);
      setFollowersCount(prev => (isFollowing ? prev - 1 : prev + 1));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };
  return (
    <div className="flex max-w-6xl justify-center mx-auto px-6 py-10 pl-4 md:pl-28 lg:pl-32 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-8 sm:gap-12 w-full">
        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap- 6 sm:gap-4 items-center">
          {/* Avatar */}
          <section className="flex justify-center md:justify-center">
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 md:h-44 md:w-44 ring-4 ring-gray-200 shadow-lg">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* User Info */}
          <section className="flex flex-col gap-5 items-center md:items-start text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <span className="text-lg sm:text-xl font-semibold">{userProfile?.username}</span>

              {isLoggedInUserProfile ? (
                <Link to="/account/edit">
                  <Button variant="secondary" className="hover:bg-gray-100 text-sm">
                    Edit profile
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    className={`text-sm ${isFollowing ? 'bg-gray-200 hover:bg-gray-300' : 'bg-[#0095F6] hover:bg-[#318bdf]'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  <Button variant="secondary" className="text-sm">Message</Button>
                </>
              )}
            </div>

            {/* Bio */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-xl sm:text-2xl text-gray-900 flex items-center justify-center md:justify-start space-x-2">
                  <span>{userProfile?.name}</span>
                </h1>
                <p className="text-gray-500">@{userProfile?.username}</p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-700 whitespace-pre-line">{userProfile?.bio}</p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Link className="w-4 h-4" />
                    <span className="text-purple-600">{userProfile?.website}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {userProfile?.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Followers / Following / Posts */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-6 pt-6 border-t border-gray-200/50">
          <div className="text-center">
            <div className="text-xl sm:text-2xl text-gray-900">{userProfile?.posts.length}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl text-gray-900">{followersCount}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl text-gray-900">{followingCount}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm font-medium text-gray-500">
            {['posts', 'saved', 'reels', 'tags'].map(tab => (
              <span
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`py-2 sm:py-3 cursor-pointer transition-colors ${activeTab === tab ? 'font-bold text-black border-t-2 border-black' : 'hover:text-gray-800'
                  }`}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* POSTS */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
              {userProfile?.posts?.length === 0 ? (
                <div className="text-gray-400 text-center py-6 col-span-2 sm:col-span-3">No posts found</div>
              ) : (
                userProfile.posts.map((post) => (
                  <div key={post?._id} className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm">
                    <img src={post.image} alt="postimage" className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center text-white space-x-6">
                        <button className="flex items-center gap-2 hover:scale-105 transition">
                          <Heart size={18} /> <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:scale-105 transition">
                          <MessageCircle size={18} /> <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SAVED */}
          {activeTab === 'saved' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
              {userProfile?.bookmarks?.length === 0 ? (
                <div className="text-gray-400 text-center py-6 col-span-2 sm:col-span-3">No saved posts</div>
              ) : (
                userProfile.bookmarks.map((post) => (
                  <div key={post?._id} className="rounded-lg overflow-hidden shadow-sm">
                    <img src={post.image} alt="saved-post" className="w-full aspect-square object-cover" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* REELS */}
          {activeTab === 'reels' && (
            <div className="text-gray-400 text-center py-6">No reels found</div>
          )}

          {/* TAGS */}
          {activeTab === 'tags' && (
            <div className="text-gray-400 text-center py-6">No tagged posts</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

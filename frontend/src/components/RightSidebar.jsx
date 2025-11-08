import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Profile Avatar Button for Mobile */}
      <div className="fixed top-7 right-7 z-20 lg:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-full border-2 border-white shadow-md overflow-hidden w-10 h-10"
        >
          <Avatar className="w-full h-full">
            <AvatarImage src={user?.profilePicture} alt="user avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </div>

      {/* Slide-out Menu / Sidebar */}
      <div
        className={`lg:flex lg:flex-col lg:fixed lg:top-0 lg:right-0 lg:z-40 lg:h-screen lg:w-[20%] 
                    border-l border-gray-300 bg-gradient-to-b from-[#e7a3b3] via-[#bde9e6] to-[#e4a7ce] 
                    px-4 py-6 shadow-lg
                    ${menuOpen ? 'fixed top-0 right-0 z-40 h-screen w-64' : 'hidden'} transition-transform duration-300`}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/30 w-55">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user?._id}`} onClick={() => setMenuOpen(false)}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profilePicture} alt="user avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm text-black-800">
                <Link
                  to={`/profile/${user?._id}`}
                  className="hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  {user?.username}
                </Link>
              </h1>
              <span className="text-xs text-black-600">{user?.bio || 'Your bio goes here'}</span>
            </div>
          </div>
        </div>

        {/* Suggested Users */}
        <div className="mt-6">
          <SuggestedUsers />
        </div>
      </div>

      {/* Overlay to close menu */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black opacity-25 z-10 lg:hidden"
        ></div>
      )}
    </>
  );
};

export default RightSidebar;



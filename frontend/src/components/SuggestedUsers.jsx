
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);

    return (
        <div className='my-8 px-2 sm:px-4'>
            <div className='flex items-center justify-between text-sm mb-4'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer text-xs sm:text-sm'>See All</span>
            </div>
            <div className='space-y-4'>
                {suggestedUsers.map((user) => (
                    <div key={user._id} className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <Link to={`/profile/${user._id}`}>
                                <Avatar className='w-10 h-10 sm:w-12 sm:h-12'>
                                    <AvatarImage src={user?.profilePicture} alt="profile" />
                                    <AvatarFallback>{user?.username?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className='flex flex-col'>
                                <h1 className='font-semibold text-sm sm:text-base'>
                                    <Link to={`/profile/${user._id}`}>{user?.username}</Link>
                                </h1>
                                <span className='text-gray-600 text-xs sm:text-sm'>
                                    {user?.bio || 'Bio here...'}
                                </span>
                            </div>
                        </div>
                        <span className='text-[#3BADF8] text-xs sm:text-sm font-bold cursor-pointer hover:text-[#3495d6]'>
                            Follow
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SuggestedUsers;

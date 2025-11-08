import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="my-2 sm:my-3 px-2">
      <div className="flex items-start gap-2 sm:gap-3">
        <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
          <AvatarImage src={comment?.author?.profilePicture} alt="User" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 max-w-[85%] sm:max-w-sm">
          <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-snug">
            <span className="font-semibold">{comment?.author?.username}</span>{' '}
            <span className="font-normal">{comment?.text}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Comment;


import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`https://socialbutterfly.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-[95%] sm:max-w-xl h-[75vh] sm:h-[70vh] bg-[#faf3f0] p-0 flex flex-col rounded-xl shadow-md transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-pink-200">
          <div className="flex gap-2 items-center">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
              <AvatarImage src={selectedPost?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Link className="font-semibold text-sm sm:text-base text-[#444]">
              {selectedPost?.author?.username}
            </Link>
          </div>

          {/* More options */}
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-gray-800 w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </DialogTrigger>

            <DialogContent className="w-52 sm:w-60 p-0 rounded-xl bg-[#fff4f2] border border-[#ffd5cb] shadow-xl z-[9999]">
              <div className="flex flex-col text-sm font-medium text-[#292626]">
                <button className="px-4 py-3 hover:bg-[#ffe5e0] text-red-300 font-semibold text-left">
                  Unfollow
                </button>
                <button className="px-4 py-3 hover:bg-[#ffe5e0] text-left">
                  Add to favorites
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-2 custom-scrollbar">
          {comment.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
        </div>

        {/* Footer - Add Comment */}
        <div className="border-t border-pink-200 px-3 sm:px-4 py-2 sm:py-3 bg-[#fffaf7]">
          <div className="flex items-center gap-3 sm:gap-6">
            <input
              type="text"
              value={text}
              onChange={changeEventHandler}
              placeholder="Add a comment..."
              className="w-full text-xs sm:text-sm px-2 sm:px-3 py-2 border border-gray-300 rounded-md outline-none bg-white focus:ring-2 focus:ring-pink-400"
            />
            <Button
              disabled={!text.trim()}
              onClick={sendMessageHandler}
              className="text-xs sm:text-sm bg-pink-400 hover:bg-pink-500 text-white px-3 sm:px-4"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog


import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { IoIosShareAlt } from "react-icons/io"
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const { posts } = useSelector(store => store.post)

  if (!post || !post._id || !post.author || !post.author._id) return null

  const author = post.author
  const isAuthor = user?._id && author?._id && user._id === author._id
  const [liked, setLiked] = useState(post.likes.includes(user?._id))
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => setText(e.target.value.trim())

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)
        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? { ...p, likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] }
            : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)
        const updatedPostData = posts.map(p =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post._id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedPostData = posts.filter(p => p._id !== post._id)
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, { withCredentials: true })
      if (res.data.success) toast.success(res.data.message)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-gradient-to-b from- via-[#bde9e6] backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-4 sm:p-5 max-w-xl mx-auto mb-6">
      
      {/* Author Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center">
          <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border border-gray-300">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-2 sm:ml-3">
            <h1 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2 break-words">
              {post.author?.username}
              {isAuthor && <Badge variant="secondary">Author</Badge>}
            </h1>
          </div>
        </div>

        {/* More Options */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:text-gray-700" />
          </DialogTrigger>
          <DialogContent className="w-72 sm:w-80 p-5 rounded-xl bg-white border border-gray-200 shadow-xl flex flex-col gap-2 sm:gap-3 text-sm text-gray-700">
            {post?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="w-full py-2 sm:py-3 bg-red-50 text-red-600 font-semibold hover:bg-red-100"
              >
                Unfollow
              </Button>
            )}
            <Button
              variant="ghost"
              className="w-full py-2 sm:py-3 bg-blue-50 text-gray-900 hover:bg-blue-100"
            >
              Add to favorites
            </Button>
            {isAuthor && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="w-full py-2 sm:py-3 bg-red-200 text-red-900 font-semibold hover:bg-red-300"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="rounded-xl overflow-hidden my-2 sm:my-3">
        <img className="w-full object-cover aspect-square" src={post.image} alt="post_img" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between my-2 sm:my-3 flex-wrap">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer text-red-600 transition" />
          ) : (
            <FaRegHeart onClick={likeOrDislikeHandler} size={22} className="cursor-pointer hover:text-gray-600 transition" />
          )}
          <MessageCircle onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }} size={22} className="cursor-pointer hover:text-gray-600 transition" />
          <IoIosShareAlt size={22} className="cursor-pointer hover:text-gray-600 transition" />
        </div>
        <Bookmark onClick={bookmarkHandler} className="cursor-pointer hover:text-gray-600 transition mt-2 sm:mt-0" />
      </div>

      {/* Likes + Caption */}
      <span className="font-medium block mb-1 sm:mb-2 text-sm sm:text-base">{postLike} likes</span>
      <p className="text-gray-800 break-words text-sm sm:text-base">
        <span className="font-semibold mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {/* Comments */}
      {comment.length > 0 && (
        <span
          onClick={() => { dispatch(setSelectedPost(post)); setOpen(true) }}
          className="cursor-pointer text-sm text-gray-500 hover:underline mt-1 block"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment */}
      <div className="flex items-center justify-between border-t border-gray-200 mt-2 sm:mt-3 pt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full px-2 py-1 sm:py-2"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-blue-500 font-medium cursor-pointer ml-2 text-sm sm:text-base"
          >
            Post
          </span>
        )}
      </div>
    </div>
  )
}

export default Post;

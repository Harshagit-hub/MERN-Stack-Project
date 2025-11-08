import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const imageRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const dataUrl = await readFileAsDataURL(droppedFile);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10 bg- via-[#dff0ef]"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="relative w-full max-w-md sm:max-w-xl bg-gradient-to-b from-[#f5dde3] via-[#dff0ef] to-[#d4dbf3] border shadow-md rounded-2xl p-4 sm:p-6">
        {/* ❌ Close button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-black transition"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Title */}
        <h1 className="text-lg sm:text-xl font-bold text-center mb-1 sm:mb-2">Create New Post</h1>
        <p className="text-xs sm:text-sm text-center text-gray-500 mb-3 sm:mb-4">Share a photo with your followers.</p>

        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src={user?.profilePicture} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm sm:text-base">{user?.username}</h1>
            <p className="text-xs text-gray-500">Bio here...</p>
          </div>
        </div>

        {/* Caption */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="mb-4 text-sm sm:text-base"
        />

        {/* Image preview */}
        {imagePreview && (
          <div className="w-full h-48 sm:h-64 mb-4 rounded-lg overflow-hidden border">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* File input */}
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        {/* File select button */}
        <Button onClick={() => imageRef.current.click()} className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-sm sm:text-base">
          Select from computer
        </Button>

        {/* Submit button */}
        {imagePreview && (
          loading ? (
            <Button disabled className="w-full text-sm sm:text-base">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </Button>
          ) : (
            <Button onClick={createPostHandler} className="w-full text-sm sm:text-base">
              Post
            </Button>
          )
        )}

        {/* Drag & drop text */}
        {!imagePreview && (
          <p className="text-center text-xs sm:text-sm text-gray-400 mt-3">
            Or drag & drop an image here
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

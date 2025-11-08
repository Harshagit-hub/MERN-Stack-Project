import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  // Ensure no invalid posts crash rendering
  const safePosts = posts.filter(
    (post) => post && post._id && post.author && post.author._id
  );

  return (
    <div className="space-y-6">
      {safePosts.length > 0 ? (
        safePosts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <p className="text-center text-gray-500">No posts yet. Be the first to share!</p>
      )}
    </div>
  );
};

export default Posts;




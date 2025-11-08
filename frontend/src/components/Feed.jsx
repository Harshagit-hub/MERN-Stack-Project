import React from "react";
import Posts from "./Posts";
import { motion } from "framer-motion";

const Feed = () => {
  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4">
      {/* Feed header */}
 <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="backdrop-blur-m bg-purple-200 rounded-2xl shadow-lg border border-white/20 p-5 sticky top-0 z-10 mb-4 "
      >
        <p className="text-sm text-black-600 text-center">
          Welcome back! See what’s new today.
        </p>
      </motion.div>

      {/* Post list */}
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-140px)] pr-1">
        <Posts />
      </div>
    </div>
  );
};

export default Feed;



import React, { useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/api/v1/user/search?query=${query}`);
      setResults(data.users);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <div className="ml-0 lg:ml-[14%] px-4 sm:px-6 py-8 min-h-screen bg-gradient-to-b from-[#f5dde3] via-[#dff0ef] to-[#d4dbf3] shadow-lg">
      <div className="max-w-xl mx-auto">
<form onSubmit={handleSearch} className="flex flex-row gap-3 mb-6 flex-wrap sm:flex-nowrap">
  <input
    type="text"
    placeholder="Search users..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-10"
  />
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all flex-shrink-0 mt-10"
  >
    Search
  </button>
</form>


        <div className="space-y-4">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <Avatar className="w-12 h-12 flex-shrink-0">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="truncate">
                <a
                  href={`/profile/${user.username}`}
                  className="text-lg font-medium text-gray-800 hover:underline truncate"
                >
                  {user.username}
                </a>
              </div>
            </div>
          ))}

          {results.length === 0 && query && (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;

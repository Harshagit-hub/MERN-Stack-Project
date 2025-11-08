

import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'https://socialbutterfly.onrender.com/api/v1/user/register',
        input,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e7a3b3] via-[#bde9e6] to-[#f0d892] px-4">
      <form
        onSubmit={signupHandler}
        className="w-full max-w-md flex flex-col gap-5 px-6 py-6 bg-white/30 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img src="/logo/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <p className="text-sm text-center text-black mt-2 font-medium">Signup</p>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm font-medium text-black">Username</label>
          <Input
            type="text"
            name="username"
            placeholder="Make it catchy!"
            value={input.username}
            onChange={changeEventHandler}
            className="my-2 px-3 py-2 w-full bg-gradient-to-r from-[#c4d9ef] to-[#e3d3f7] hover:brightness-110 text-[#090112] font-medium rounded-xl shadow-sm outline-none border-0"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-black">Email</label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2 px-3 py-2 w-full bg-gradient-to-r from-[#c4d9ef] to-[#e3d3f7] hover:brightness-110 text-[#090112] font-medium rounded-xl shadow-sm outline-none border-0"
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-black">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="•••••••"
            value={input.password}
            onChange={changeEventHandler}
            className="my-2 px-3 py-2 w-full bg-gradient-to-r from-[#c4d9ef] to-[#e3d3f7] hover:brightness-110 text-[#090112] font-medium rounded-xl shadow-sm outline-none border-0"
          />
        </div>

        {/* Submit */}
        {loading ? (
          <Button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D8BBFF] to-[#9FAFFF] text-white">
            <Loader2 className="w-4 h-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9d8ad0] to-[#725891] hover:brightness-110 text-[#090112] font-medium">
            Signup
          </Button>
        )}

        <p className="text-sm text-center text-black">
          Already have an account?
          <Link to="/login" className="ml-1 font-medium text-[#7b3f8e] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;

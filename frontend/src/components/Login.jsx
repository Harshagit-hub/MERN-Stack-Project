import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        'https://socialbutterfly.onrender.com/api/v1/user/login',
        input,
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
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
        onSubmit={loginHandler}
        className="w-full max-w-md flex flex-col gap-3 px-6 py-6 bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-white shadow-lg flex items-center justify-center">
            <img src="/logo/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-black">Welcome Back</h2>
        <p className="text-center text-sm text-gray-800 mb-4">Login to continue</p>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black">Email</label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="you@example.com"
            className="my-2 px-3 py-2 w-full rounded-xl shadow-sm font-medium text-[#090112] bg-gradient-to-r from-[#c4d9ef] to-[#e3d3f7] hover:brightness-110 outline-none border-0"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-black">Password</label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="••••••••"
            className="my-2 px-3 py-2 w-full rounded-xl shadow-sm font-medium text-[#090112] bg-gradient-to-r from-[#c4d9ef] to-[#e3d3f7] hover:brightness-110 outline-none border-0"
          />
        </div>

        {/* Submit */}
        {loading ? (
          <Button disabled className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#71c0d1] to-[#0e1f22] text-white">
            <Loader2 className="w-4 h-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9d8ad0] to-[#725891] hover:brightness-110 text-[#090112] font-medium"
          >
            Login
          </Button>
        )}

        <p className="text-sm text-center text-[#271313]">
          Don’t have an account?
          <Link to="/signup" className="ml-1 font-medium text-[#2e0331] hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

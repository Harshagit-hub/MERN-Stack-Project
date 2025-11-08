import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, Menu } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { markAllRead } from '@/redux/notificationSlice'
import { clearMessageNotifications } from '@/redux/messageSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector(store => store.auth);
  const { unread, notifications } = useSelector(store => store.notification);
  const { messageNotifications } = useSelector(store => store.messages);

  const [open, setOpen] = useState(false); // sidebar toggle state

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://socialbutterfly.onrender.com/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') logoutHandler();
    else if (textType === "Create") navigate("/create");
    else if (textType === "Profile") navigate(`/profile/${user?._id}`);
    else if (textType === "Home") navigate("/");
    else if (textType === 'Messages') navigate("/chat");
    else if (textType === "Search") navigate("/search");
    else if (textType === "Notification") {
      navigate("/notification");
      dispatch(markAllRead());
    }
    setOpen(false); // close sidebar after action (on mobile)
  }

  // reset notifications/messages
  useEffect(() => {
    if (location.pathname === "/chat") dispatch(clearMessageNotifications());
    if (location.pathname === "/notification") dispatch(markAllRead());
  }, [location.pathname, dispatch]);

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className='w-9 h-9'>
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  return (
    <>
{/* Hamburger button for mobile */}
{!open && (
  <div className='fixed top-7 left-7 z-30 lg:hidden'>
    <Button onClick={() => setOpen(!open)} className="p-2">
      <Menu />
    </Button>
  </div>
)}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-screen w-47 lg:w-[15%] 
          border-r border-gray-300 bg-gradient-to-b from-[#e7a3b3] via-[#bde9e6] to-[#e4a7ce] 
          px-4 py-6 shadow-lg transform transition-transform duration-300 
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className='flex flex-col'>
          <div className="h-15 w-15 rounded-full bg-white shadow-lg flex items-center justify-center mx-left mt-2">
            <img src="/logo/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
          </div>

          <div>
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => sidebarHandler(item.text)}
                className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
              >
                {item.icon}
                <span>{item.text}</span>

                {/* Notification badge */}
                {item.text === "Notification" && unread > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size='icon' className="rounded-full h-5 w-5 bg-fuchsia-800 absolute bottom-6 left-6">
                        {unread}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {notifications.slice(0, 5).map((n, i) => (
                          <div key={i} className='flex items-center gap-2 my-2'>
                            <Avatar>
                              <AvatarImage src={n?.fromUser?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className='text-sm'>
                              <span className='font-bold'>{n?.fromUser?.username}</span> {n?.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Message badge */}
                {item.text === "Messages" && messageNotifications.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size='icon' className="rounded-full h-5 w-5 bg-cyan-800 absolute bottom-6 left-6">
                        {messageNotifications.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {messageNotifications.slice(0, 5).map((m, i) => (
                          <div key={i} className='flex items-center gap-2 my-2'>
                            <Avatar>
                              <AvatarImage src={m?.fromUser?.profilePicture} />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className='text-sm'>
                              <span className='font-bold'>{m?.fromUser?.username}</span>: {m?.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black opacity-25 z-10 lg:hidden"
        />
      )}
    </>
  )
}

export default LeftSidebar


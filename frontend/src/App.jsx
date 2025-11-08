import { useEffect } from 'react'
import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import Search from "./components/Search";
import Notification from './components/Notification';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes'
import CreatePost from './components/CreatePost';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { addNotification } from "@/redux/notificationSlice";
import { setLikeNotification } from "@/redux/rtnSlice";
import { addMessageNotification, addMessageToConversation } from './redux/messageSlice';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: '/profile/:id', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
      { path: '/search', element: <ProtectedRoutes><Search /></ProtectedRoutes> },
      { path: '/notification', element: <ProtectedRoutes><Notification /></ProtectedRoutes> },
      { path: '/create', element: <ProtectedRoutes><CreatePost /></ProtectedRoutes> },
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
])

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:8000', {
        query: { userId: user?._id },
        transports: ['websocket']
      });

      dispatch(setSocket(socketio));

      // ✅ Online users
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      // ✅ Normal notifications (likes, follows etc.)
      socketio.on('notification', (notification) => {
        dispatch(addNotification(notification));
        dispatch(setLikeNotification(notification));
      });

      // ✅ Messages ke liye alag listener rakho
      socketio.on("newMessage", (message) => {
        dispatch(addMessageNotification(message));
        dispatch(addMessageToConversation({ 
          conversationId: message.conversationId, 
          message 
        }));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />
}

export default App;
   

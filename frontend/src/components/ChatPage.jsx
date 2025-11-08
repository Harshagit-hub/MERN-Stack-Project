import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { addMessage } from '@/redux/chatSlice';

const ChatPage = () => {
  const { leftSidebarOpen } = useOutletContext();
  const [textMessage, setTextMessage] = useState('');
  const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
  const { onlineUsers } = useSelector(store => store.chat);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  const sendMessageHandler = async () => {
    if (!textMessage || !selectedUser) return;
    try {
      const res = await axios.post(
        `https://socialbutterfly.onrender.com/api/v1/message/send/${selectedUser._id}`,
        { textMessage },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );
      if (res.data.success) {
        dispatch(addMessage(res.data.newMessage));
        setTextMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message) => {
      if (message.senderId === selectedUser?._id || message.receiverId === selectedUser?._id) {
        dispatch(addMessage(message));
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, selectedUser, dispatch]);

  useEffect(() => {
    return () => dispatch(setSelectedUser(null));
  }, [dispatch]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative ">


      <div className="flex overflow-x-auto border-b border-gray-300 bg-white shadow-sm py-2 px-20 relative z-10 lg:ml-[10%]">
        {suggestedUsers.map(suggestedUser => {
          const isOnline = onlineUsers.includes(suggestedUser?._id);
          return (
            <div
              key={suggestedUser?._id}
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className="flex flex-col items-center cursor-pointer mx-2"
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className={`absolute bottom-0 right-1 block w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <span className="text-xs mt-1 text-gray-700 ">{suggestedUser?.username}</span>
            </div>
          );
          
        })}
      </div>

      {/* ================== MESSAGE AREA ================== */}
      <div className="flex-1 flex flex-col relative lg:ml-[15%] h-10">

        {/* Overlay when sidebar open */}
        {leftSidebarOpen && (
          <div className="absolute inset-0 bg-gray-100 opacity-50 pointer-events-none transition-opacity duration-300 z-10" />
        )}

        {selectedUser ? (
          <>
            {/* Messages scrollable */}
            <div className="flex-1 overflow-y-auto">
              <Messages selectedUser={selectedUser} />
            </div>

            {/* Typing input */}
            {!leftSidebarOpen ? (
              <div className="flex overflow-x-auto border-b border-gray-300 bg-white shadow-sm py-2 px-4 relative z-10">
                <Input
                  type="text"
                  className="flex-1 mr-2 focus-visible:ring-transparent"
                  placeholder="Type a message..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessageHandler(); }}
                />
                <Button onClick={sendMessageHandler}>Send</Button>
              </div>
            ) : (
              <div className="flex items-center p-4 border-t border-gray-200 bg-white relative z-20">
                <Input
                  type="text"
                  className="flex-1 mr-2 focus-visible:ring-transparent"
                  placeholder="Type a message..."
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessageHandler(); }}
                />
                <Button onClick={sendMessageHandler}>Send</Button>
              </div>
            )}
          </>
        ) : (
          // Placeholder when no user selected
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center p-10">
            <MessageCircleCode className="w-20 h-20 text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold">Your messages</h2>
            <p className="text-sm">Select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;


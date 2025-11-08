

import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { clearLikeNotification } from "@/redux/rtnSlice";
import axios from "axios";
import { setNotifications } from "@/redux/notificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((store) => store.notification);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/notifications", {
          withCredentials: true,
        });
        dispatch(setNotifications(res.data.notifications));
        dispatch(clearLikeNotification()); // reset sidebar badge
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full">
      <h2 className="text-xl sm:text-2xl font-bold  ml-14 mt-3 mb-6 sm:mb-6 text-gray-800">
        Notifications
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
            No notifications yet
          </p>
        ) : (
          notifications.map((n, idx) => (
            <div
              key={n._id || idx}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border rounded-xl shadow-sm bg-white"
            >
              <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                <AvatarImage src={n.fromUser?.profilePicture} />
                <AvatarFallback>
                  {n.fromUser?.username?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-gray-700 text-sm sm:text-base leading-snug">
                <span className="font-semibold text-gray-900">
                  {n.fromUser?.username}
                </span>{" "}
                liked your post
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;






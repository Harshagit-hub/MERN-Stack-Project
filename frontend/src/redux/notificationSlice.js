import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [], // all notifications
        unread: 0,        // unread count for badge
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload); // newest on top
            state.unread += 1;
        },
        markAllRead: (state) => {
            state.unread = 0;
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
    },
});

export const { addNotification, markAllRead, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

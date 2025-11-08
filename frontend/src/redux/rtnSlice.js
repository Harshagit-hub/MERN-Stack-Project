import { createSlice } from "@reduxjs/toolkit";
const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [],
        newNotificationAvailable: false // ✅ new flag
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if(action.payload.type === 'like') {
                state.likeNotification = [action.payload, ...state.likeNotification];
                state.newNotificationAvailable = true; // ✅ popover trigger
            } else if(action.payload.type === 'dislike') {
                state.likeNotification = state.likeNotification.filter(
                    (item) => item.userId !== action.payload.userId
                );
            }
        },
        clearLikeNotification: (state) => {
            state.likeNotification = [];
            state.newNotificationAvailable = false; // ✅ page opened, reset flag
        },
        markPopoverSeen: (state) => {
            state.newNotificationAvailable = false; // ✅ user saw the popover
        }
    }
})

export const { setLikeNotification, clearLikeNotification, markPopoverSeen } = rtnSlice.actions;
export default rtnSlice.reducer;



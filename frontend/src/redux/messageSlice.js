
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messageNotifications: [], // new message notifications
  messages: {}, // agar aap conversation-wise messages store karna chahte ho
  
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Add new message notification
    addMessageNotification: (state, action) => {
      state.messageNotifications.push(action.payload);
    },

    // Clear message notifications (e.g., after user opens sidebar)
    clearMessageNotifications: (state) => {
      state.messageNotifications = [];
    },

    // Optional: store messages per conversation
    setMessagesForConversation: (state, action) => {
      const { conversationId, messages } = action.payload;
      state.messages[conversationId] = messages;
    },

    addMessageToConversation: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) state.messages[conversationId] = [];
      state.messages[conversationId].push(message);
    },
  },
});

export const {
  addMessageNotification,
  clearMessageNotifications,
  setMessagesForConversation,
  addMessageToConversation,
} = messageSlice.actions;

export default messageSlice.reducer;

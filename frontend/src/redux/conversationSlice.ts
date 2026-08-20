import { createSlice } from "@reduxjs/toolkit";

export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation: null,
  },
  reducers: {
    setConversation: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setConvTitle: (state, action) => {
      const { title, conversationId } = action.payload;
      state.conversations = state.conversations.map((conversation) => {
        return conversation._id === conversationId ? (
          { ...conversation, title }
        ) : conversation
      })
      if (state.selectedConversation._id === conversationId) {
        state.selectedConversation = { ...state.selectedConversation, title }
      }
    },
  },
});

export const { setConversation, addConversation, setSelectedConversation, setConvTitle } = conversationSlice.actions;
export default conversationSlice.reducer;

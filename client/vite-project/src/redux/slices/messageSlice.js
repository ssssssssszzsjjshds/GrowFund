import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstance";

// Async thunk to fetch messages with a user (conversation)
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/messages/${userId}`);
      return { userId, messages: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to fetch messages"
      );
    }
  }
);

// Async thunk to send a message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ receiver, content }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/messages", { receiver, content });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Failed to send message"
      );
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    currentConversation: null, // { userId, username, ... }
    messages: [], // messages for the current conversation
    loading: false,
    error: null,
    sending: false,
    sendError: null,
    // Optionally: conversations: []
  },
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload; // { userId, username, ... }
      state.messages = [];
      state.error = null;
      state.sendError = null;
    },
    clearMessages(state) {
      state.messages = [];
      state.currentConversation = null;
      state.error = null;
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch messages";
        state.messages = [];
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.sendError = null;
        // Optionally, push the new message to the messages array
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload || "Failed to send message";
      });
  },
});

export const { setCurrentConversation, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;

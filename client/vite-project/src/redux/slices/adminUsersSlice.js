import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstance";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Fetch failed");
    }
  }
);

// Ban a user
export const banUser = createAsyncThunk(
  "adminUsers/banUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/admin/users/${userId}/ban`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Ban failed");
    }
  }
);

// Unban a user
export const unbanUser = createAsyncThunk(
  "adminUsers/unbanUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `/api/admin/users/${userId}/unban`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Unban failed");
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  "adminUsers/deleteUser",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return userId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Delete failed");
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Ban user
      .addCase(banUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.users = state.users.map((u) =>
          u._id === updated._id ? updated : u
        );
      })
      // Unban user
      .addCase(unbanUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.users = state.users.map((u) =>
          u._id === updated._id ? updated : u
        );
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default adminUsersSlice.reducer;

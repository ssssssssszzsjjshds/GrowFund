import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstance";

// Thunk to handle pledging (cookie-based, no token in header)
export const pledgeToCampaign = createAsyncThunk(
  "pledge/pledgeToCampaign",
  async ({ campaignId, amount }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/pledges",
        { campaignId, amount }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { msg: "Pledge failed" }
      );
    }
  }
);

const pledgeSlice = createSlice({
  name: "pledge",
  initialState: {
    pledge: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetPledgeState: (state) => {
      state.pledge = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(pledgeToCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pledgeToCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.pledge = action.payload;
      })
      .addCase(pledgeToCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Pledge failed";
      });
  },
});

export const { resetPledgeState } = pledgeSlice.actions;

export default pledgeSlice.reducer;
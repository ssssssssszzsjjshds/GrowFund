import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axiosInstance";

// Get all campaigns
export const fetchCampaigns = createAsyncThunk(
  "campaign/fetchCampaigns",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/campaigns");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch campaigns");
    }
  }
);

// Get campaign by ID
export const fetchCampaignById = createAsyncThunk(
  "campaign/fetchCampaignById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/campaigns/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch campaign");
    }
  }
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  "campaign/updateCampaign",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/api/campaigns/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Update failed");
    }
  }
);

// Slice
const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    campaigns: [],
    campaign: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCampaignError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch campaign by ID
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.campaign = action.payload;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update campaign
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaign = action.payload.campaign || action.payload;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCampaignError } = campaignSlice.actions;
export default campaignSlice.reducer;
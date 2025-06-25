import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import campaignReducer from "./slices/campaignSlice";
import pledgeReducer from "./slices/pledgeSlice";
import messagesReducer from "./slices/messageSlice";
import adminUsersReducer from "./slices/adminUsersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    pledges: pledgeReducer,
    messages: messagesReducer,
    adminUsers: adminUsersReducer,
  },
});

export default store;

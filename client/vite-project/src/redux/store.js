import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import campaignReducer from "./slices/campaignSlice";
import pledgeReducer from "./slices/pledgeSlice";
import messagesSlice from "./slices/messageSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    pledges: pledgeReducer,
    messages : messagesSlice
   
  },
});
export default store;

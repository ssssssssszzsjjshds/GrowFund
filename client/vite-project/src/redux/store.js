import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import campaignReducer from "./slices/campaignSlice";
import pledgeReducer from "./slices/pledgeSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    campaign: campaignReducer,
    pledges: pledgeReducer,
   
  },
});
export default store;

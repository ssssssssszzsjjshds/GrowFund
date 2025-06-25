import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import Admin from "../admin/AdminPanel";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import CampaignDetail from "../pages/campaignDetails/CampaignDetail";
import Explore from "../pages/explore/Explore";
import MyCampaigns from "../pages/mycampaign/MyCampaigns";
import CampaignEdit from "../pages/campaignEdit/CampaignEdit";
import PrivateRoute from "./PrivateRoute";

import AdminPanel from "../admin/AdminPanel";
import AdminCampaignDetail from "../pages/adminCampaignDetail/AdminCampaignDetail";
import RequireAdmin from "./RequireAdmin";
import AdminReviewDetail from "../components/AdminReviewDetail";
import ReviewCampaigns from "../components/ReviewCampaigns";
import SavedCampaigns from "../pages/savedCampaigns/SavedCampaigns";
import App from "../App";
import MockPaymentPage from "../components/MockPaymentPage";
import MessagesPage from "../pages/messages/MessagesPage";
import UserProfileSettings from "../pages/userProfileSettings/UserProfileSettings";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import ActivityPage from "../pages/activity/ActivityPage";
import UserProfilePage from "../pages/userProfilePage/UserProfilePage";
import ReviewUsers from "../admin/ReviewUsers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "create-campaign", element: <CreateCampaign /> },
      { path: "campaigns/:id", element: <CampaignDetail /> },
      { path: "explore", element: <Explore /> },
      { path: "my-campaigns", element: <MyCampaigns /> },
      { path: "campaigns/:id/edit", element: <CampaignEdit /> },
      { path: "saved-campaigns", element: <SavedCampaigns /> },
      { path: "mock-payment", element: <MockPaymentPage /> },
      { path: "activity", element: <ActivityPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "profile/:id", element: <UserProfilePage /> },
      {
        path: "settings/profile",
        element: (
          <PrivateRoute>
            <UserProfileSettings />
          </PrivateRoute>
        ),
      },
      { path: "reset-password/:token", element: <ResetPassword /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminPanel />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/campaigns/:id",
    element: (
      <RequireAdmin>
        <AdminCampaignDetail />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <RequireAdmin>
        <ReviewUsers />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/review",
    element: (
      <RequireAdmin>
        <ReviewCampaigns />
      </RequireAdmin>
    ),
  },
  {
    path: "/admin/review/:id",
    element: (
      <RequireAdmin>
        <AdminReviewDetail />
      </RequireAdmin>
    ),
  },
]);

export default router;

import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import Admin from "../admin/Admin";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import CreateCampaign from "../pages/campaign/CreateCampaign";
import CampaignDetail from "../pages/campaignDetails/CampaignDetail";
import Explore from "../pages/explore/Explore";
import MyCampaigns from "../pages/mycampaign/MyCampaigns";
import CampaignEdit from "../pages/campaignEdit/CampaignEdit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "create-campaign", element: <CreateCampaign /> },
      { path: "campaigns/:id", element: <CampaignDetail /> },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "my-campaigns",
        element: <MyCampaigns />,
      },
      {
        path: "campaigns/:id/edit",
        element: <CampaignEdit />,
      },
    ],
  },
]);

export default router;

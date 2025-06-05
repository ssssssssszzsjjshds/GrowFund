import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Home from "../pages/home/Home";
import Admin from "../admin/Admin";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ path: "", element: <Home /> }],
  },
]);

export default router;

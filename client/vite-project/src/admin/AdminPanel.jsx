import { useEffect, useState } from "react";
import axios from "../axiosInstance";
import { useSelector } from "react-redux";
import AdminPanelNavbar from "./AdminPanelNavbar";
import AdminCampaignList from "../components/AdminCampaignList";

const AdminPanel = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, campaignsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/campaigns", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setCampaigns(campaignsRes.data);
      } catch (err) {
        console.error("Admin fetch failed", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <AdminPanelNavbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
        <AdminCampaignList />
      </div>
    </div>
  );
};

export default AdminPanel;

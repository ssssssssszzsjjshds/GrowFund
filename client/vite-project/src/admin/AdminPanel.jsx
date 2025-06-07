import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <h2 className="text-xl font-semibold mt-6 mb-2">Users</h2>
      <ul className="mb-6">
        {users.map((user) => (
          <li key={user._id}>
            {user.name} – {user.email} ({user.role})
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Campaigns</h2>
      <ul>
        <AdminCampaignList />

      </ul>
    </div>
  );
};

export default AdminPanel;

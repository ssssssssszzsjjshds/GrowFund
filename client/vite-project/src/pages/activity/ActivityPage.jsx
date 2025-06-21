import React, { useEffect, useState } from "react";
import axios from "../../axiosInstance";

export default function ActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");
    axios
      .get("/api/user/activity", { withCredentials: true })
      .then((res) => {
        if (isMounted) setActivity(res.data);
      })
      .catch((err) => {
        if (isMounted) setError("Failed to load activity.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-[#635bff] text-center">
        Your Recent Pledges
      </h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : activity.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No recent pledge activity.
        </div>
      ) : (
        <ul className="space-y-4">
          {activity.map((pledge, idx) => (
            <li
              key={idx}
              className="flex items-center bg-[#f6f9fc] rounded-lg p-4 border"
            >
              {pledge.campaignImage && (
                <img
                  src={pledge.campaignImage}
                  alt={pledge.campaignTitle}
                  className="w-16 h-16 object-cover rounded mr-4 border"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-lg text-[#635bff]">
                  {pledge.campaignTitle}
                </div>
                <div className="text-gray-600 text-sm">
                  Pledged{" "}
                  <span className="font-medium">{pledge.amount} AZN</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(pledge.pledgedAt).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

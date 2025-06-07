// src/pages/adminReview/AdminReviewDetail.jsx
import { useParams } from "react-router";

const AdminReviewDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Review Campaign ID: {id}</h1>
      {/* Later: Fetch campaign by ID and show Approve / Reject buttons */}
    </div>
  );
};

export default AdminReviewDetail;

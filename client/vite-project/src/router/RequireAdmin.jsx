import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const RequireAdmin = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  // Optionally, add a loading state if you fetch auth async
  if (user === undefined) return null; // Or a spinner

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;

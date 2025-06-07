import { useSelector } from "react-redux";
import { Navigate } from "react-router"; // react-router provides Navigate too

const RequireAdmin = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;

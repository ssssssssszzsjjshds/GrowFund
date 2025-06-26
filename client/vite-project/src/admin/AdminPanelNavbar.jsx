import { Link, useLocation } from "react-router";

const AdminPanelNavbar = () => {
  const location = useLocation();
  const navLinkClass = (path) =>
    `px-4 py-2 rounded transition font-semibold ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-blue-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="w-full border-b border-gray-200 bg-white flex items-center justify-between px-6 py-3 mb-6 shadow-sm">
      <div className="text-xl font-bold text-blue-700 tracking-wide flex gap-3">
        <Link to="/admin">Admin Panel</Link>
        <br />

        <Link to="/">Home</Link>
      </div>

      <div className="flex gap-3">
        <Link to="/admin/users" className={navLinkClass("/admin/users")}>
          View Users
        </Link>
        <Link to="/admin/review" className={navLinkClass("/admin/review")}>
          Review Pending Campaigns
        </Link>
      </div>
    </nav>
  );
};

export default AdminPanelNavbar;

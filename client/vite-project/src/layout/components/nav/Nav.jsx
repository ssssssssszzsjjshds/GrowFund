import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router"; // FIX: use react-router-dom, not "react-router"
import { logoutUser } from "../../../redux/slices/authSlice";
import styles from "./Nav.module.css";
import SearchBar from "../../../components/SearchBar";
import { categories } from "../../../../../../shared/categories";

const Nav = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handeLogout = () => {
    dispatch(logoutUser());
    navigate("/");

  };

  return (
    <nav>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          GrowFund
        </Link>
        <div className={styles.search}>
          <SearchBar />
        </div>
        <div className={styles.navRight}>
          {user ? (
            <>
              <span>
                Hello, <strong>{user.name}</strong>
              </span>
              <Link to="/my-campaigns" className={styles.myCampaigns}>
                My Campaigns
              </Link>
              <Link to="/saved-campaigns" className={styles.savedCampaigns}>
                Saved Campaigns
              </Link>
              <Link to = "/mock-payment">Mock Payment</Link>
              <button onClick={() => handeLogout()}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
      <div className={styles.categories}>
        <ul>
          <li>
            <Link to="/create-campaign">Create Campaign</Link>
          </li>
          <li>
            <Link to="/admin">Admin</Link>
          </li>
          <li>Category 3</li>
          <li>Category 4</li>
          <li>Category 5</li>
        </ul>
      </div>
      <div className="flex gap-2">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/?category=${encodeURIComponent(cat)}`}
            className="text-sm underline hover:text-yellow-300"
          >
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;

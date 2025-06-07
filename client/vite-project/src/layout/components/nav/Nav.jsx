import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router"; // FIX: use react-router-dom, not "react-router"
import { logout } from "../../../redux/slices/authSlice";
import styles from "./Nav.module.css";
import SearchBar from "../../../components/SearchBar";

const Nav = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
              <button onClick={() => dispatch(logout())}>Logout</button>
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
          <li><Link to="/create-campaign">Create Campaign</Link></li>
          <li>Category 2</li>
          <li>Category 3</li>
          <li>Category 4</li>
          <li>Category 5</li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

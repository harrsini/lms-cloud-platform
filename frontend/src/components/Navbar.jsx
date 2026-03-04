import logo from "../assets/psgrkcw-new-logo.png";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="main-header">
      <div className="header-content">

        {/* LEFT - LOGO */}
        <div className="logo-section">
          <img src={logo} alt="PSGR KCW Logo" className="college-logo" />
        </div>

        {/* RIGHT - NAVIGATION */}
        <div className="nav-links">

  {/* HOME - always visible */}
  <Link to="/">Home</Link>

  {role === "admin" ? (
    <>
      <Link to="/admin">Admin Panel</Link>

      <div className="profile-section">
        👤 {username}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </>
  ) : (
    <>
      {token && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/lms">LMS</Link>
        </>
      )}

      {token ? (
        <div className="profile-section">
          👤 {username}
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  )}

</div>

      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeLogo from "../assets/college-logo-2.jpg";
import API from "../api/axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);   
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);   // start loading

  try {
    const res = await API.post(`${role}/login/`, {
      username,
      password,
    });

    const { access, refresh } = res.data.tokens;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("role", role);

    if (role === "admin") {
      navigate("/admin");
    } else if (role === "faculty") {
      navigate("/faculty-dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    alert("Invalid credentials");
  } finally {
    setLoading(false);   // stop loading no matter what
  }
};

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="branding">
            <img
              src={collegeLogo}
              alt="College Logo"
              className="login-college-logo"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <div className="login-card">
            <h3 className="mb-4 text-center">Login</h3>

            <form onSubmit={handleLogin}>
              <select
                className="form-select mb-3"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>

              <input
                type="text"
                placeholder="Username"
                className="form-control mb-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {/* PASSWORD WITH EYE TOGGLE */}
              <div className="password-wrapper mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="forgot-password text-end mb-3">
                <a href="#">Forgot Password?</a>
              </div>

              <button
                  type="submit"
                  className="btn login-btn w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
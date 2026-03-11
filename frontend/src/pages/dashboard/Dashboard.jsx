import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "../admin/AdminDashboard";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const res = await API.get("/dashboard/");
        console.log("Dashboard API:", res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      }
    };

    fetchDashboard();

  }, []);

  if (error) return <p>{error}</p>;
  if (!data) return <p>Loading dashboard...</p>;

  // Handle backend error response
  if (data.error) {
    return (
      <div className="container mt-5">
        <h4>{data.error}</h4>
      </div>
    );
  }

  const role = (data.role || "").toLowerCase();

  if (role === "student") return <StudentDashboard data={data} />;
  if (role === "faculty") return <FacultyDashboard data={data} />;
  if (role === "admin") return <AdminDashboard data={data} />;

  return (
    <div className="container mt-5">
      <h4>Role not recognized</h4>
    </div>
  );

}
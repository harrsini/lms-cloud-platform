import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "../admin/AdminDashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("dashboard/")
      .then(res => setData(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  if (!data) return <p>Loading...</p>;

  if (data.role === "student") return <StudentDashboard data={data} />;
  if (data.role === "faculty") return <FacultyDashboard data={data} />;
  if (data.role === "admin") return <AdminDashboard data={data} />;
}

import { useEffect, useState } from "react";
import API from "../../api/axios";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "../admin/AdminDashboard";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard/")
      .then(res => {
        console.log("Dashboard API:", res.data);   // important
        setData(res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Unauthorized");
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  const role = data.role?.toLowerCase();

  if (role === "student") return <StudentDashboard data={data} />;
  if (role === "faculty") return <FacultyDashboard data={data} />;
  if (role === "admin") return <AdminDashboard data={data} />;

  return <p>Unknown role: {data.role}</p>;
}
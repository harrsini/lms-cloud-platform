import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUniversity
} from "react-icons/fa";

import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminDashboard() {

  const [analytics, setAnalytics] = useState(null);
  const [programChart, setProgramChart] = useState(null);
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const [analyticsRes, programRes, usersRes, noticesRes] =
        await Promise.all([
          API.get("admin/analytics/"),
          API.get("admin/students-per-program/"),
          API.get("admin/users/"),
          API.get("notices/")
        ]);

      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
      setNotices(noticesRes.data);

      buildChart(programRes.data);
      buildActivities(usersRes.data, noticesRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  const buildChart = (data) => {

    const labels = data.map(item => item.program);
    const values = data.map(item => item.students);

    setProgramChart({
      labels,
      datasets: [
        {
          label: "Students",
          data: values,
          backgroundColor: "#6a0dad",
          borderRadius: 6
        }
      ]
    });
  };

  const buildActivities = (users, notices) => {

    const userActivities = users.slice(0,4).map(u => ({
      text: `${u.username} joined as ${u.role}`
    }));

    const noticeActivities = notices.slice(0,2).map(n => ({
      text: `Admin posted notice "${n.title}"`
    }));

    const combined = [...noticeActivities, ...userActivities];

    setActivities(combined);
  };

  return (
    <div className="admin-dashboard">

      <h2 className="dashboard-title">Admin Dashboard</h2>

      {/* Analytics Cards */}
      <div className="analytics-grid">

        <div className="analytics-card students">
          <FaUserGraduate className="card-icon" />
          <h5>Students</h5>
          <h2>{analytics?.students ?? 0}</h2>
        </div>

        <div className="analytics-card faculty">
          <FaChalkboardTeacher className="card-icon" />
          <h5>Faculty</h5>
          <h2>{analytics?.faculty ?? 0}</h2>
        </div>

        <div className="analytics-card programs">
          <FaUniversity className="card-icon" />
          <h5>Programs</h5>
          <h2>{analytics?.programs ?? 0}</h2>
        </div>

      </div>

      {/* Bottom Dashboard Section */}
      <div className="dashboard-bottom">

        {/* Chart */}
        <div className="chart-card">
          <h4>Students per Program</h4>

          <div className="chart-wrapper">
            {programChart ? (
              <Bar data={programChart} options={chartOptions} />
            ) : (
              <p>Loading chart...</p>
            )}
          </div>
        </div>

        {/* Notices */}
        <div className="notice-card">
          <h4>📢 Recent Notices</h4>

          {notices.length === 0 ? (
            <p>No notices available</p>
          ) : (
            <ul className="notice-list">
              {notices.slice(0,5).map(notice => (
                <li key={notice.id}>
                  <strong>{notice.title}</strong>
                  <p>{notice.message}</p>
                </li>
              ))}
            </ul>
          )}

        </div>

        {/* Recent Activities */}
        <div className="activity-card">
          <h4>Recent Activities</h4>

          <ul className="activity-list">

            {activities.map((a, index) => (
              <li key={index}>
                <span className="activity-dot"></span>
                {a.text}
              </li>
            ))}

          </ul>

        </div>

      </div>

    </div>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 }
    }
  }
};
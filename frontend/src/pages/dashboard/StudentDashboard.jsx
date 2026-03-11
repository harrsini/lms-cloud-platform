import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function StudentDashboard({ data }) {

  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await API.get("/notices/");
        setNotices(res.data);
      } catch (err) {
        console.error("Failed to fetch notices", err);
      }
    };

    fetchNotices();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container my-5">

      <h3 className="fw-bold mb-4">Student Dashboard</h3>

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Total Subjects</h6>
            <h3>{data.total_subjects || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Total Assignments</h6>
            <h3>{data.total_assignments || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Submitted</h6>
            <h3>{data.submitted_assignments || 0}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-3">
            <h6>Pending</h6>
            <h3 className="text-danger">{data.pending_assignments || 0}</h3>
          </div>
        </div>

      </div>

      <div className="row">

        <div className="col-md-7">
          <h5 className="fw-bold">Your Subjects</h5>

          <ul className="list-group mt-3">
            {(data.subjects || []).map((sub) => (
              <li key={sub.id} className="list-group-item">
                {sub.subject_code} – {sub.subject_name}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm p-3">
            <h5 className="fw-bold">📢 Notices</h5>

            {notices.length === 0 ? (
              <p className="text-muted mt-2">No notices available</p>
            ) : (
              <ul className="list-group list-group-flush mt-2">
                {notices.slice(0,5).map((notice) => (
                  <li key={notice.id} className="list-group-item">
                    <strong>{notice.title}</strong>
                    <p className="mb-0 small">{notice.message}</p>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
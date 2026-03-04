import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AdminNotices() {

  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await API.get("notices/");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createNotice = async (e) => {
    e.preventDefault();

    try {
      await API.post("notices/create/", {
        title,
        message,
        target
      });

      setTitle("");
      setMessage("");

      fetchNotices();

    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`notices/delete/${id}/`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container my-5">

      <h2 className="fw-bold mb-4">Manage Notices</h2>

      {/* Create Notice */}
      <div className="card shadow-sm p-4 mb-4">

        <h5 className="mb-3">Create Notice</h5>

        <form onSubmit={createNotice}>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows="3"
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Target</label>
            <select
              className="form-select"
              value={target}
              onChange={(e)=>setTarget(e.target.value)}
            >
              <option value="all">All</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button className="btn btn-primary">
            Create Notice
          </button>

        </form>

      </div>

      {/* Existing Notices */}
      <div className="card shadow-sm p-4">

        <h5 className="mb-3">Existing Notices</h5>

        <ul className="list-group">

          {notices.map((notice)=>(
            <li
              key={notice.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >

              <div>
                <strong>{notice.title}</strong>
                <p className="mb-1">{notice.message}</p>
                <small className="text-muted">
                  Target: {notice.target}
                </small>
              </div>

              <button
                className="btn btn-sm btn-danger"
                onClick={()=>deleteNotice(notice.id)}
              >
                Delete
              </button>

            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}
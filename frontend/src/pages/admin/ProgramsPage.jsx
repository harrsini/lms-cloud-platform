import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  // ================= FETCH PROGRAMS =================
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await API.get("admin/programs/");
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    }
  };

  // ================= CREATE PROGRAM =================
  const createProgram = async () => {
    if (!name || !duration) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("admin/programs/", {
        name: name,
        duration_years: duration,
      });

      setName("");
      setDuration("");
      fetchPrograms(); // 🔥 live refresh
    } catch (err) {
      console.error("Failed to create program", err);
      alert("Creation failed");
    }
  };

  // ================= DELETE PROGRAM =================
  const deleteProgram = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`admin/programs/${id}/`);
      fetchPrograms(); // 🔥 live refresh
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Programs</h2>

      {/* CREATE FORM */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Create Program</h5>

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Duration (Years)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button className="btn btn-primary" onClick={createProgram}>
          Create Program
        </button>
      </div>

      {/* PROGRAM LIST TABLE */}
      <div className="card p-4 shadow-sm">
        <h5>All Programs</h5>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Duration (Years)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No programs found
                </td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.id}</td>
                  <td>{program.name}</td>
                  <td>{program.duration_years}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProgram(program.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
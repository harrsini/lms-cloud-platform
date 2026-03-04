import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function SemestersPage() {
  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [semesterNumber, setSemesterNumber] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");

  // ================= INITIAL FETCH =================
  useEffect(() => {
    fetchPrograms();
    fetchSemesters();
  }, []);

  const fetchPrograms = async () => {
    try {
      const res = await API.get("admin/programs/");
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await API.get("admin/semesters/");
      setSemesters(res.data);
    } catch (err) {
      console.error("Failed to fetch semesters", err);
    }
  };

  // ================= CREATE =================
  const createSemester = async () => {
    if (!semesterNumber || !selectedProgram) {
      alert("All fields required");
      return;
    }

    try {
      await API.post("admin/semesters/", {
        semester_number: semesterNumber,
        program_id: selectedProgram,
      });

      setSemesterNumber("");
      setSelectedProgram("");
      fetchSemesters(); // 🔥 live refresh
    } catch (err) {
      console.error("Failed to create semester", err);
      alert("Creation failed");
    }
  };

  // ================= DELETE =================
  const deleteSemester = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`admin/semesters/${id}/`);
      fetchSemesters(); // 🔥 live refresh
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Semesters</h2>

      {/* CREATE FORM */}
      <div className="card p-4 shadow-sm mb-4">
        <h5>Create Semester</h5>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Semester Number"
          value={semesterNumber}
          onChange={(e) => setSemesterNumber(e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
        >
          <option value="">Select Program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>

        <button className="btn btn-success" onClick={createSemester}>
          Create Semester
        </button>
      </div>

      {/* SEMESTER LIST */}
      <div className="card p-4 shadow-sm">
        <h5>All Semesters</h5>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Semester Number</th>
              <th>Program</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {semesters.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No semesters found
                </td>
              </tr>
            ) : (
              semesters.map((semester) => (
                <tr key={semester.id}>
                  <td>{semester.id}</td>
                  <td>{semester.semester_number}</td>
                  <td>{semester.program_name}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteSemester(semester.id)}
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
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [programs, setPrograms] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");

  useEffect(() => {
    fetchAll();
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

  const fetchAll = async () => {
    try {
      const [subRes, semRes, userRes] = await Promise.all([
        API.get("admin/subjects/"),
        API.get("admin/semesters/"),
        API.get("admin/users/")
      ]);

      setSubjects(subRes.data);
      setSemesters(semRes.data);
      setFacultyList(userRes.data.filter((u) => u.role === "faculty"));

    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const createSubject = async () => {
    if (!subjectCode || !subjectName || !selectedProgram || !selectedSemester || !selectedFaculty) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("admin/subjects/", {
        program: Number(selectedProgram),
        semester: Number(selectedSemester),
        faculty: Number(selectedFaculty),
        subject_code: subjectCode,
        subject_name: subjectName
      });

      setSubjectCode("");
      setSubjectName("");
      setSelectedProgram("");
      setSelectedSemester("");
      setSelectedFaculty("");

      fetchAll();

    } catch (err) {
      console.error("Create subject failed:", err.response?.data || err);
      alert("Failed to create subject");
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await API.delete(`admin/subjects/${id}/`);
      fetchAll();
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Subjects</h2>

      <div className="card p-4 shadow-sm mb-4">
        <h5>Create Subject</h5>

        <input
          className="form-control mb-2"
          placeholder="Subject Code"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={selectedProgram}
          onChange={(e) => {
            setSelectedProgram(e.target.value);
            setSelectedSemester("");
          }}
        >
          <option value="">Select Program</option>

          {programs.map((prog) => (
            <option key={prog.id} value={prog.id}>
              {prog.name}
            </option>
          ))}
        </select>

        <select
          className="form-control mb-2"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          disabled={!selectedProgram}
        >
          <option value="">Select Semester</option>

          {semesters
            .filter((sem) => Number(sem.program_id) === Number(selectedProgram))
            .map((sem) => (
              <option key={sem.id} value={sem.id}>
                Semester {sem.semester_number}
              </option>
            ))}
        </select>

        <select
          className="form-control mb-2"
          value={selectedFaculty}
          onChange={(e) => setSelectedFaculty(e.target.value)}
        >
          <option value="">Select Faculty</option>

          {facultyList.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {fac.username}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={createSubject}>
          Create Subject
        </button>
      </div>

      <div className="card p-4 shadow-sm">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Faculty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.id}</td>
                <td>{subject.subject_code}</td>
                <td>{subject.subject_name}</td>
                <td>{subject.semester_number}</td>
                <td>{subject.faculty_name || "-"}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSubject(subject.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
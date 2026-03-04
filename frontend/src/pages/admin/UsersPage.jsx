import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchSemesters();
    fetchPrograms();
    fetchSubjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
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

  const fetchPrograms = async () => {
    try {
      const res = await API.get("admin/programs/");
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await API.get("admin/subjects/");
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  const createUser = async () => {

    if (!username || !email || !password) {
      alert("All fields required");
      return;
    }

    if (role === "student" && !selectedSemester) {
      alert("Student must have semester");
      return;
    }

    if (role === "faculty" && (!selectedSemester || !selectedSubject)) {
      alert("Faculty must have semester and subject");
      return;
    }

    try {

      await API.post("admin/users/", {
        username,
        email,
        password,
        role,
        semester: role !== "admin" ? Number(selectedSemester) : null,
        subject: role === "faculty" ? Number(selectedSubject) : null
      });

      setUsername("");
      setEmail("");
      setPassword("");
      setSelectedProgram("");
      setSelectedSemester("");
      setSelectedSubject("");
      setRole("student");

      fetchUsers();

    } catch (err) {
      console.error("Create failed", err.response?.data || err);
      alert("Creation failed");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`admin/users/${id}/`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return "badge bg-danger";
      case "faculty":
        return "badge bg-primary";
      default:
        return "badge bg-success";
    }
  };

  return (
    <div>

      <h2 className="mb-4">Users</h2>

      <div className="card p-4 shadow-sm mb-4">

        <h5>Create User</h5>

        <input
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>

        {role !== "admin" && (
          <select
            className="form-control mb-2"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            <option value="">Select Program</option>

            {programs.map((prog) => (
              <option key={prog.id} value={prog.id}>
                {prog.name}
              </option>
            ))}
          </select>
        )}

        {role !== "admin" && (
          <select
            className="form-control mb-2"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setSelectedSubject("");
            }}
          >
            <option value="">Select Semester</option>

            {semesters
              .filter(
                (sem) =>
                  !selectedProgram ||
                  Number(sem.program_id) === Number(selectedProgram)
              )
              .map((sem) => (
                <option key={sem.id} value={sem.id}>
                  Semester {sem.semester_number}
                </option>
              ))}
          </select>
        )}

        {role === "faculty" && (
          <select
            className="form-control mb-2"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">Assign Subject</option>

            {subjects
              .filter(
                (sub) =>
                  !selectedSemester ||
                  Number(sub.semester) === Number(selectedSemester)
              )
              .map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_name}
                </option>
              ))}
          </select>
        )}

        <button className="btn btn-dark" onClick={createUser}>
          Create User
        </button>

      </div>

      <div className="card p-4 shadow-sm">

        <h5>All Users</h5>

        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Program</th>
              <th>Semester</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>

                <td>
                  <span className={roleBadge(user.role)}>
                    {user.role}
                  </span>
                </td>

                <td>{user.program || "-"}</td>
                <td>{user.semester || "-"}</td>
                <td>{user.subject || "-"}</td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteUser(user.id)}
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
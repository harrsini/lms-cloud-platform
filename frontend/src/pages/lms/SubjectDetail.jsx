import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { BASE_URL } from "../../api/axios";

export default function SubjectDetail() {

  const { id } = useParams();
  const role = localStorage.getItem("role");

  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = () => {
    API.get(`lms/materials/${id}/`)
      .then(res => setMaterials(res.data))
      .catch(err => console.error(err));

    API.get(`lms/assignments/${id}/`)
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err));
  };

  // ================= MATERIAL UPLOAD =================
  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      await API.post(`lms/materials/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Material uploaded successfully!");
      setTitle("");
      setFile(null);
      fetchData();

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // ================= CREATE ASSIGNMENT =================
  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    try {
      await API.post(`lms/assignments/${id}/`, {
        title: assignmentTitle,
        description: assignmentDescription,
        due_date: dueDate,
      });

      alert("Assignment created!");
      setAssignmentTitle("");
      setAssignmentDescription("");
      setDueDate("");
      fetchData();

    } catch (err) {
      console.error(err);
      alert("Failed to create assignment");
    }
  };

  // ================= SUBMIT ASSIGNMENT =================
  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionFile) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", submissionFile);

    try {
      await API.post(`lms/submit/${assignmentId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Assignment submitted!");
      setSubmissionFile(null);

    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  // ================= VIEW SUBMISSIONS =================
  const viewSubmissions = async (assignmentId) => {
    try {
      const res = await API.get(`lms/submissions/${assignmentId}/`);
      setSubmissions(res.data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load submissions");
    }
  };

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4">Subject LMS</h3>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-md-6">

          {role === "faculty" && (
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h6>Upload Study Material</h6>
              <form onSubmit={handleUpload}>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Material Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />

                <button className="btn btn-primary w-100">
                  Upload
                </button>
              </form>
            </div>
          )}

          <div className="card shadow-sm border-0 p-4">
            <h5>Study Materials</h5>
            {materials.length > 0 ? (
              <ul className="list-group">
                {materials.map((material) => (
                  <li key={material.id}
                      className="list-group-item d-flex justify-content-between">
                    {material.title}
                    <a
                      href={`${BASE_URL}${material.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No materials uploaded yet.</p>
            )}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h5>Assignments</h5>

            {role === "faculty" && (
              <form onSubmit={handleCreateAssignment} className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  required
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={assignmentDescription}
                  onChange={(e) => setAssignmentDescription(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
                <button className="btn btn-success w-100">
                  Create Assignment
                </button>
              </form>
            )}

            {assignments.length > 0 ? (
              <ul className="list-group">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="list-group-item">
                    <strong>{assignment.title}</strong>
                    <br />
                    <small>Due: {assignment.due_date}</small>

                    {role === "student" && (
                      <div className="mt-2">
                        <input
                          type="file"
                          className="form-control mb-2"
                          onChange={(e) => setSubmissionFile(e.target.files[0])}
                        />
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => handleSubmitAssignment(assignment.id)}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {role === "faculty" && (
                      <button
                        className="btn btn-outline-secondary btn-sm mt-2 w-100"
                        onClick={() => viewSubmissions(assignment.id)}
                      >
                        View Submissions
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No assignments created yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block"
             style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Student Submissions</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {submissions.length > 0 ? (
                  <ul className="list-group">
                    {submissions.map((submission) => (
                      <li key={submission.id}
                          className="list-group-item d-flex justify-content-between">
                        <div>
                          <strong>{submission.student_name}</strong>
                          <br />
                          <small>{submission.submitted_at}</small>
                        </div>
                        <a
                          href={`${BASE_URL}${submission.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary d-flex align-items-center gap-2 px-3"
                          style={{ borderRadius: "8px" }}
                        >
  ⬇
                          <span>Download</span>
                        </a>

                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No submissions yet.</p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

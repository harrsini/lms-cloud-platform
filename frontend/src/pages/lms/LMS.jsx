import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function LMS() {

  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("lms/subjects/")
      .then(res => {
        console.log("Subjects:", res.data);   // correct log
        setSubjects(res.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-5">

      <h3 className="fw-bold mb-4">Learning Management System</h3>

      <div className="row">

        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <div key={subject.id} className="col-md-6 mb-4">
              <div className="card shadow-sm p-4">

                <h5 className="fw-bold">
                  {subject.subject_code}
                </h5>

                <h6 className="text-muted">
                  {subject.subject_name}
                </h6>

                <p className="mb-2">
                  Faculty: {subject.faculty_name}
                </p>

                <div className="d-flex justify-content-between mt-3">
                  <span className="badge bg-primary">
                    Assignments: {subject.total_assignments}
                  </span>

                  <span className="badge bg-success">
                    Materials: {subject.total_materials}
                  </span>
                </div>

                <button
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                >
                  Open Subject
                </button>

              </div>
            </div>
          ))
        ) : (
          <p>No subjects available.</p>
        )}

      </div>
    </div>
  );
}

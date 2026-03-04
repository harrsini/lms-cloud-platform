export default function HomeContent() {
  return (
    <div className="container my-5">

      {/* Welcome Section */}
      <div className="text-center mb-5">
        <h3 className="fw-bold">Welcome to PSGR Krishnammal College for Women's E-Learning Portal!</h3>
        <p className="text-muted">
          A cloud-based academic and learning management system
          designed for students, faculty, and administrators.
        </p>
      </div>

      {/* Quick Feature Cards */}
      <div className="row text-center">

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5>Academics</h5>
            <p className="text-muted">
              View programs, semesters, and subject details.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5>LMS</h5>
            <p className="text-muted">
              Access study materials and assignments online.
            </p>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h5>Dashboard</h5>
            <p className="text-muted">
              Personalized role-based dashboard for all users.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

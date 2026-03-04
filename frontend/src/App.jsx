import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeContent from "./components/HomeContent";
import Footer from "./components/Footer";
import SubjectDetail from "./pages/lms/SubjectDetail";
import LMS from "./pages/lms/LMS";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProgramsPage from "./pages/admin/ProgramsPage";
import SemestersPage from "./pages/admin/SemestersPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import UsersPage from "./pages/admin/UsersPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminNotices from "./pages/admin/AdminNotices";

function LayoutWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-container">

      {/* Navbar ALWAYS visible */}
      <Navbar />

      {/* Main content grows and pushes footer down */}
      <div className="main-content">
        <Routes>

          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <HomeContent />
              </>
            }
          />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* LMS */}
          <Route path="/subjects/:id" element={<SubjectDetail />} />
          <Route path="/lms" element={<LMS />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="semesters" element={<SemestersPage />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="/admin/notices" element={<AdminNotices />} />
        </Routes>
      </div>

      {/* Hide Footer only on login */}
      {!isLoginPage && <Footer />}

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Programs", path: "/admin/programs" },
    { name: "Semesters", path: "/admin/semesters" },
    { name: "Subjects", path: "/admin/subjects" },
    { name: "Users", path: "/admin/users" },
    { name: "Notices", path: "/admin/notices" } // ⭐ NEW PAGE
  ];

  return (
    <div className="admin-wrapper">

      {/* Mobile Toggle */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>

        <h4 className="mb-4">Admin Panel</h4>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* Content Area */}
      <div className="admin-content">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;
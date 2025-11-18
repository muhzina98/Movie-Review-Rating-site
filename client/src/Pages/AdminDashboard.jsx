import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <nav className="flex gap-6 border-b border-gray-300 dark:border-gray-700 mb-6">
        {[
          { name: "Overview", path: "" },
          { name: "Manage Movies", path: "manage-movies" },
          { name: "Manage Users", path: "manage-users" },
          { name: "Manage Reviews", path: "manage-reviews" },
        ].map(({ name, path }) => (
          <NavLink
            key={name}
            to={`/admin-dashboard/${path}`}
            end={path === ""}
            className={({ isActive }) =>
              `pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-yellow-500 text-yellow-500"
                  : "text-gray-500 hover:text-yellow-500"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { useSearch } from "../context/SearchContext";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { searchQuery, handleChange } = useSearch();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Theme mode handler
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Hide header content on login/register pages
  const AUTH_HIDDEN = ["/login", "/register"].includes(location.pathname);

  // Prevent showing old user briefly
  if (loading) {
    return <header className="h-16 bg-white dark:bg-gray-900 shadow-md"></header>;
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold dark:text-white">
            🎬 MovieMark
          </Link>

          {/* SEARCH BAR (hide on login/register) */}
          {!AUTH_HIDDEN && (
            <div className="hidden md:flex w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={handleChange}
                placeholder="Search movies..."
                className="w-full px-4 py-2 rounded-full border bg-gray-100 dark:bg-gray-800"
              />
            </div>
          )}

          {/* RIGHT SIDE (Hide on login/register) */}
          {!AUTH_HIDDEN && (
            <div className="hidden md:flex items-center gap-4">

              {/* GUEST USER — Show Login & Register */}
              {!user && (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}

              {/* LOGGED-IN USER — Show avatar, name & logout */}
              {user && (
                <>
                  <div className="flex items-center gap-2">
                    {user.avathar ? (
                      <img src={user.avathar} className="w-8 h-8 rounded-full" />
                    ) : (
                      <UserCircle size={26} />
                    )}
                    <span>Hi, {user.name}</span>
                  </div>

                  {/* Logout button for all logged-in users */}
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-md flex items-center gap-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              )}

              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;

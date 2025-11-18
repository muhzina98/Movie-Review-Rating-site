import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const ThemeToggle = ({ theme, setTheme }) => {
  // sync theme immediately on load
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-yellow-400 dark:hover:bg-yellow-500 transition"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="text-white" size={18} />
      ) : (
        <Moon className="text-black" size={18} />
      )}
    </button>
  );
};

export default ThemeToggle;

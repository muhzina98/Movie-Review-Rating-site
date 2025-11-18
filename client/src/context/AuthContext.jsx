import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const AuthProvider = ({ children }) => {

  // ❗ FIXED: no localStorage initialization
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, { withCredentials: true });

      const u = res.data.user || res.data.data || null;

      setUser(u);

      // Update localStorage only AFTER fetch
      if (u) localStorage.setItem("user", JSON.stringify(u));
      else localStorage.removeItem("user");

    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/user/logout`, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

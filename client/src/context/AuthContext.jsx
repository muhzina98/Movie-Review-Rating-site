import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        withCredentials: true,
      });

      const u = res.data.user || res.data.data || null;
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      const u = res.data.user || res.data.data || null;
      setUser(u);

      return { success: true, user: u };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/user/logout`, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, fetchUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/user/profile");
      setUser(res.data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/user/login", { email, password });
      setUser(res.data.user || null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get("/user/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, fetchUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

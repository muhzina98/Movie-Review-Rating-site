import { useState } from "react";
import api from "../axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { setUser } = useAuth();

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", form);

      setMessage(res.data?.message || "Login successful!");
      setUser(res.data.user);

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          User Login
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm font-medium text-red-500 dark:text-red-400">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email ID"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
          Don’t have an account?
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-medium ml-1 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

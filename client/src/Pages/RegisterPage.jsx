import { useState } from "react";
import api from "../axios";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avathar: "",
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, avathar: file });
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    // ❗ Password check
    if (form.password !== form.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("email", form.email);
    fd.append("password", form.password);
    if (form.avathar) fd.append("avathar", form.avathar);

    try {
      const res = await api.post("/user/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to register");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Create Account
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm font-medium text-red-500 dark:text-red-400">
            {message}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* Profile Picture Preview (Round) */}
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <img
                src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
                alt="avatar"
              />
              <input
                type="file"
                name="avathar"
                className="hidden"
                accept="image/*"
                onChange={handleFile}
              />
            </label>
          </div>

          <input
            name="name"
            placeholder="Full Name"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password (min 6 char)"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={change}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring focus:ring-yellow-400 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-semibold transition"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium ml-1 hover:underline">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

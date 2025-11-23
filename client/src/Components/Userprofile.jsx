import { useState, useRef } from "react";
import { Camera, Edit3, Save, Crown } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user, setUser } = useAuth(); // ❌ removed BASE_URL

  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Profile preview
  const profilePic =
    selectedFile
      ? URL.createObjectURL(selectedFile)
      : user?.avathar ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // 🔥 FIXED — Payment using SAME DOMAIN = Cookies attach!
  const handlePrime = async () => {
    try {
      const res = await axios.post("/payment/create-checkout-session", {});
      window.location.href = res.data.url;
    } catch {
      alert("Unable to start Prime payment");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // 🔥 FIXED — Update profile using /api instead of BASE_URL
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (selectedFile) formData.append("avathar", selectedFile);

      const res = await axios.patch("/user/update", formData);

      const updatedUser = res.data.user;
      setUser(updatedUser);
      setIsEditing(false);
      setPassword("");
      setSelectedFile(null);
      alert("Profile updated ✔");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10 items-center md:items-start">
      {/* Profile Image */}
      <div className="relative w-40 h-40">
        <img
          src={profilePic}
          alt="Profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-md"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-2 right-2 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-full shadow-md"
        >
          <Camera size={18} className="text-black" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* User Info */}
      <div className="flex-1 text-center md:text-left">
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2 justify-center md:justify-start">
              {user.name}
              {user.isPrime && (
                <span className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                  <Crown size={16} /> PRIME
                </span>
              )}
            </h2>

            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="mt-3 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-semibold inline-block">
              {user.role?.toUpperCase()}
            </span>

            {!user.isPrime && (
              <button
                onClick={handlePrime}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold shadow"
              >
                Become PRIME ✨
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="mt-5 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-black font-semibold flex items-center gap-2 mx-auto md:mx-0 justify-center"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </>
        ) : (
          <form
            onSubmit={handleSaveProfile}
            className="space-y-4 w-full max-w-sm mx-auto md:mx-0"
          >
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-black font-semibold flex items-center gap-2"
              >
                <Save size={16} /> Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setPassword("");
                  setSelectedFile(null);
                }}
                className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

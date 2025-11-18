import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Film, Star, MessageSquare } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/stats`, {
          withCredentials: true,
        });
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500 dark:text-gray-300">Loading stats...</p>
      </div>
    );

  if (!stats)
    return (
      <div className="text-center text-red-500">Failed to load stats.</div>
    );

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-500" },
    { title: "Total Movies", value: stats.totalMovies, icon: Film, color: "bg-yellow-500" },
    { title: "Total Reviews", value: stats.totalReviews, icon: MessageSquare, color: "bg-green-500" },
    { title: "Average Rating", value: stats.avgRating, icon: Star, color: "bg-pink-500" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Admin Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center justify-center transition hover:scale-105"
          >
            <div
              className={`w-14 h-14 ${color} text-white rounded-full flex items-center justify-center mb-4`}
            >
              <Icon size={26} />
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;

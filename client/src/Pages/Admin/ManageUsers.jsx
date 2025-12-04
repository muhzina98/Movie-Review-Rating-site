import { useEffect, useState } from "react";
import api from "../../axios";
import { useAuth } from "../../context/AuthContext";

export default function ManageUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/allusers"); 
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const togglePrime = async (u, val) => {
    try {
      const res = await api.patch(
        `/admin/users/${u._id}/prime`,   
        { isPrime: val }
      );

      setUsers((prev) =>
        prev.map((p) => (p._id === u._id ? res.data.user : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (!user || user.role !== "admin")
    return <p className="p-6">Admin access only</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="space-y-4">
        {users.length === 0 && <p>No users yet</p>}

        {users.map((u) => ( 
          <div
            key={u._id}
            className="flex items-center justify-between bg-white p-4 rounded shadow"
          >
            <div>
              <div className="font-semibold">{u.name || u.email}</div>
              <div className="text-sm text-gray-500">{u.email}</div>
            </div>

            <div className="flex items-center gap-3">
              {u.isPrime ? (
                <span className="px-3 py-1 bg-yellow-400 text-black rounded">
                  PRIME
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-200 rounded">User</span>
              )}

              <button
                onClick={() => togglePrime(u, !u.isPrime)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {u.isPrime ? "Revoke Prime" : "Make Prime"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

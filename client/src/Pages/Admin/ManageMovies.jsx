import { useEffect, useState } from "react";
import api from "../../axios";
import { Plus, Trash2, Edit3, Film, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    synopsis: "",
    genres: "",
    releaseDate: "",
    runtime: "",
    director: "",
    cast: "",
    posterUrl: null,
    trailerUrl: null,
  });
  const [previewPoster, setPreviewPoster] = useState(null);
  const [previewTrailer, setPreviewTrailer] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { searchQuery } = useSearch();

  // Fetch all admin movies
  const fetchMovies = async () => {
    try {
      const res = await api.get("/admin/allmovies"); // 🔥 FIXED
      const data = res.data.movies || [];
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      console.error("Fetch movies error:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter by search bar
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    }
  }, [searchQuery, movies]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
      if (name === "posterUrl") setPreviewPoster(URL.createObjectURL(files[0]));
      if (name === "trailerUrl") setPreviewTrailer(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add or update movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editingId) {
        await api.patch(`/admin/updatemovie/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Movie updated successfully!");
      } else {
        await api.post("/admin/movies", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("🎬 Movie added successfully!");
      }

      resetForm();
      fetchMovies();
    } catch (error) {
      alert(error.response?.data?.message || "❌ Error saving movie");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      synopsis: "",
      genres: "",
      releaseDate: "",
      runtime: "",
      director: "",
      cast: "",
      posterUrl: null,
      trailerUrl: null,
    });
    setPreviewPoster(null);
    setPreviewTrailer(null);
    setEditingId(null);
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setForm({
      title: movie.title,
      synopsis: movie.synopsis,
      genres: movie.genres.join(", "),
      releaseDate: movie.releaseDate.split("T")[0],
      runtime: movie.runtime,
      director: movie.director,
      cast: movie.cast.join(", "),
      posterUrl: null,
      trailerUrl: null,
    });
    setPreviewPoster(movie.posterUrl);
    setPreviewTrailer(movie.trailerUrl);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await api.delete(`/admin/deletemovie/${id}`); // 🔥 FIXED
        alert("🗑️ Movie deleted successfully!");
        fetchMovies();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <Film className="text-yellow-500" /> Manage Movies
      </h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-5 mb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="🎬 Title" className="input" />
          <input name="director" value={form.director} onChange={handleChange} placeholder="🎥 Director" className="input" />
          <input name="genres" value={form.genres} onChange={handleChange} placeholder="🍿 Genres (comma separated)" className="input" />
          <input name="runtime" value={form.runtime} onChange={handleChange} placeholder="⏱ Runtime (mins)" className="input" />
          <input name="releaseDate" value={form.releaseDate} onChange={handleChange} type="date" className="input" />
          <input name="cast" value={form.cast} onChange={handleChange} placeholder="🎭 Cast (comma separated)" className="input" />
        </div>

        <textarea
          name="synopsis"
          value={form.synopsis}
          onChange={handleChange}
          placeholder="📝 Synopsis"
          className="input h-24"
        />

        <div className="grid grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Poster</label>
            <input type="file" name="posterUrl" accept="image/*" onChange={handleChange} className="input" />
            {previewPoster && <img src={previewPoster} className="w-32 h-32 mt-2 rounded-lg object-cover shadow" />}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trailer</label>
            <input type="file" name="trailerUrl" accept="video/*" onChange={handleChange} className="input" />
            {previewTrailer && <video src={previewTrailer} controls className="w-48 h-32 mt-2 rounded-lg shadow" />}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition"
          >
            {editingId ? "Update Movie" : "Add Movie"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-500 underline text-sm hover:text-gray-700"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700 text-left">
              <th className="p-3">Poster</th>
              <th className="p-3">Title</th>
              <th className="p-3">Director</th>
              <th className="p-3">Genres</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovies.map((movie) => (
              <tr key={movie._id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <td className="p-3">
                  <img src={movie.posterUrl} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="p-3 font-medium">{movie.title}</td>
                <td className="p-3">{movie.director}</td>
                <td className="p-3">{movie.genres.join(", ")}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => handleEdit(movie)} className="text-blue-500 hover:text-blue-700">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDelete(movie._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/admin-dashboard/movie/${movie._id}`)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMovies;

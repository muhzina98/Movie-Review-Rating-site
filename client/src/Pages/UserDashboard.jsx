import { useState, useEffect } from "react";
import { Filter, Star } from "lucide-react";
import axios from "axios";
import UserProfile from "../Components/Userprofile.jsx";
import { useSearch } from "../context/SearchContext.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const UserDashboard = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [myReviews, setMyReviews] = useState([]);

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // Fetch reviews
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/my-reviews`, { withCredentials: true })
      .then((res) => setMyReviews(res.data.reviews))
      .catch((err) => console.log("My reviews error:", err));
  }, []);

  // Fetch movies
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/movie`)
      .then((res) => {
        setMovies(res.data);
        setFilteredMovies(res.data);

        const uniqueGenres = [
          "All",
          ...new Set(res.data.flatMap((m) => m.genres || [])),
        ];
        setGenres(uniqueGenres);
      })
      .catch((err) => console.error("Movies fetch error:", err));
  }, []);

  // Filter movies
  useEffect(() => {
    let filtered = movies;

    if (selectedGenre !== "All") {
      filtered = filtered.filter((m) => m.genres?.includes(selectedGenre));
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [movies, selectedGenre, searchQuery]);

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold text-center">
          🎬 Welcome, {user.name.split(" ")[0]}!
        </h1>

        {/* Profile */}
        <UserProfile BASE_URL={BASE_URL} />

        {/* Movies */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Filter className="text-yellow-400" size={22} />
            <h3 className="text-xl font-semibold">🎞 Browse Movies by Genre</h3>
          </div>

          {/* Genre Buttons */}
          <div className="flex flex-wrap gap-2 mb-5">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full text-sm border transition ${
                  selectedGenre === genre
                    ? "bg-yellow-500 text-black"
                    : "border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentMovies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => navigate(`/movie/${movie._id}`)}
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:scale-105 transition"
              >
                <img
                  src={movie.posterUrl}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2">
                  <h4 className="font-semibold truncate">{movie.title}</h4>
                  <p className="text-gray-500 text-xs">
                    {movie.genres?.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* My Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Star className="text-yellow-400" size={22} />
            <h3 className="text-xl font-semibold">⭐ My Reviews</h3>
          </div>

          {myReviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {myReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex gap-4"
                >
                  <img
                    src={rev.movie.posterUrl}
                    className="w-20 h-28 object-cover rounded"
                  />

                  <div>
                    <h4 className="font-semibold">{rev.movie.title}</h4>
                    <p className="text-yellow-500 text-sm">⭐ {rev.rating}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {rev.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

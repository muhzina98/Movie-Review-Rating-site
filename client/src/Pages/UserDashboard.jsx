import { useState, useEffect } from "react";
import { Filter, Star } from "lucide-react";
import axios from "axios";
import UserProfile from "../Components/Userprofile.jsx";
import { useSearch } from "../context/SearchContext.jsx";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const UserDashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [genres, setGenres] = useState([]);

  const [myReviews, setMyReviews] = useState([]);

  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  //  Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // Fetch user profile
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/profile`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  // Fetch user reviews
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
        const data = res.data || [];
        setMovies(data);
        setFilteredMovies(data);

        const uniqueGenres = [
          "All",
          ...new Set(data.flatMap((m) => m.genres || [])),
        ];
        setGenres(uniqueGenres);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = movies;

    if (selectedGenre !== "All") {
      filtered = filtered.filter((m) => m.genres?.includes(selectedGenre));
    }

    if (searchQuery?.trim() !== "") {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    setCurrentPage(1); 

  }, [selectedGenre, searchQuery, movies]);

  //  Pagination Calculations
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Welcome */}
        <h1 className="text-3xl font-bold text-center">
          🎬 Welcome, {user?.name?.split(" ")[0] || "User"}!
        </h1>

        {/* User Profile */}
        <UserProfile user={user} setUser={setUser} BASE_URL={BASE_URL} />

        {/* Movie Filters */}
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
                className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
                  selectedGenre === genre
                    ? "bg-yellow-500 text-black"
                    : "bg-transparent border-gray-400 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentMovies.length > 0 ? (
              currentMovies.map((movie) => (
                <div
                  key={movie._id}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                  className="cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-2 text-sm">
                    <h4 className="font-semibold truncate">{movie.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {movie.genres?.join(", ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center col-span-full">
                No movies found.
              </p>
            )}
          </div>

          {/*  Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* My Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <Star className="text-yellow-400" size={22} />
            <h3 className="text-xl font-semibold">⭐ My Reviews</h3>
          </div>

          {myReviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              You haven’t reviewed any movies yet.
            </p>
          ) : (
            <div className="space-y-4">
              {myReviews.map((rev) => (
                <div
                  key={rev._id}
                  className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex gap-4"
                >
                  <img
                    src={rev.movie.posterUrl}
                    alt={rev.movie.title}
                    className="w-20 h-28 object-cover rounded"
                  />

                  <div>
                    <h4 className="font-semibold text-lg">
                      {rev.movie.title}
                    </h4>
                    <p className="text-sm text-yellow-500">⭐ {rev.rating}</p>
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

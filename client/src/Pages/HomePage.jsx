import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "../context/SearchContext";
import MovieCard from "../Components/MovieCard";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const { searchQuery, setSearchQuery } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 8;

  // 🟢 FIXED — NO BASE_URL
  useEffect(() => {
    axios
      .get("/movie") // backend route → /api/movie
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.movies || [];

        setMovies(data);
        setFilteredMovies(data);

        const allGenres = new Set();
        data.forEach((m) => {
          if (m.genres) m.genres.forEach((g) => allGenres.add(g.trim()));
        });
        setCategories(["All", ...Array.from(allGenres)]);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = movies;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((m) =>
        m.genres?.some(
          (g) => g.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    if ((searchQuery || "").trim() !== "") {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, movies]);

  // Pagination logic
  const indexLast = currentPage * moviesPerPage;
  const indexFirst = indexLast - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Banner */}
      <div
        className="w-full h-[400px] bg-cover bg-center flex items-end justify-start p-10"
        style={{
          backgroundImage:
            "url('https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2025/09/fileimage-2025-09-25t232754-1758823080.webp')",
        }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Discover Movies
        </h1>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto -mt-6 mb-10 px-4">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-full border dark:border-gray-700 bg-white dark:bg-gray-800 shadow text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-xl font-semibold mb-3">🎭 Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-yellow-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>

        {currentMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {currentMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No movies found.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
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
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

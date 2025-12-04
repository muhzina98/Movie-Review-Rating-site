import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../axios";
import ReviewSection from "../Components/ReviewSection";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect admin mode
  const isAdmin = location.pathname.startsWith("/admin-dashboard");

  // Fetch movie details
  useEffect(() => {
    api
      .get(`/movie/${id}`)  
      .then((res) => {
        // Backend returns either movie or { movie: {...} }
        const movieData = res.data.movie || res.data;
        setMovie(movieData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!movie) return <div className="text-center mt-10">Movie not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <img
          src={movie.posterUrl || "/placeholder.jpg"}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-xl shadow-lg object-cover"
        />

        {/* Movie Details */}
        <div className="flex-1 space-y-3">
          <h1 className="text-4xl font-bold text-yellow-500">{movie.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {movie.synopsis}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 dark:text-gray-300 mt-4">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
            <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toDateString()}</p>
            <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
            <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>
          </div>

          {movie.createdBy && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Uploaded by: <b>{movie.createdBy.name || "Admin"}</b>
            </p>
          )}

          {/* Back button for admin only */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin-dashboard/manage-movies")}
              className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition"
            >
              ← Back to Manage Movies
            </button>
          )}
        </div>
      </div>

      {/* Trailer */}
      {movie.trailerUrl ? (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-500">
            🎥 Watch Trailer
          </h2>
          <video controls className="w-full rounded-xl shadow-lg" src={movie.trailerUrl} />
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic mt-10">
          No trailer available
        </p>
      )}

      {/* Reviews — only for regular users */}
      {!isAdmin && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-500">⭐ Reviews</h2>
          <ReviewSection movieId={movie._id} />
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;

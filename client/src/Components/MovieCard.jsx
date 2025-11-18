import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie._id}`)}
      className="group shadow-md rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer bg-white dark:bg-gray-800"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-[380px] object-cover"
      />
      <div className="p-3">
        <h3 className="font-semibold text-lg">{movie.title}</h3>

        {/*  Rating */}
        {movie.avgRating !== undefined && (
          <p className="mt-1 text-yellow-500 text-sm">
            {"★".repeat(Math.floor(movie.avgRating))}
            {"☆".repeat(5 - Math.floor(movie.avgRating))}
            <span className="text-gray-500 dark:text-gray-400 ml-1 text-xs">
              {movie.avgRating.toFixed(1)}
            </span>
          </p>
        )}

        {/*  Synopsis */}
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
          {movie.synopsis}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

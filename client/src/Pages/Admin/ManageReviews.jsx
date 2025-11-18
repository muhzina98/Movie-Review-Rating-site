import { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, MessageSquare } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const ManageReviews = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [reviews, setReviews] = useState([]);

  //  Fetch all movies for dropdown
  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allmovies`, {
        withCredentials: true,
      });
      setMovies(res.data.movies || []);
    } catch (error) {
      console.error("Fetch movies error:", error);
    }
  };

  //  Fetch reviews for selected movie
  const fetchReviews = async (movieId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/allreviews/${movieId}`, {
        withCredentials: true,
      });
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);
    }
  };

  //  Delete review
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${BASE_URL}/api/admin/deletereview/${id}`, {
          withCredentials: true,
        });
        alert("Review deleted!");
        fetchReviews(selectedMovie);
      } catch (error) {
        console.error("Delete review error:", error);
      }
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <MessageSquare className="text-yellow-500" /> Manage Reviews
      </h2>

      {/* Movie Selector */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select a Movie:</label>
        <select
          value={selectedMovie}
          onChange={(e) => {
            setSelectedMovie(e.target.value);
            fetchReviews(e.target.value);
          }}
          className="w-full md:w-1/2 p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="">-- Choose Movie --</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews Table */}
      {selectedMovie && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-left">
                <th className="p-3">Reviewer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id} className="border-b dark:border-gray-700">
                    <td className="p-3 font-medium">{review.author?.name}</td>
                    <td className="p-3 flex items-center gap-1">
                      <Star className="text-yellow-400" size={16} />{" "}
                      {review.rating}
                    </td>
                    <td className="p-3">{review.comment}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan="4">
                    No reviews found for this movie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StarRating from "./StarRating";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const ReviewSection = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editing states
  const [editMode, setEditMode] = useState(null); // reviewId
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  const navigate = useNavigate();

  // CHECK IF USER LOGGED IN
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/user/profile`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // GET REVIEWS
  useEffect(() => {
    if (!user) return;

    axios
      .get(`${BASE_URL}/api/user/reviews/${movieId}`)
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => console.log(err));
  }, [movieId, user]);

  // SUBMIT REVIEW
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to post a review!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/user/addReview`,
        { movieId, rating, comment: text },
        { withCredentials: true }
      );

      setText("");
      setRating(5);

      const res = await axios.get(`${BASE_URL}/api/user/reviews/${movieId}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  // ENTER EDIT MODE
  const startEdit = (review) => {
    setEditMode(review._id);
    setEditText(review.comment);
    setEditRating(review.rating);
  };

  // UPDATE REVIEW
  const handleUpdateReview = async (reviewId) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/user/updateReview/${reviewId}`,
        { rating: editRating, comment: editText },
        { withCredentials: true }
      );

      // Update UI immediately
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? res.data.review : r))
      );

      setEditMode(null);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return null;

  // GUEST VIEW
  if (!user) {
    return (
      <div className="bg-gray-100 p-5 rounded-xl text-center">
        <p className="text-gray-600">
          Please <b>login</b> to view and post reviews.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-3 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review..."
          className="w-full p-3 rounded-lg"
          required
        />
        <StarRating rating={rating} setRating={setRating} />

        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold"
        >
          Submit
        </button>
      </form>

      {/* REVIEWS */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-700 p-4 rounded-xl"
            >
              {editMode === r._id ? (
                // ⭐ EDIT MODE
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 rounded"
                  />

                  <StarRating rating={editRating} setRating={setEditRating} />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateReview(r._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ⭐ NORMAL MODE
                <>
                  <div className="text-sm flex items-center gap-2">
                    <b>{r.author?.name || "Anonymous"}</b>
                    <span>rated</span>
                    <StarRating rating={r.rating} />
                  </div>

                  <p className="text-gray-600 mt-1">{r.comment}</p>

                  {/* EDIT BUTTON ONLY FOR OWNER */}
                  {r.author?._id === user._id && (
                    <button
                      onClick={() => startEdit(r)}
                      className="text-blue-500 text-sm mt-2 underline"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

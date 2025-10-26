const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");


const updateMovieStats = async (movieId) => {
  try {
    // Find all reviews for the movie
    const reviews = await Review.find({ movie: movieId });

    // Calculate average rating and count
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = reviews.length ? totalRating / reviews.length : 0;
    const reviewCount = reviews.length;

    // Update the movie document
    await Movie.findByIdAndUpdate(
      movieId,
      { avgRating, reviewCount },
      { new: true }
    );

    console.log(` Movie stats updated for ${movieId}`);
  } catch (error) {
    console.error(" Error updating movie stats:", error.message);
  }
};

module.exports = updateMovieStats;

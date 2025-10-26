const User = require('../models/userModel')
const Movie = require('../models/movieModel')
const Review = require('../models/reviewModel')
const updateMovieStats =require('../helpers/updateMovieStats')


//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

//delete user
const deleteUser = async (req, res) => {
  try {
    const userID = req.params?.userId
    if (!userID) {
      return res.status(400).json({ error: 'userID is required' })
    }
    const userData = await User.findByIdAndDelete(userID)
    if (!userData) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.log(error);

    res.status(error.status || 500).json({ error: error.message || "internal server error" })

  }

}
//create movies
const createMovie = async (req, res) => {
  try {


    //take movie details from request
    const { title, synopsis, genres, releaseDate, runtime, director, cast, posterUrl, trailerUrl } = req.body || {}

    //validation
    if (!title || !synopsis || !genres || !releaseDate || !runtime || !director || !cast) {
      return res.status(400).json({ message: 'All fields are required' });
    }



    //check if movie exist
    const movieExist = await Movie.findOne({ title })
    if (movieExist) {
      return res.status(400).json({ message: "Movie already exist" })
    }



    //movie creation
    const movie = new Movie({
      title, synopsis, genres, releaseDate, runtime, director, cast, posterUrl, trailerUrl,
      createdBy: req.user.id,
    });
    const savedMovie = await movie.save()

    //send response-created user
    return res.status(201).json({ message: "movie created successfully", savedMovie })


  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "internal server error" })

  }
}
//get all movies

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().populate('createdBy', 'name email');
    res.status(200).json({ message: 'Movies fetched successfully', movies });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};
//update movie

const updateMovie = async (req, res) => {
  try {
    const { title, synopsis, genres, releaseDate, runtime, director, cast, posterUrl, trailerUrl } = req.body || {}
    const { id } = req.params;
    const movieData = await Movie.findByIdAndUpdate(id, { title, synopsis, genres, releaseDate, runtime, director, cast, posterUrl, trailerUrl },
      { new: true, runValidators: true })
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    console.log("req.params:", req.params);
    if (!movieData) {
      return res.status(404).json({ error: "Movie not found" });
    }



    res.json({ data: movieData })

  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })

  }
}


//delete movie
const deleteMovie = async (req, res) => {
  try {
    const movieID= req.params?.id
            console.log("req.params:", req.params);

    if (!movieID) {
      return res.status(400).json({ error: 'movieId is required' })
    }
    const movieData = await Movie.findByIdAndDelete(movieID)
    if (!movieData) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    res.json({ message: "Movie deleted successfully" })
  } catch (error) {
    console.log(error);

    res.status(error.status || 500).json({ error: error.message || "internal server error" })

  }

}

//get all reviwes by movie
const getReviewsByMovie = async (req, res) => {
  try {
    const {movieId} = req.params;
    const reviews = await Review.find({ movie: movieId }).populate("author", "name email");
      

    res.json({ count: reviews.length, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }

};

//Delete Review 

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });

    

    await Review.findByIdAndDelete(reviewId);
    await updateMovieStats(review.movie);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { getAllUsers, deleteUser, createMovie, getAllMovies,
                   updateMovie,deleteMovie,getReviewsByMovie,deleteReview }
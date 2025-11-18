const User = require('../models/userModel')
const Movie = require('../models/movieModel')
const Review = require('../models/reviewModel')
const updateMovieStats =require('../helpers/updateMovieStats')
const fs = require('fs');

const {cloudinaryInstances} =require('../config/cloudinary')

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};



const toggleUserPrime = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isPrime = !!req.body.isPrime; // set to true/false from request
    if (user.isPrime) user.primeActivatedAt = new Date();
    else user.primeActivatedAt = null;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("toggleUserPrime:", err);
    res.status(500).json({ message: "Failed to update user" });
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
    const { title, synopsis, genres, releaseDate, runtime, director, cast } = req.body || {}
    

    //validation
    if (!title || !synopsis || !genres || !releaseDate || !runtime || !director || !cast) {
      return res.status(400).json({ message: 'All fields are required' });
    }



    //check if movie exist
    const movieExist = await Movie.findOne({ title })
    if (movieExist) {
      return res.status(400).json({ message: "Movie already exist" })
    }

     
    const posterFile = req.files?.posterUrl?.[0];
    const trailerFile = req.files?.trailerUrl?.[0];

    console.log("Poster file:", posterFile);
console.log("Trailer file:", trailerFile);


    let posterUpload = null;
    let trailerUpload = null;

    //  upload poster if exists
    if (posterFile) {
      try {
        posterUpload = await cloudinaryInstances.uploader.upload(posterFile.path, {
               resource_type: 'image', 
 
        });
      } finally {
        fs.unlinkSync(posterFile.path); 
      }
    }

    // upload trailer if exists
    if (trailerFile) {
      try {
        trailerUpload = await cloudinaryInstances.uploader.upload(trailerFile.path, {
               resource_type: 'video', // ✅ Forces Cloudinary to treat it as image

        });
      } finally {
        fs.unlinkSync(trailerFile.path); // always remove temp file
      }
    }

    //movie creation
    const movie = new Movie({
      title, synopsis,       genres: Array.isArray(genres) ? genres : genres.split(','),
      releaseDate, runtime, director,      
     cast: Array.isArray(cast) ? cast : cast.split(','),
      posterUrl: posterUpload?.secure_url || null,
       trailerUrl: trailerUpload?.secure_url || null,

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
 //get movie by id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
//update movie

const updateMovie = async (req, res) => {
  try {
    const { title, synopsis, genres, releaseDate, runtime, director, cast } = req.body;
    const { id } = req.params;

     const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }


     const posterFile = req.files?.posterUrl?.[0];
    const trailerFile = req.files?.trailerUrl?.[0];

    let posterUrl = existingMovie.posterUrl;
    let trailerUrl = existingMovie.trailerUrl;

     // 🎞️ Upload new poster (if provided)
    if (posterFile) {
      try {
        const uploadedPoster = await cloudinaryInstances.uploader.upload(posterFile.path, {
          resource_type: "image",
        });
        posterUrl = uploadedPoster.secure_url;
      } catch (error) {
       // console.error("Poster upload failed:", error);
        return res.status(400).json({ message: "Invalid image file or Cloudinary error"});
      } finally {
        fs.unlinkSync(posterFile.path);
      }
    }

    // 🎬 Upload new trailer (if provided)
    if (trailerFile) {
      try {
        const uploadedTrailer = await cloudinaryInstances.uploader.upload(trailerFile.path, {
         
          resource_type: "video",
        });
        trailerUrl = uploadedTrailer.secure_url;
      } catch (error) {
        //console.error("Trailer upload failed:", error);
        return res.status(400).json({ message: "Invalid video file or Cloudinary error"});
      } finally {
        fs.unlinkSync(trailerFile.path);
      }
    }

    const updateData = {
      title: title || existingMovie.title,
      synopsis: synopsis || existingMovie.synopsis,
      genres: genres ? (Array.isArray(genres) ? genres : genres.split(",")) : existingMovie.genres,
      releaseDate: releaseDate || existingMovie.releaseDate,
      runtime: runtime || existingMovie.runtime,
      director: director || existingMovie.director,
      cast: cast || existingMovie.cast,
      posterUrl,
      trailerUrl,
    };

    const movieData = await Movie.findByIdAndUpdate(id,updateData, { new: true, runValidators: true })
    // console.log("req.user:", req.user);
    // console.log("req.body:", req.body);
    // console.log("req.params:", req.params);
    
res.status(200).json({
      message: "Movie updated successfully",
      data: movieData,
    });
  }
  catch(error){
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

const getDashboardStats = async (req, res) => {
 try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();

    const avgRatingData = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = avgRatingData[0]?.avgRating || 0;

    res.json({
      message: "Dashboard stats fetched successfully",
      stats: { totalUsers, totalMovies, totalReviews, avgRating },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { getAllUsers,toggleUserPrime, deleteUser, createMovie, getAllMovies,getMovieById,
                   updateMovie,deleteMovie,getReviewsByMovie,deleteReview,  getDashboardStats,
 }
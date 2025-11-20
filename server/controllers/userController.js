const User = require('../models/userModel')
const Movie = require('../models/movieModel')
const Review = require('../models/reviewModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
const updateMovieStats = require('../helpers/updateMovieStats')

const { cloudinaryInstances } = require('../config/cloudinary')
const upload = require('../middlewares/multer')
const userRegister = async (req, res) => {
  //connect to DB

  try {

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const ADMIN_EMAILS = ['admin@example.com'];

    //take user details from request
    const { name, email, password } = req.body || {}

    //validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const file = req.file

    const cloudinaryResponse = await cloudinaryInstances.uploader.upload(file.path)
    console.log(cloudinaryResponse)


    //check if user exist
    const userExist = await User.findOne({ email })
    if (userExist) {
      return res.status(400).json({ message: "user already exist" })
    }

    //bcrypt-hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    //console.log(hashedPassword)
    //Assign role
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';


    //user creation
    const newUser = new User({ name, email, password: hashedPassword, avathar: cloudinaryResponse.url, role })
    const savedUser = await newUser.save()

    //send response-created user
    return res.status(201).json({ message: "user created", savedUser })


  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "internal server error" })

  }

}

const userLogin = async (req, res) => {

  try {

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    //take user details from request
    const { email, password } = req.body || {}

    //validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }


    //check if useris not exist
    const userExist = await User.findOne({ email })
    if (!userExist) {
      return res.status(400).json({ message: "user not exist" })
    }

    //password compare
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Not a Valid Password' });
    }

    const userObject = userExist.toObject();
    delete userObject.password;
    //create Token
    const token = createToken(userExist._id, userExist.email, userExist.role)


    const isProd = process.env.NODE_ENV === "PRODUCTION";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });



    return res.status(200).json({ message: "Login Successful", user: userObject })


  } catch (error) {

    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "internal server error" })

  }
}


const checkUser = async (req, res) => {
  try {

    res.json({ message: "User Authorized", loggedinUser: req.user.id })
  } catch (error) {
    console.log(error);

    res.status(error.status || 500).json({ error: error.message || "internal server error" })


  }
}
const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avathar: user.avathar ? `${process.env.BASE_URL}/${user.avathar}` : null,
      }
    });

  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    const userId = req.user.id;
    let updateFields = { name, email };

    //  Handle avatar upload if exists
    if (req.file) {
      updateFields.avathar = `/uploads/${req.file.filename}`;
    }

    // ✅Re-hash password only if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Update user in DB
    const userData = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    res.json({ data: userData });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};
//logout
const logout = async (req, res) => {
  try {

    res.clearCookie('token')
    res.json({ message: "User logout Successfully" })

  } catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })

  }
}




//add Review

const addReview = async (req, res) => {

  try {
    const userId = req.user.id
    const { movieId, rating, comment } = req.body
    if (!movieId || !rating) {

      return res.status(400).json({ error: "MovieId and rating are required" })
    }

    //check if movie exists
    const movie = await Movie.findById(movieId)
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" })
    }

    //check if user already has a review
    const existingReview = await Review.findOne({ movie: movieId, author: userId })
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this movie" });

    }

    //create a new review

    const newReview = new Review({ movie: movieId, author: userId, rating, comment })
    await newReview.save()

    //update movie status

    await updateMovieStats(movieId);

    res.status(201).json({
      message: "Review added successfully",
      review: newReview
    });


  }
  catch (error) {
    console.log(error)
    res.status(error.status || 500).json({ error: error.message || "Internal server error" })


  }
}

const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const { rating, comment } = req.body;

    // Find the review by id and author
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Prevent editing someone else's review
    if (review.author.toString() !== userId) {
      return res.status(403).json({ error: "Not allowed to edit this review" });
    }

    // Update review fields
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();
    const updatedReview = await Review.findById(reviewId)
      .populate("author", "name email");

    // Update movie stats
    await updateMovieStats(review.movie);

    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId })
      .populate("author", "name");

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ author: userId })
      .populate("movie", "title posterUrl");

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user reviews" });
  }
};








module.exports = { userRegister, userLogin, checkUser, userProfile, updateUser, logout, addReview, updateReview, getReviewsByMovie, getMyReviews }
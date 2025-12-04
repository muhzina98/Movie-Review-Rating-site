const User = require('../models/userModel');
const Movie = require('../models/movieModel');
const Review = require('../models/reviewModel');
const bcrypt = require('bcrypt');
const createToken = require('../utils/generateToken');
const updateMovieStats = require('../helpers/updateMovieStats');
const { cloudinaryInstances } = require('../config/cloudinary');

const isProd = process.env.NODE_ENV === "PRODUCTION";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 1000,
  };
}


// ------------------- REGISTER -------------------
const userRegister = async (req, res) => {
  try {
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const ADMIN_EMAILS = ["admin@example.com"];

    const { name, email, password, confirmPassword } = req.body || {};

    //  Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    //  Password length check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //  Confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //  Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Upload avatar if provided
    let avatarUrl = undefined;
    if (req.file) {
      const cloudinaryResponse = await cloudinaryInstances.uploader.upload(
        req.file.path
      );
      avatarUrl = cloudinaryResponse.secure_url;
    }

    //  Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //  Assign role if email matches admin
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      avathar: avatarUrl,
      role,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        avathar: savedUser.avathar,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};
// ------------------- LOGIN -------------------
const userLogin = async (req, res) => {
  try {
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: 'User not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Not a valid password' });
    }

    const userObject = userExist.toObject();
    delete userObject.password;

    const token = createToken(userExist._id, userExist.email, userExist.role);


    res.cookie('token', token, cookieOptions());

    return res.status(200).json({ message: 'Login Successful', user: userObject });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'internal server error' });
  }
};

// ------------------- CHECK USER -------------------
const checkUser = async (req, res) => {
  try {
    res.json({ message: 'User Authorized', loggedinUser: req.user.id });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'internal server error' });
  }
};

// ------------------- PROFILE -------------------
const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('PROFILE ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- UPDATE USER -------------------
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body || {};

    // Build update object safely
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // Avatar via Cloudinary
    if (req.file) {
      const cloudinaryResponse = await cloudinaryInstances.uploader.upload(
        req.file.path
      );
      updateFields.avathar = cloudinaryResponse.secure_url;
    }

    // New password (if provided)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }


    // 🟡 Only regenerate token if email changed
    if (email && email !== req.user.email) {
      const newToken = createToken(
        updatedUser._id,
        updatedUser.email,
        updatedUser.role
      );

      res.cookie('token', newToken, cookieOptions());
    }

    res.json({ user: updatedUser });
  } catch (error) {
    console.log('UPDATE ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- LOGOUT -------------------
const logout = async (req, res) => {
  try {
   res.clearCookie("token", {
  path: "/",
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
});

    res.json({ message: 'User logout Successfully' });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal server error' });
  }
};

// ------------------- ADD REVIEW -------------------
const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movieId, rating, comment } = req.body;

    if (!movieId || !rating) {
      return res
        .status(400)
        .json({ error: 'MovieId and rating are required' });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const existingReview = await Review.findOne({
      movie: movieId,
      author: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: 'You have already reviewed this movie' });
    }

    const newReview = new Review({ movie: movieId, author: userId, rating, comment });
    await newReview.save();

    await updateMovieStats(movieId);

    res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
    });
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json({ error: error.message || 'Internal server error' });
  }
};

// ------------------- UPDATE REVIEW -------------------
const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.author.toString() !== userId) {
      return res
        .status(403)
        .json({ error: 'Not allowed to edit this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    const updatedReview = await Review.findById(reviewId).populate(
      'author',
      'name email'
    );

    await updateMovieStats(review.movie);

    res
      .status(200)
      .json({ message: 'Review updated successfully', review: updatedReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ------------------- GET REVIEWS BY MOVIE -------------------
const getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.find({ movie: req.params.movieId }).populate(
      'author',
      'name'
    );

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// ------------------- GET MY REVIEWS -------------------
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ author: userId }).populate(
      'movie',
      'title posterUrl'
    );

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user reviews' });
  }
};

module.exports = {
  userRegister,
  userLogin,
  checkUser,
  userProfile,
  updateUser,
  logout,
  addReview,
  updateReview,
  getReviewsByMovie,
  getMyReviews,
};

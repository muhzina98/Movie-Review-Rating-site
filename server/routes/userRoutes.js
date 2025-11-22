const express = require('express');
const userRouter = express.Router();
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');
const {
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
} = require('../controllers/userController');

const upload = require('../middlewares/multer');

// Register
userRouter.post('/register', upload.single('avathar'), userRegister);

// Login
userRouter.post('/login', userLogin);

// Check user
userRouter.get('/check-user', authUser, checkUser);

// Profile
userRouter.get('/profile', authUser, userProfile);

// ✅ Update user (auth FIRST, then file upload)
userRouter.patch('/update', authUser, upload.single('avathar'), updateUser);

// Logout
userRouter.get('/logout', logout);

// Review add & update
userRouter.post('/addReview', authUser, addReview);
userRouter.patch('/updateReview/:id', authUser, updateReview);

// Public movie reviews
userRouter.get('/reviews/:movieId', getReviewsByMovie);

// My reviews
userRouter.get('/my-reviews', authUser, getMyReviews);

module.exports = userRouter;

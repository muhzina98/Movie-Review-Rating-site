const express = require('express')
const adminRouter =  express.Router()
const authAdmin = require('../middlewares/authAdmin');
const { getAllUsers,deleteUser, createMovie, getAllMovies, updateMovie, deleteMovie, getReviewsByMovie, deleteReview, getMovieById, getDashboardStats, toggleUserPrime } = require('../controllers/adminController');

const upload =require('../middlewares/multer')


//http://localhost:3001/api/admin


adminRouter.get('/allusers', authAdmin, getAllUsers);

adminRouter.patch("/users/:id/prime", authAdmin, toggleUserPrime);

// deleteUser-admin
adminRouter.delete('/delete/:userId',authAdmin,deleteUser);

//movie

adminRouter.post('/movies', authAdmin,upload.fields([
    { name: 'posterUrl', maxCount: 1 },
    { name: 'trailerUrl', maxCount: 1 }
  ]), createMovie);

adminRouter.get('/allmovies', authAdmin, getAllMovies);

adminRouter.get("/movies/:id", authAdmin, getMovieById);


 adminRouter.patch('/updatemovie/:id', authAdmin,upload.fields([
    { name: "posterUrl", maxCount: 1 },
    { name: "trailerUrl", maxCount: 1 },
  ]), updateMovie);
  
adminRouter.delete('/deletemovie/:id', authAdmin, deleteMovie);

//Review

adminRouter.get('/allReviews/:movieId',authAdmin,getReviewsByMovie)
adminRouter.delete('/deletereview/:id',authAdmin,deleteReview)

//dashBoard status
adminRouter.get("/stats", authAdmin, getDashboardStats);






module.exports= adminRouter
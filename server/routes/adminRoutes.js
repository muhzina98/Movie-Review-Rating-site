const express = require('express')
const adminRouter =  express.Router()
const authAdmin = require('../middlewares/authAdmin');
const { getAllUsers,deleteUser, createMovie, getAllMovies, updateMovie, deleteMovie, getReviewsByMovie, deleteReview } = require('../controllers/adminController');




//http://localhost:3001/api/admin


adminRouter.get('/allusers', authAdmin, getAllUsers);
// deleteUser-admin
adminRouter.delete('/delete/:userId',authAdmin,deleteUser);

//movie

adminRouter.post('/movies', authAdmin, createMovie);
adminRouter.get('/allmovies', authAdmin, getAllMovies);
 adminRouter.patch('/updatemovie/:id', authAdmin, updateMovie);
adminRouter.delete('/deletemovie/:id', authAdmin, deleteMovie);

//Review

adminRouter.get('/allReviews/:movieId',authAdmin,getReviewsByMovie)
adminRouter.delete('/deletereview/:id',authAdmin,deleteReview)











module.exports= adminRouter
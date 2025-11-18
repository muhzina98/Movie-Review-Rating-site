const express = require('express')
const userRouter =  express.Router()
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')


const { userRegister, userLogin,checkUser,userProfile ,updateUser, logout, addReview, updateReview, getAllMoviesPublic, getMovieById, getReviewsByMovie, getMyReviews} = require('../controllers/userController')
const upload = require('../middlewares/multer')

//signup
//http://localhost:3001/api/user/register

userRouter.post('/register',upload.single('avathar'),userRegister)
userRouter.post('/login',userLogin)
//check-user
userRouter.get('/check-user',authUser,checkUser)
//profile
userRouter.get('/profile',authUser,userProfile)
//updateUser
userRouter.patch('/update',authUser,upload.single('avathar'),updateUser)

//logout
userRouter.get('/logout',logout)
// //public route for movies(no auth)
// userRouter.get('/', getAllMoviesPublic);
// userRouter.get('/:id', getMovieById);



//Review add and update
userRouter.post('/addReview',authUser,addReview)
userRouter.patch('/updateReview/:id',authUser,updateReview)

// get reviews for a movie (public)
userRouter.get('/reviews/:movieId', getReviewsByMovie);

userRouter.get("/my-reviews", authUser, getMyReviews);







module.exports= userRouter
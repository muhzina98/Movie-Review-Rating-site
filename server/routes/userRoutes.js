const express = require('express')
const userRouter =  express.Router()
const authUser = require('../middlewares/authUser')
const authAdmin = require('../middlewares/authAdmin')


const { userRegister, userLogin,checkUser,userProfile ,updateUser, logout, addReview, updateReview} = require('../controllers/userController')


//signup
//http://localhost:3001/api/user/register

userRouter.post('/register',userRegister)
userRouter.post('/login',userLogin)
//check-user
userRouter.get('/check-user',authUser,checkUser)
//profile
userRouter.get('/profile',authUser,userProfile)
//updateUser
userRouter.patch('/update',authUser,updateUser)

//logout
userRouter.get('/logout',logout)
//Review add and update
userRouter.post('/addReview',authUser,addReview)
userRouter.patch('/updateReview/:id',authUser,updateReview)







module.exports= userRouter
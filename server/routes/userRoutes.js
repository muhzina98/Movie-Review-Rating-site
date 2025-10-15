const express = require('express')
const { userRegister, userLogin } = require('../controllers/userController')
const userRouter =  express.Router()


//signup
//http://localhost:3001/api/user/register

userRouter.post('/register',userRegister)
userRouter.post('/login',userLogin)




module.exports= userRouter
const express = require('express')
const { userRegister, userLogin, userLogout } = require('../controllers/userController')
const userRouter =  express.Router()


//signup
//http://localhost:3001/api/user/register

userRouter.post('/register',userRegister)
userRouter.post('/login',userLogin)

userRouter.post('/logout',userLogout)



module.exports= userRouter
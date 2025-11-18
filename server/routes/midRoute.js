const express =require('express')
const router = express.Router()
const userRouter= require('./userRoutes')
const adminRouter = require('./adminRoutes')
const movieRouter = require('./movieRoutes')
const paymentRouter = require('./paymentRoutes')



//http://localhost:3001/api/user
router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/movie',movieRouter)
router.use('/payment',paymentRouter)





module.exports=router
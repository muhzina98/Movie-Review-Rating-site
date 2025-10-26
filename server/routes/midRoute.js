const express =require('express')
const router = express.Router()
const userRouter= require('./userRoutes')
const adminRouter = require('./adminRoutes')



//http://localhost:3001/api/user
router.use('/user',userRouter)
router.use('/admin',adminRouter)




module.exports=router
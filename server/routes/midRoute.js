const express =require('express')
const router = express.Router()
const userRouter= require('./userRoutes')



//http://localhost:3001/api/user
router.use('/user',userRouter)




module.exports=router
const jwt = require('jsonwebtoken')
const authUser =  (req,res,next)=>{

    try {
        //logged in user
            //console.log(req.cookies)
        const {token}= req.cookies
        if(!token){
            return res.status(401).json({error:"User not authorized"})
        }

        const decodedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken){
             return res.status(401).json({error:"User not Authorized"})
        }
         req.user=decodedToken

        next()
    } catch (error) {

        console.log(error);
    
        
        
    }
}
module. exports = authUser
const jwt = require('jsonwebtoken')
const authUser =  (req,res,next)=>{

    try {
        //logged in user
            //console.log(req.cookies)
        const token= req.cookies.token
        if(!token){
            return res.status(401).json({error:"User not authorized"})
        }

        const decodedToken =jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decodedToken){
             return res.status(401).json({error:"User not Authorized"})
        }
          req.user = {
      id: decodedToken.id || decodedToken._id,
     _id: decodedToken.id || decodedToken._id,  
      email: decodedToken.email,
      role: decodedToken.role,
    };


        next()
    } catch (error) {

console.error("authUser error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });    
        
        
    }
}
module. exports = authUser
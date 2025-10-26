const User = require('../models/userModel')
const Movie= require('../models/movieModel')
const Review = require('../models/reviewModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
const updateMovieStats = require('../helpers/updateMovieStats')
const userRegister = async (req, res) => {
    //connect to DB

    try {
           
        const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
         
        const ADMIN_EMAILS = ['admin@example.com'];

         //take user details from request
        const { name, email, password,avathar } = req.body || {}
       
        //validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }


        //check if user exist
        const userExist=await User.findOne({email})
        if (userExist) {
            return res.status(400).json({ message: "user already exist" })
        }

        //bcrypt-hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        //console.log(hashedPassword)
    //Assign role
            const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';


        //user creation
        const newUser=new User({name,email,password:hashedPassword,avathar,role})
        const savedUser= await newUser.save()

        //send response-created user
        return res.status(201).json({message:"user created",savedUser})

        
    } catch (error) {
        console.log(error)
        res.status(error.status|| 500).json({error:error.message|| "internal server error"})

    }

}

const userLogin = async(req,res)=>{

    try {
        
         const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

         //take user details from request
        const { email, password} = req.body || {}
       
        //validation
        if ( !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }


        //check if useris not exist
        const userExist=await User.findOne({email})
        if (!userExist) {
            return res.status(400).json({ message: "user not exist" })
        }

        //password compare
        const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({error: 'Not a Valid Password' });
    }

    const userObject = userExist.toObject();
    delete userObject.password;
    //create Token
    const token =createToken(userExist._id,userExist.role)
    res.cookie('token',
        token,
        {
            httpOnly:true,
            secure:process.env.NODE_ENV==="PRODUCTION",
            sameSite:"Strict",
            maxAge:60*60*1000

        })
        return res.status(200).json({message:"Login Successful",user:userObject})


    } catch (error) {
        
         console.log(error)
        res.status(error.status|| 500).json({error:error.message|| "internal server error"})

    }
}


const checkUser =async(req,res)=>{
    try {
        
        res.json({message:"User Authorized",loggedinUser:req.user.id})
    } catch (error) {
        console.log(error);

        res.status(error.status|| 500).json({error:error.message||"internal server error"})
        
        
    }
}
const userProfile = async(req,res)=>{

    try {
        
        const userId =req.user.id
        //field projection
        const userData = await User.findById(userId).select("-password")
        res.json({data:userData})
    } catch (error) {
         console.log(error);

        res.status(error.status|| 500).json({error:error.message||"internal server error"})
        
    }

}
const updateUser = async(req,res)=>{
    try {
        const {name,email,password,avathar} = req.body|| {}
        const userId = req.user.id
         const userData = await User.findByIdAndUpdate(userId,{name,email,password,avathar},{new:true})
         res.json({data:userData})
        
    } catch (error) {
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
        
    }
}
 //logout
 const logout = async(req,res)=>{
    try {
        
        res.clearCookie('token')
            res.json({message:"User logout Successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
        
    }
 }

 //add Review

 const addReview = async(req,res)=>{

    try {
        const  userId =req.user.id
        const {movieId,rating,title,body} = req.body
        if(!movieId || !rating){

            return res.status(400).json({error: "MovieId and rating are required"})
        }

        //check if movie exists
        const movie = await Movie.findById(movieId)
        if(!movie){
            return res.status(404).json({error: "Movie not found"})
        }

        //check if user already has a review
        const existingReview = await Review.findOne({movie:movieId,author:userId})
        if(existingReview){
            return res.status(400).json({error:"You have already reviewed this movie" });
 
        }

        //create a new review

        const newReview = new Review({ movie: movieId, author: userId,rating,title, body})
        await newReview .save()

        //update movie status

        await updateMovieStats(movieId);

     res.status(201).json({ message: "Review added successfully", 
        review: newReview });
 
        
    } 
    catch (error) {
         console.log(error)
        res.status(error.status||500).json({error:error.message||"Internal server error"})
        
        
    }
 }

 const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const {  rating, title, body } = req.body;

    // Find the review by id and author
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    

    // Update review fields
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.body = body || review.body;

    await review.save();

    // Update movie stats
    await updateMovieStats(review.movie);

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};






module.exports = { userRegister,userLogin,checkUser,userProfile,updateUser,logout,addReview,updateReview}
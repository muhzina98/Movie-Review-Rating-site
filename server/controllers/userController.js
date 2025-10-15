const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const createToken = require('../utils/generateToken')
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






module.exports = { userRegister,userLogin}
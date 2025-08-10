const User = require("../models/User")
const jwt = require("jsonwebtoken");


// Generate JWT token
const generateToken = (id) => {
    return jwt.sign ({ id }, process.env.JWT_SECRET, {expiresIn: "1h"});
}

//Register User
exports.registerUser = async(req,res) => {
    const {fullName, email, password, profileImageURL}=req.body;

    //Validation
    if (!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try{
        //check email already exists
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({message: "Email already exists"})
        }

        //Create the user
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl
        });
        res.status(201).json({
            id:user._id,
            user,
            token: generateToken(user_.id)
        });
    }catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});
    }
}

//Login User
exports.loginUser = async(req,res) => {
    
}

//Register User
exports.getUserInfo = async(req,res) => {
    
}
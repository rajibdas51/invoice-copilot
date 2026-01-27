import jwt from 'jsonwebtoken'
import User from '../models/User'

// Helper: Generate JWT
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
}

// @desc Register new user
// @route POST /api/auth/register
// @access Public

export const registerUser = async (req,res)=>{
   const {name, email,password} = req.body;
   try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }
}

// @desc login  user
// @route POST /api/auth/login
  
// @access Public
export const loginUser = async (req, res) =>{
   const {name, email,password} = req.body;
   try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }
}



// @desc Get current  logged-in  user
// @route POST /api/auth/me
  
// @access Private

export const getMe = async (req, res)=>{
    try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }

}



// @desc Update user profile
// @route POST /api/auth/update
  
// @access Private

export const updateUser = async (req, res)=>{
    try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }
}
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Helper: Generate JWT
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
}

// @desc Register new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all the fields!');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};


// @desc login  user
// @route POST /api/auth/login
  
// @access Public
 const loginUser = async (req, res) =>{
   const {name, email,password} = req.body;
   try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }
}



// @desc Get current  logged-in  user
// @route POST /api/auth/me
  
// @access Private

const getMe = async (req, res)=>{
    try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }

}



// @desc Update user profile
// @route POST /api/auth/update
  
// @access Private

const updateUserProfile = async (req, res)=>{
    try{
   
   } catch(error){
       res.status(500).json({message:"Server error"})
   }
}

export {registerUser,loginUser,getMe, updateUserProfile};
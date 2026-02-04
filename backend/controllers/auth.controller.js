import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {

    const { email, password } = req.body;

    // 1. basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required " });
    }

    // 2. check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist " });
    }

    // 3. create user (password hashing happens in model)
    const Newuser = await User.create({
      email,
      password
    });

    // 4. send response (NO password) 
    res.json({
      message: "user succsefully register",
      userId: Newuser._id,
      email: Newuser.email
    });

  } catch (error) {

    console.error("REGISTER CONTROLLER ERROR 👉", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

export const login = async (req, res) => {

  try {
    
      const { email, password } = req.body;
    
      //if email and password is empty
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required " });
      }
    
      //find user 
      const user  = await User.findOne({ email });
    
      //if email not match
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    
      //check password is match 
       const isMatch = await user.comparePassword(password) ;
    
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id);
    
      res.json({
        message: "user login successfully",
        token,
        userId: user._id,
        email: user.email
      })

  } catch (error) {

    return res.status(500).json({
      message: "login server error",
      error: error.message
    });
  }
}
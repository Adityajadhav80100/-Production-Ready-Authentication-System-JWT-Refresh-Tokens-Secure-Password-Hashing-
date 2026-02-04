import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import crypto from "crypto";

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

    //Verifiction token 
    const verificationToken = crypto.randomBytes(32).toString("hex");
    


    const Newuser = await User.create({
      email,
      password,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000
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
    const user = await User.findOne({ email });

    //if email not match
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //check password is match 
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //check user is verified or not
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account before logging in" })
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

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    //if token is not exist 
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token"
      });
    }

    //find the user with valid token with matching url token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });


    if (!user) {
      return res.status(401).json({
        message: "token expired or invalid"
      });
    }

    //user verified now
    user.isVerified = true,

      // DELETE THE VERIFICATION TOKEN it one time use only
      user.verificationToken = undefined,
      user.verificationTokenExpires = undefined

    await user.save();

    res.json({ message: "Email verified successfully" });


  } catch (error) {
    return res.status(500).json({
      message: " Verification Failed ",
      error: error.message
    });
  }
}
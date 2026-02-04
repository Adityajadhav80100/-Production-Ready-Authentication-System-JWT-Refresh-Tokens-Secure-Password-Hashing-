import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //get user detail 
    const user =  await User.findById(decoded.userId).select("-password")

    //if usernot exist 
    if (!user) {
       return res.status(401).json({message:"User Not Found"})
    }

    // 4. Attach userId to request
    req.user = user;

    // 5. Continue to controller
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

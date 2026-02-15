import express from 'express';
import { register , login , verifyEmail , refreshAccessToken , logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { forgotPassword , resetPassword } from '../controllers/auth.controller.js';
import { authorizeRoles } from "../middlewares/role.middleware.js";


const router = express.Router();


//registe route 
router.post('/register' , register ) ;  

//login route
router.post('/login' , login);

//logout
router.post("/logout", logout);

//auth middleware  checking 
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Auth middleware working",
    userId: req.user
  });
});

//verified email
router.get("/verify-email", verifyEmail);

//forgot password 
router.post("/forgot-Password" , forgotPassword);

//reset password 
router.post("/reset-Password" , resetPassword);

//refresh Access token
router.post("/refresh-token" , refreshAccessToken);

///role based access
router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

export default  router ;
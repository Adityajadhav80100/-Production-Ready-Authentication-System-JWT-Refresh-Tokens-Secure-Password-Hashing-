import express from 'express';
import { register , login , verifyEmail } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { forgotPassword , resetPassword } from '../controllers/auth.controller.js';
const router = express.Router();

//registe route 
router.post('/register' , register ) ;  

//login route
router.post('/login' , login);

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


export default  router ;
import User from "../models/user.model.js";
import { generateToken, generateRefreshToken } from "../utils/jwt.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendemail.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required " });
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
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    //Sendingg email
    const verificationLink = `http://localhost:5001/api/auth/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify your account",
      `<h2>Email Verification</h2>
      <p>Click below to verify your account:</p>
        <a href="${verificationLink}">Verify Email</a>`,
    );

    // 4. send response (NO password)
    res.json({
      message: "user succsefully register",
      userId: Newuser._id,
      email: Newuser.email,
    });
  } catch (error) {
    console.error("REGISTER CONTROLLER ERROR 👉", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //if email and password is empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required " });
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
      return res
        .status(403)
        .json({ message: "Please verify your account before logging in" });
    }

    // generate tokens (FINAL)
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    //save Refresh token
    user.refreshToken = refreshToken;

    await user.save();

    // res.json({
    //   message: "user login successfully",
    //   accessToken,
    //   refreshToken,
    //   userId: user._id,
    //   email: user.email,
    // });

    // send access token for 15 min
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful 🍪",
    });
  } catch (error) {
    return res.status(500).json({
      message: "login server error",
      error: error.message,
    });
  }
};

//Refresh token
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // 1️⃣ verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 2️⃣ find user with this refresh token in DB
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken,
    });

    if (!user) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // generate NEW ACCESS token
    const newAccessToken = generateToken(user._id, user.role);

    // 4️⃣ send new access token
    res.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({
      message: "Refresh token expired or invalid",
    });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

export const adminAccess = (req, res) => {
  res.json({ message: "Admin Access Granted" });
};

//verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    //if token is not exist
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    //find the user with valid token with matching url token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({
        message: "token expired or invalid",
      });
    }

    //user verified now
    ((user.isVerified = true),
      // DELETE THE VERIFICATION TOKEN it one time use only
      (user.verificationToken = undefined),
      (user.verificationTokenExpires = undefined));

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({
      message: " Verification Failed ",
      error: error.message,
    });
  }
};

//Forgot password
export const forgotPassword = async (req, res) => {
  try {
    // 1️⃣ Get email from request body
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email });

    // 🔐 Security: do NOT reveal if user exists
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    // 3️⃣ Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 4️⃣ Save token + expiry in DB (15 minutes)
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // 5️⃣ Create reset link
    const resetLink = `http://localhost:5001/api/auth/reset-password?token=${resetToken}`;

    // 6️⃣ Send reset email (reuse sendEmail utility)
    await sendEmail(
      email,
      "Reset your password",
      `<h2>Password Reset</h2>
       <p>You requested to reset your password.</p>
       <p>Click the button below to reset it:</p>
       <a href="${resetLink}">Reset Password</a>`,
    );

    // 7️⃣ Final response (same message always for security)
    res.json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error in forgotPassword",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "token and newPassword  is required" });
    }

    //find user
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "token expired or invalid",
      });
    }

    // 3️⃣ update password (hashing happens in model)
    user.password = newPassword;

    // DELETE THE VERIFICATION TOKEN it one time use only
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

    res.json({ message: "ResetPassword  successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server error in ResetPassword",
      error: error.message,
    });
  }
};

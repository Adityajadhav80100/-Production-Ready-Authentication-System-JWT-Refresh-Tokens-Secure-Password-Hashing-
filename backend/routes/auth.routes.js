import express from "express";
import {
  register,
  login,
  verifyEmail,
  refreshAccessToken,
  logout,
  adminAccess,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", authMiddleware, (req, res) => {
  const { email, role } = req.user || {};
  res.status(200).json({
    user: { email, role },
  });
});

router.get("/verify-email", verifyEmail);
router.post("/forgot-Password", forgotPassword);
router.post("/reset-Password", resetPassword);
router.post("/refresh-token", refreshAccessToken);

router.get("/adminAccess", authMiddleware, adminMiddleware, adminAccess);

export default router;

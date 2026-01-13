import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  deleteUserAccount,
  updateAccountPassword,
  fetchEmailAvailability,
  deleteAllUserBookmarks,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth
 * @desc    Register a new user
 */
router.post("/", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 */
router.post("/login", loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user / clear cookie
 */
router.post("/logout", logoutUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get user profile (Private)
 */
router.get("/me", protect, getUserProfile);

/**
 * @route   GET /api/auth/check-email/:email
 * @desc    Fetch email availability
 */
router.get("/check-email/:email", fetchEmailAvailability);

/**
 * @route   DELETE /api/auth
 * @desc    Delete user account
 */
router.delete("/", protect, deleteUserAccount);

/**
 * @route   PUT /api/auth/password
 * @desc    Update account password
 */
router.put("/password", protect, updateAccountPassword);

/**
 * @route   DELETE /api/auth/delete-all-bookmarks
 * @desc    Delete all of a user's bookmarks
 */
router.delete("/delete-all-bookmarks", protect, deleteAllUserBookmarks);

export default router;

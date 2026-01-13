import express from "express";
import {
  createBookmark,
  updateBookmark,
  deleteBookmark,
  getUserBookmarks,
  getBookmarkById,
  favoriteBookmark,
  fetchFavoriteBookmarks,
} from "../controllers/bookmark.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * @route   POST /api/bookmarks
 * @desc    Create new bookmark
 */
router.post("/", createBookmark);

/**
 * @route   GET /api/bookmarks
 * @desc    Fetch all bookmarks for the logged-in user
 */
router.get("/", getUserBookmarks);

/**
 * @route   GET /api/bookmarks/:id
 * @desc    Fetch a single bookmark by ID
 */
router.get("/:id", getBookmarkById);

/**
 * @route   PUT /api/bookmarks/:id
 * @desc    Update a bookmark
 */
router.put("/:id", updateBookmark);

/**
 * @route   DELETE /api/bookmarks/:id
 * @desc    Delete a bookmark
 */
router.delete("/:id", deleteBookmark);

/**
 * @route   POST /api/bookmarks/favorites
 * @desc    Favorite or unfavorite a bookmark
 */
router.post("/favorites", favoriteBookmark);

/**
 * @route   GET /api/bookmarks/favorites
 * @desc    Fetch favorite bookmarks
 */
router.get("/favorites", fetchFavoriteBookmarks);

export default router;

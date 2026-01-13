import Bookmark from "../models/bookmark.model.js";
import * as cheerio from "cheerio";
import axios from "axios";

/**
 * @desc    Create new bookmark
 * @route   POST /api/bookmarks
 * @access  PRIVATE
 */

export const createBookmark = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // 1. Fetch the website HTML
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 5000, // Safety timeout
    });

    const $ = cheerio.load(html);

    // 2. Extract and Clean Page Title
    // We prioritize Open Graph (og:title) because it's designed for display
    let rawTitle =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      url;

    // CLEANING LOGIC:
    // - Remove common "Screen Reader" text found in modern site titles
    // - Split at common junk words (Chevron, Vega, etc.)
    // - Remove extra newlines and tabs
    const pageTitle = rawTitle
      .split(/Chevron|Vega|Fill|Play/i)[0] // Stop before the junk text
      .replace(/\s\s+/g, " ") // Remove double spaces
      .trim();

    // 3. Extract Favicon Link
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href");

    const urlObj = new URL(url);

    if (favicon && !favicon.startsWith("http")) {
      favicon = `${urlObj.origin}${
        favicon.startsWith("/") ? "" : "/"
      }${favicon}`;
    } else if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?sz=64&domain=${urlObj.hostname}`;
    }

    // 4. Save to Database
    const bookmark = await Bookmark.create({
      title: pageTitle,
      url: url,
      favicon: favicon,
      favorite: false,
      userId: req.user._id,
    });

    res.status(201).json(bookmark);
  } catch (error) {
    console.error("Error creating bookmark:", error.message);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already bookmarked this URL" });
    }

    res.status(500).json({
      message: "Could not fetch site metadata",
      error: error.message,
    });
  }
};

/**
 * @desc    Update bookmark
 * @route   PUT /api/bookmarks/:id
 * @access  PRIVATE
 */
export const updateBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "Bookmark not found or unauthorized" });
    }

    const validatedData = bookmarkSchema.partial().parse(req.body);

    Object.assign(bookmark, validatedData);
    const updatedBookmark = await bookmark.save();

    res.json(updatedBookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete bookmark
 * @route   DELETE /api/bookmarks/:id
 * @access  PRIVATE
 */
export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Fetch user bookmarks
 * @route   GET /api/bookmarks
 * @access  PRIVATE
 */
export const getUserBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Fetch bookmark details
 * @route   GET /api/bookmarks/:id
 * @access  PRIVATE
 */
export const getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Favorite or unfavorite bookmark
 * @route   POST /api/bookmarks/favorites
 * @access  PRIVATE
 */
export const favoriteBookmark = async (req, res) => {
  const { bookmarkId, action } = req.body;
  const userId = req.user._id;

  try {
    if (!bookmarkId || !action) {
      return res
        .status(400)
        .json({ message: "Bookmark ID and action are required." });
    }

    // 1. Find the bookmark and ensure it belongs to the requester
    const bookmark = await Bookmark.findOne({ _id: bookmarkId, userId });

    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "Bookmark not found or unauthorized." });
    }

    // 2. Determine boolean value based on action string
    const isFavorite = action === "favorite";

    // 3. Update the document
    bookmark.favorite = isFavorite;
    await bookmark.save();

    res.status(200).json({
      message: `Bookmark ${
        isFavorite ? "favorited" : "unfavorited"
      } successfully.`,
      bookmark,
    });
  } catch (err) {
    console.error(
      "There was an error favoriting or unfavoriting a bookmark:",
      err,
    );
    res
      .status(500)
      .json({ message: "We're having trouble, please try again." });
  }
};

/**
 * @desc    Fetch favorite bookmarks
 * @route   GET /api/bookmarks/favorites
 * @access  PRIVATE
 */
export const fetchFavoriteBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Bookmark.find({
      userId: userId,
      favorite: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (err) {
    console.error("There's an error fetching a user's favorites:", err);
    return res
      .status(500)
      .json({ message: "Internal server error, please try again." });
  }
};

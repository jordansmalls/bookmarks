import User from "../models/user.model.js";
import generateToken from "../utils/generate.jwt.js";
import Bookmark from "../models/bookmark.model.js";

/**
 * @desc    Create user
 * @route   POST /api/auth
 * @access  PUBLIC
 */
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ email, password });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
      });
    }
  } catch (error) {
    console.error("Error creating an account:", error);
    res.status(500).json({ message: "Invalid user data" });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  PUBLIC
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  PUBLIC
 */
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * @desc    Fetch user account details
 * @route   GET /api/auth/me
 * @access  PUBLIC
 */
export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

/**
 * @desc    Update account password
 * @route   PUT /api/auth/password
 * @access  PRIVATE
 */

export const updateAccountPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const id = req.user._id;

  try {
    if (!id || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // find user by their authenticated ID
    const user = await User.findById(id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if current password is correct
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // update user password - hashed by pre save method DB
    user.password = newPassword;
    const success = await user.save();

    if (success) {
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    } else {
      console.error(
        "There was a DB error while attempting to update a user's password.",
      );
      return res
        .status(500)
        .json({ message: "We're having trouble, please try again." });
    }
  } catch (err) {
    console.error(
      "There was an error attempting to update a user's password:",
      err,
    );
    return res.status(500).json({
      message: "We're having trouble updating your password, please try again.",
    });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/auth/
 * @access  PRIVATE
 */

export const deleteUserAccount = async (req, res) => {
  const id = req.user?._id;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Invalid credentials (ID missing)." });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Account deletion successful. Please come back soon." });
  } catch (err) {
    console.log("There was an error attempting to delete a user account:", err);
    return res.status(500).json({
      message:
        "We're having trouble deleting your account, please try again later.",
    });
  }
};

/**
 * @desc    Fetch email availability
 * @route   GET /api/auth/check-email/:email
 * @access  PUBLIC
 */

export const fetchEmailAvailability = async (req, res) => {
  const { email } = req.params;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid credentials (email missing)." });
    }

    const isTaken = await User.findOne({ email });

    if (isTaken) {
      return res
        .status(200)
        .json({ message: "Email is already in use.", taken: true });
    } else {
      return res
        .status(200)
        .json({ message: "Email available!", taken: false });
    }
  } catch (err) {
    console.error(
      "There was an error checking the availability of an email:",
      err,
    );
    return res
      .status(500)
      .json({ message: "We're having trouble, try again." });
  }
};

/**
 * @desc      Delete all user bookmarks
 * @route     DELETE /api/auth/delete-all-bookmarks
 * @access    PRIVATE
 */

export const deleteAllUserBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all bookmarks belonging to this user
    const result = await Bookmark.deleteMany({ user: userId });

    return res.status(200).json({
      message: "All bookmarks have been successfully deleted.",
      count: result.deletedCount,
    });
  } catch (err) {
    console.error(
      "There was an error deleting all of a user's bookmarks:",
      err,
    );
    return res.status(500).json({
      message: "Sorry, we're having trouble. Please try again soon.",
    });
  }
};

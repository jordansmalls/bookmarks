import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    favicon: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ensures the combination of userId and url is unique
bookmarkSchema.index({ userId: 1, url: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
export default Bookmark;

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    imageUrl:   { type: String, required: true },
    publicId:   { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: [
        "hero",
        "banquet_hero", // ← added: Banquet Halls page hero (arch + floating photo)
        "wedding",
        "engagement",
        "birthday",
        "corporate",
        "private_dining",
        "social",
        "about",
        "about_hero",
      ],
    },
    caption:    { type: String, trim: true },
    order:      { type: Number, default: 0 },
    isActive:   { type: Boolean, default: true },
    mediaType:  { type: String, enum: ["image", "video"], default: "image" },
  },
  { timestamps: true }
);

gallerySchema.index({ section: 1, order: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    imageUrl:   { type: String, required: true },
    publicId:   { type: String, required: true }, // cloudinary public_id for deletion
    section: {
      type: String,
      required: true,
      enum: ["hero", "wedding", "engagement", "birthday", "corporate", "private_dining", "social", "about"],
    },
    caption:    { type: String, trim: true },
    order:      { type: Number, default: 0 }, // for serial ordering
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

gallerySchema.index({ section: 1, order: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
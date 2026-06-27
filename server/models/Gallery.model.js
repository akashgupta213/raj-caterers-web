const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl:    { type: String, required: true },
    publicId:    { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Food"],
    },
    tags:       [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    sortOrder:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });
gallerySchema.index({ isFeatured: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);

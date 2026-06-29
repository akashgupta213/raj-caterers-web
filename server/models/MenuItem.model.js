const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price:       { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Appetizers", "Main Course", "Desserts", "Beverages", "Live Counters"],
    },
    imageUrl:    { type: String },
    publicId:    { type: String },
    dietary:     [{ type: String, enum: ["Vegetarian", "Vegan", "Halal", "Gluten Free"] }],
    isActive:    { type: Boolean, default: true },
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
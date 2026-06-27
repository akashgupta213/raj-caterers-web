const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages", "Live Counter", "Salads"],
    },
    cuisine: {
      type: String,
      enum: ["North Indian", "South Indian", "Continental", "Chinese", "Mughlai", "Multi-Cuisine"],
      default: "North Indian",
    },
    dietaryTags: [{
      type: String,
      enum: ["Veg", "Non-Veg", "Vegan", "Jain", "Gluten-Free", "Contains Nuts", "Dairy-Free"],
    }],
    imageUrl:   { type: String },
    publicId:   { type: String },
    pricePerPlate: { type: Number },
    isAvailable:   { type: Boolean, default: true },
    isFeatured:    { type: Boolean, default: false },
    sortOrder:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ dietaryTags: 1 });
menuItemSchema.index({ name: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);

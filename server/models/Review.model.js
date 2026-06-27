const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    clientName:  { type: String, required: true, trim: true },
    clientRole:  { type: String, trim: true },
    review:      { type: String, required: true, trim: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    eventType: {
      type: String,
      enum: ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Other"],
    },
    eventDate:   { type: Date },
    avatarUrl:   { type: String },
    isApproved:  { type: Boolean, default: false },
    isFeatured:  { type: Boolean, default: false },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ isFeatured: 1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model("Review", reviewSchema);

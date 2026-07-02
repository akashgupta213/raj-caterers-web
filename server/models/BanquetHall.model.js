const mongoose = require("mongoose");

const banquetHallSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    capacityMin: { type: Number, default: 0 },
    capacityMax: { type: Number, default: 0 },
    amenities:   [{ type: String, trim: true }],
    images: [
      {
        url:      { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    featured: { type: Boolean, default: false },
    order:    { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

banquetHallSchema.index({ order: 1 });

module.exports = mongoose.model("BanquetHall", banquetHallSchema);
const mongoose = require("mongoose");

const hallEnquirySchema = new mongoose.Schema(
  {
    hall:     { type: mongoose.Schema.Types.ObjectId, ref: "BanquetHall" },
    hallName: { type: String, required: true, trim: true },
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    date:     { type: Date },
    pax:      { type: String, trim: true },
    message:  { type: String, trim: true },
    status:   { type: String, enum: ["New", "Contacted", "Closed"], default: "New" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HallEnquiry", hallEnquirySchema);
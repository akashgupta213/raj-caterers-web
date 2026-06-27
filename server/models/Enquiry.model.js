const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema(
  {
    fullName:   { type: String, required: true, trim: true },
    email:      { type: String, required: true, lowercase: true, trim: true },
    phone:      { type: String, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Other"],
    },
    estimatedGuests: { type: Number },
    preferredDate:   { type: Date },
    message:         { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["New", "In Progress", "Contacted", "Converted", "Closed"],
      default: "New",
    },
    source: {
      type: String,
      enum: ["Website Form", "Phone", "Walk-in", "Referral", "Social Media"],
      default: "Website Form",
    },
    adminNotes: { type: String, trim: true },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Enquiry", enquirySchema);

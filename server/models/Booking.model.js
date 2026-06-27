const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    clientName:   { type: String, required: true, trim: true },
    clientEmail:  { type: String, required: true, lowercase: true, trim: true },
    clientPhone:  { type: String, required: true, trim: true },
    eventType: {
      type: String,
      required: true,
      enum: ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Other"],
    },
    eventDate:    { type: Date, required: true },
    eventTime:    { type: String, required: true },
    venue:        { type: String, required: true, trim: true },
    guestCount:   { type: Number, required: true, min: 1 },
    packageType: {
      type: String,
      enum: ["Basic", "Premium", "Royal", "Custom"],
      default: "Custom",
    },
    specialRequests: { type: String, trim: true },
    dietaryNeeds:    { type: String, trim: true },
    estimatedBudget: { type: Number },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes:         { type: String, trim: true },
    totalAmount:   { type: Number, default: 0 },
    advancePaid:   { type: Number, default: 0 },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ clientEmail: 1 });

module.exports = mongoose.model("Booking", bookingSchema);

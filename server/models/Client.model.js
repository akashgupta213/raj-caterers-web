const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:   { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city:    { type: String, trim: true },
    type: {
      type: String,
      enum: ["Individual", "Corporate", "Regular"],
      default: "Individual",
    },
    totalEvents:  { type: Number, default: 0 },
    totalSpend:   { type: Number, default: 0 },
    lastEventDate:{ type: Date },
    tags:         [{ type: String }],
    notes:        { type: String, trim: true },
    isActive:     { type: Boolean, default: true },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

clientSchema.index({ email: 1 });
clientSchema.index({ name: "text" });

module.exports = mongoose.model("Client", clientSchema);

const express = require("express");
const router  = express.Router();
const {
  createBooking, getAllBookings, getBookingById,
  updateBooking, deleteBooking, getBookingStats,
} = require("../controllers/booking.controller");
const protect = require("../middleware/auth.middleware");

// Public
router.post("/", createBooking);

// Private (admin)
router.get("/stats",  protect, getBookingStats);
router.get("/",       protect, getAllBookings);
router.get("/:id",    protect, getBookingById);
router.put("/:id",    protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

module.exports = router;

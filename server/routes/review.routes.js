const express = require("express");
const router  = express.Router();
const {
  getApprovedReviews, getAllReviewsAdmin,
  createReview, updateReview, deleteReview,
} = require("../controllers/review.controller");
const protect = require("../middleware/auth.middleware");

// Public
router.get("/", getApprovedReviews);

// Private (admin)
router.get("/admin",  protect, getAllReviewsAdmin);
router.post("/",      protect, createReview);
router.put("/:id",    protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;

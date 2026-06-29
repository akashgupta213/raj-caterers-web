const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/auth.middleware");
const { formLimiter } = require("../middleware/rateLimit.middleware");
const {
  getApprovedReviews,
  getAllReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
} = require("../controllers/review.controller");

router.get("/",              getApprovedReviews);              // public
router.post("/",  formLimiter, createReview);                  // public + rate limited (5/hr per IP)
router.get("/admin",  protect, getAllReviewsAdmin);             // admin
router.put("/:id/helpful",   markHelpful);                     // public — once per IP
router.put("/:id",    protect, updateReview);                  // admin
router.delete("/:id", protect, deleteReview);                  // admin

module.exports = router;
const Review = require("../models/Review.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all approved reviews (public)
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res) => {
  try {
    const { featured } = req.query;

    const query = { isApproved: true };
    if (featured === "true") query.isFeatured = true;

    const reviews = await Review.find(query).sort({ sortOrder: 1, createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return sendSuccess(res, 200, "Reviews fetched", { reviews, avgRating, total: reviews.length });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all reviews (admin - includes unapproved)
// @route   GET /api/reviews/admin
// @access  Private
const getAllReviewsAdmin = async (req, res) => {
  try {
    const { isApproved, page = 1, limit = 10 } = req.query;

    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === "true";

    const total   = await Review.countDocuments(query);
    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, "Reviews fetched", {
      reviews,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Create review (admin adds on behalf of client)
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    return sendSuccess(res, 201, "Review created", review);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update review (approve / feature)
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) return sendError(res, 404, "Review not found");
    return sendSuccess(res, 200, "Review updated", review);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return sendError(res, 404, "Review not found");
    return sendSuccess(res, 200, "Review deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getApprovedReviews,
  getAllReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
};

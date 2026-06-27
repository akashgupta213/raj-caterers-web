const express = require("express");
const router  = express.Router();
const {
  createEnquiry, getAllEnquiries, getEnquiryById,
  updateEnquiry, deleteEnquiry, getEnquiryStats,
} = require("../controllers/enquiry.controller");
const protect = require("../middleware/auth.middleware");

// Public
router.post("/", createEnquiry);

// Private (admin)
router.get("/stats",  protect, getEnquiryStats);
router.get("/",       protect, getAllEnquiries);
router.get("/:id",    protect, getEnquiryById);
router.put("/:id",    protect, updateEnquiry);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;

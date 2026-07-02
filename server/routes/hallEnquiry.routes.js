const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createHallEnquiry,
  getAllHallEnquiries,
  getHallEnquiryStats,
  updateHallEnquiry,
  deleteHallEnquiry,
} = require("../controllers/hallEnquiry.controller");

router.post("/",       createHallEnquiry);            // public
router.get("/stats",   protect, getHallEnquiryStats);  // admin — declared before "/:id"
router.get("/",        protect, getAllHallEnquiries);  // admin
router.put("/:id",     protect, updateHallEnquiry);     // admin
router.delete("/:id",  protect, deleteHallEnquiry);     // admin

module.exports = router;
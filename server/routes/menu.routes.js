const express = require("express");
const router  = express.Router();
const {
  getAllMenuItems, createMenuItem,
  updateMenuItem, deleteMenuItem,
} = require("../controllers/menu.controller");
const protect = require("../middleware/auth.middleware");
const { uploadMenu } = require("../config/cloudinary");

// Public
router.get("/", getAllMenuItems);

// Private (admin)
router.post("/",      protect, uploadMenu.single("image"), createMenuItem);
router.put("/:id",    protect, uploadMenu.single("image"), updateMenuItem);
router.delete("/:id", protect, deleteMenuItem);

module.exports = router;

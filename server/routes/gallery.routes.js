const express = require("express");
const router  = express.Router();
const {
  getAllGallery, uploadGalleryImage,
  updateGalleryItem, deleteGalleryImage,
} = require("../controllers/gallery.controller");
const protect = require("../middleware/auth.middleware");
const { uploadGallery } = require("../config/cloudinary");

// Public
router.get("/", getAllGallery);

// Private (admin)
router.post("/",      protect, uploadGallery.single("image"), uploadGalleryImage);
router.put("/:id",    protect, updateGalleryItem);
router.delete("/:id", protect, deleteGalleryImage);

module.exports = router;

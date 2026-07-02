const express  = require("express");
const router   = express.Router();
const { uploadImages, getImages, getAllImages, updateImage, deleteImage } = require("../controllers/gallery.controller");
const protect  = require("../middleware/auth.middleware");
const { uploadGallery } = require("../config/cloudinary");

router.get("/",        getImages);                                              // public
router.get("/all",     protect, getAllImages);                                  // admin
router.post("/",       protect, uploadGallery.array("image", 20), uploadImages); // admin — multiple files in one request
router.put("/:id",     protect, updateImage);                                   // admin
router.delete("/:id",  protect, deleteImage);                                   // admin

module.exports = router;
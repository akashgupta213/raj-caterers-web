const express  = require("express");
const router   = express.Router();
const { uploadImage, getImages, getAllImages, updateImage, deleteImage } = require("../controllers/gallery.controller");
const protect  = require("../middleware/auth.middleware");
const { uploadGallery } = require("../config/cloudinary");

router.get("/",        getImages);                                          // public
router.get("/all",     protect, getAllImages);                              // admin
router.post("/",       protect, uploadGallery.single("image"), uploadImage); // admin
router.put("/:id",     protect, updateImage);                              // admin
router.delete("/:id",  protect, deleteImage);                              // admin

module.exports = router;
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gallery storage
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "raj-caterers/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
  },
});

// Menu item storage
const menuStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "raj-caterers/menu",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit", quality: "auto" }],
  },
});

const uploadGallery = multer({ storage: galleryStorage });
const uploadMenu    = multer({ storage: menuStorage });

module.exports = { cloudinary, uploadGallery, uploadMenu };

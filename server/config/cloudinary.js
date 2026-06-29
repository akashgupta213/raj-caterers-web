const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Gallery upload storage
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:         `raj-caterers/gallery/${req.body.section || "general"}`,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1920, height: 1080, crop: "limit", quality: "auto" }],
  }),
});

// Menu upload storage
const menuStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "raj-caterers/menu",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation:  [{ width: 800, height: 800, crop: "fill", quality: "auto" }],
  },
});

const uploadGallery = multer({ storage: galleryStorage });
const uploadMenu    = multer({ storage: menuStorage });

module.exports = { cloudinary, uploadGallery, uploadMenu };
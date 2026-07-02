const Gallery  = require("../models/Gallery.model");
const { cloudinary } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @route POST /api/gallery  (admin, with multiple image/video upload)
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return sendError(res, 400, "No files uploaded");

    const { section, caption, order } = req.body;
    const baseOrder = order ? Number(order) : 0;

    const images = await Promise.all(
      req.files.map((file, i) => {
        const mediaType = file.mimetype.startsWith("video/") ? "video" : "image";
        return Gallery.create({
          imageUrl:  file.path,
          publicId:  file.filename,
          section,
          caption,
          order:     baseOrder + i,
          mediaType,
        });
      })
    );

    return sendSuccess(res, 201, "Files uploaded", images);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/gallery?section=wedding
const getImages = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.section) filter.section = req.query.section;

    const images = await Gallery.find(filter).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, 200, "Images fetched", images);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/gallery/all  (admin — includes inactive)
const getAllImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ section: 1, order: 1, createdAt: 1 });
    return sendSuccess(res, 200, "All images fetched", images);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route PUT /api/gallery/:id
const updateImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return sendError(res, 404, "Image not found");
    return sendSuccess(res, 200, "Image updated", image);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route DELETE /api/gallery/:id
const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return sendError(res, 404, "Image not found");

    await cloudinary.uploader.destroy(image.publicId, {
      resource_type: image.mediaType === "video" ? "video" : "image",
    });
    await image.deleteOne();

    return sendSuccess(res, 200, "File deleted");
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = { uploadImages, getImages, getAllImages, updateImage, deleteImage };
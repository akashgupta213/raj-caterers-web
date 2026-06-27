const Gallery    = require("../models/Gallery.model");
const { cloudinary } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all gallery items (public)
// @route   GET /api/gallery
// @access  Public
const getAllGallery = async (req, res) => {
  try {
    const { category, featured } = req.query;

    const query = {};
    if (category) query.category = category;
    if (featured === "true") query.isFeatured = true;

    const items = await Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 });

    return sendSuccess(res, 200, "Gallery fetched", items);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Upload gallery image (admin)
// @route   POST /api/gallery
// @access  Private
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, "No image uploaded");

    const { title, description, category, tags, isFeatured, sortOrder } = req.body;

    const item = await Gallery.create({
      title,
      description,
      category,
      imageUrl:   req.file.path,
      publicId:   req.file.filename,
      tags:       tags ? tags.split(",").map((t) => t.trim()) : [],
      isFeatured: isFeatured === "true",
      sortOrder:  sortOrder || 0,
    });

    return sendSuccess(res, 201, "Image uploaded successfully", item);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return sendError(res, 404, "Gallery item not found");
    return sendSuccess(res, 200, "Gallery item updated", item);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete gallery image (admin)
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return sendError(res, 404, "Gallery item not found");

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(item.publicId);

    await item.deleteOne();

    return sendSuccess(res, 200, "Image deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllGallery,
  uploadGalleryImage,
  updateGalleryItem,
  deleteGalleryImage,
};

const MenuItem   = require("../models/MenuItem.model");
const { cloudinary } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all menu items (public)
// @route   GET /api/menu
// @access  Public
const getAllMenuItems = async (req, res) => {
  try {
    const { category, cuisine, dietaryTag, featured, search } = req.query;

    const query = { isAvailable: true };
    if (category)   query.category = category;
    if (cuisine)    query.cuisine  = cuisine;
    if (dietaryTag) query.dietaryTags = dietaryTag;
    if (featured === "true") query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const items = await MenuItem.find(query).sort({ category: 1, sortOrder: 1 });

    // Group by category
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});

    return sendSuccess(res, 200, "Menu items fetched", { items, grouped });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Create menu item (admin)
// @route   POST /api/menu
// @access  Private
const createMenuItem = async (req, res) => {
  try {
    const {
      name, description, category, cuisine,
      dietaryTags, pricePerPlate, isAvailable,
      isFeatured, sortOrder,
    } = req.body;

    const data = {
      name, description, category, cuisine,
      dietaryTags: dietaryTags ? JSON.parse(dietaryTags) : [],
      pricePerPlate,
      isAvailable:  isAvailable  !== "false",
      isFeatured:   isFeatured   === "true",
      sortOrder:    sortOrder || 0,
    };

    if (req.file) {
      data.imageUrl = req.file.path;
      data.publicId = req.file.filename;
    }

    const item = await MenuItem.create(data);

    return sendSuccess(res, 201, "Menu item created", item);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update menu item (admin)
// @route   PUT /api/menu/:id
// @access  Private
const updateMenuItem = async (req, res) => {
  try {
    const existing = await MenuItem.findById(req.params.id);
    if (!existing) return sendError(res, 404, "Menu item not found");

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old image from Cloudinary
      if (existing.publicId) {
        await cloudinary.uploader.destroy(existing.publicId);
      }
      updateData.imageUrl = req.file.path;
      updateData.publicId = req.file.filename;
    }

    if (updateData.dietaryTags && typeof updateData.dietaryTags === "string") {
      updateData.dietaryTags = JSON.parse(updateData.dietaryTags);
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, "Menu item updated", item);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete menu item (admin)
// @route   DELETE /api/menu/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return sendError(res, 404, "Menu item not found");

    if (item.publicId) {
      await cloudinary.uploader.destroy(item.publicId);
    }

    await item.deleteOne();

    return sendSuccess(res, 200, "Menu item deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};

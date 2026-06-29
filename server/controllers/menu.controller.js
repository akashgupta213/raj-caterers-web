const MenuItem   = require("../models/MenuItem.model");
const { cloudinary } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @route POST /api/menu  (admin)
const createItem = async (req, res) => {
  try {
    const { name, description, price, category, dietary, order } = req.body;

    const item = await MenuItem.create({
      name, description,
      price:    Number(price),
      category,
      dietary:  dietary ? JSON.parse(dietary) : [],
      order:    order ? Number(order) : 0,
      imageUrl: req.file?.path || "",
      publicId: req.file?.filename || "",
    });

    return sendSuccess(res, 201, "Menu item created", item);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/menu?category=Appetizers
const getItems = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;

    const items = await MenuItem.find(filter).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, 200, "Menu items fetched", items);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/menu/all  (admin)
const getAllItems = async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ category: 1, order: 1 });
    return sendSuccess(res, 200, "All items fetched", items);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route PUT /api/menu/:id
const updateItem = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      // Delete old image
      const old = await MenuItem.findById(req.params.id);
      if (old?.publicId) await cloudinary.uploader.destroy(old.publicId);
      updates.imageUrl = req.file.path;
      updates.publicId = req.file.filename;
    }
    if (updates.dietary && typeof updates.dietary === "string") {
      updates.dietary = JSON.parse(updates.dietary);
    }
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!item) return sendError(res, 404, "Item not found");
    return sendSuccess(res, 200, "Item updated", item);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route DELETE /api/menu/:id
const deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return sendError(res, 404, "Item not found");
    if (item.publicId) await cloudinary.uploader.destroy(item.publicId);
    await item.deleteOne();
    return sendSuccess(res, 200, "Item deleted");
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = { createItem, getItems, getAllItems, updateItem, deleteItem };
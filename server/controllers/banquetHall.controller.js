const { cloudinary } = require("../config/cloudinary");
const BanquetHall = require("../models/BanquetHall.model");

// GET /api/banquet-halls  (public — active halls only, for the showcase page)
exports.getPublicHalls = async (req, res) => {
  try {
    const halls = await BanquetHall.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: halls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/banquet-halls/all  (admin — every hall, active or not)
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await BanquetHall.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: halls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/banquet-halls/:id  (public detail page)
exports.getHallById = async (req, res) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: "Banquet hall not found" });
    res.status(200).json({ success: true, data: hall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/banquet-halls  (admin — create a hall, multiple images at once)
exports.createHall = async (req, res) => {
  try {
    const { name, description, capacityMin, capacityMax, amenities, order, featured } = req.body;

    const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

    const hall = await BanquetHall.create({
      name,
      description,
      capacityMin: capacityMin || 0,
      capacityMax: capacityMax || 0,
      amenities: amenities
        ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [],
      order: order || 0,
      featured: featured === "true" || featured === true,
      images,
    });

    res.status(201).json({ success: true, data: hall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/banquet-halls/:id/images  (admin — add more images to an existing hall)
exports.addImages = async (req, res) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: "Banquet hall not found" });

    const newImages = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));
    hall.images.push(...newImages);
    await hall.save();

    res.status(200).json({ success: true, data: hall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/banquet-halls/:id/images  (admin — remove one image; publicId sent in body)
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    const hall = await BanquetHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: "Banquet hall not found" });

    await cloudinary.uploader.destroy(publicId);
    hall.images = hall.images.filter((img) => img.publicId !== publicId);
    await hall.save();

    res.status(200).json({ success: true, data: hall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/banquet-halls/:id  (admin — update text fields / toggle active)
exports.updateHall = async (req, res) => {
  try {
    const { name, description, capacityMin, capacityMax, amenities, order, featured, isActive } = req.body;
    const update = {};
    if (name        !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (capacityMin !== undefined) update.capacityMin = capacityMin;
    if (capacityMax !== undefined) update.capacityMax = capacityMax;
    if (order       !== undefined) update.order = order;
    if (featured    !== undefined) update.featured = featured;
    if (isActive    !== undefined) update.isActive = isActive;
    if (amenities   !== undefined) {
      update.amenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(",").map((a) => a.trim()).filter(Boolean);
    }

    const hall = await BanquetHall.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!hall) return res.status(404).json({ success: false, message: "Banquet hall not found" });

    res.status(200).json({ success: true, data: hall });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/banquet-halls/:id  (admin — delete hall + all its cloudinary images)
exports.deleteHall = async (req, res) => {
  try {
    const hall = await BanquetHall.findById(req.params.id);
    if (!hall) return res.status(404).json({ success: false, message: "Banquet hall not found" });

    await Promise.all(hall.images.map((img) => cloudinary.uploader.destroy(img.publicId)));
    await hall.deleteOne();

    res.status(200).json({ success: true, message: "Banquet hall deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
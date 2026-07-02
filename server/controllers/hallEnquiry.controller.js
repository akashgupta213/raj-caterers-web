const HallEnquiry = require("../models/HallEnquiry.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @route POST /api/hall-enquiries  (public)
const createHallEnquiry = async (req, res) => {
  try {
    const { hallId, hallName, name, email, phone, date, pax, message } = req.body;
    if (!name || !email || !phone || !hallName) {
      return sendError(res, 400, "Name, email, phone and hall are required");
    }

    const enquiry = await HallEnquiry.create({
      hall: hallId || undefined,
      hallName, name, email, phone, date, pax, message,
    });

    return sendSuccess(res, 201, "Enquiry submitted", enquiry);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/hall-enquiries  (admin)
const getAllHallEnquiries = async (req, res) => {
  try {
    const enquiries = await HallEnquiry.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Hall enquiries fetched", enquiries);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route GET /api/hall-enquiries/stats  (admin)
const getHallEnquiryStats = async (req, res) => {
  try {
    const total    = await HallEnquiry.countDocuments();
    const newCount = await HallEnquiry.countDocuments({ status: "New" });
    return sendSuccess(res, 200, "Stats fetched", { total, newCount });
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route PUT /api/hall-enquiries/:id  (admin — update status etc.)
const updateHallEnquiry = async (req, res) => {
  try {
    const enquiry = await HallEnquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry updated", enquiry);
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

// @route DELETE /api/hall-enquiries/:id  (admin)
const deleteHallEnquiry = async (req, res) => {
  try {
    const enquiry = await HallEnquiry.findById(req.params.id);
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    await enquiry.deleteOne();
    return sendSuccess(res, 200, "Enquiry deleted");
  } catch (err) {
    return sendError(res, 500, err.message);
  }
};

module.exports = { createHallEnquiry, getAllHallEnquiries, getHallEnquiryStats, updateHallEnquiry, deleteHallEnquiry };
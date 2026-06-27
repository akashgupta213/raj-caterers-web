const Enquiry = require("../models/Enquiry.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { sendEmail } = require("../utils/sendEmail");

// @desc    Submit an enquiry (public)
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const {
      fullName, email, phone,
      eventType, estimatedGuests,
      preferredDate, message,
    } = req.body;

    const enquiry = await Enquiry.create({
      fullName, email, phone,
      eventType, estimatedGuests,
      preferredDate, message,
    });

    // Auto-reply to client
    await sendEmail({
      to:      email,
      subject: "Thank you for reaching out – Raj Caterers",
      template: "enquiryAutoReply",
      data: { name: fullName, eventType },
    });

    // Notify admin
    await sendEmail({
      to:      process.env.EMAIL_USER,
      subject: `New Enquiry – ${eventType} | ${fullName}`,
      template: "adminEnquiryAlert",
      data: {
        fullName, email, phone,
        eventType, estimatedGuests,
        preferredDate: preferredDate
          ? new Date(preferredDate).toLocaleDateString("en-IN")
          : "Not specified",
        message,
        enquiryId: enquiry._id,
      },
    });

    return sendSuccess(res, 201, "Enquiry submitted successfully", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all enquiries (admin)
// @route   GET /api/enquiries
// @access  Private
const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { fullName:  { $regex: search, $options: "i" } },
        { email:     { $regex: search, $options: "i" } },
        { eventType: { $regex: search, $options: "i" } },
      ];
    }

    const total     = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, "Enquiries fetched", {
      enquiries,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Private
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry fetched", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update enquiry status / notes
// @route   PUT /api/enquiries/:id
// @access  Private
const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry updated", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get enquiry stats
// @route   GET /api/enquiries/stats
// @access  Private
const getEnquiryStats = async (req, res) => {
  try {
    const total      = await Enquiry.countDocuments();
    const newCount   = await Enquiry.countDocuments({ status: "New" });
    const inProgress = await Enquiry.countDocuments({ status: "In Progress" });
    const converted  = await Enquiry.countDocuments({ status: "Converted" });

    const byEventType = await Enquiry.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, 200, "Enquiry stats fetched", {
      total, newCount, inProgress, converted, byEventType,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  getEnquiryStats,
};

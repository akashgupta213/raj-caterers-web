const Enquiry = require("../models/Enquiry.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { sendEmail } = require("../utils/sendEmail");

const createEnquiry = async (req, res) => {
  try {
    const { fullName, email, phone, eventType, estimatedGuests, preferredDate, message } = req.body;

    // Validate required fields manually for clear error messages
    if (!fullName) return sendError(res, 400, "Full name is required");
    if (!email)    return sendError(res, 400, "Email is required");
    if (!eventType)return sendError(res, 400, "Event type is required");
    if (!message)  return sendError(res, 400, "Message is required");

    // Save to MongoDB first — always
    const enquiry = await Enquiry.create({
      fullName, email, phone,
      eventType, estimatedGuests,
      preferredDate, message,
    });

    // Send emails — non-blocking, won't crash if email fails
    try {
      await sendEmail({
        to:       email,
        subject:  "Thank you for reaching out – Raj Caterers",
        template: "enquiryAutoReply",
        data:     { name: fullName, eventType },
      });

      await sendEmail({
        to:       process.env.EMAIL_USER,
        subject:  `New Enquiry – ${eventType} | ${fullName}`,
        template: "adminEnquiryAlert",
        data: {
          fullName, email, phone, eventType,
          estimatedGuests,
          preferredDate: preferredDate
            ? new Date(preferredDate).toLocaleDateString("en-IN")
            : "Not specified",
          message,
          enquiryId: enquiry._id,
        },
      });
    } catch (emailErr) {
      // Email failed but enquiry is saved — just log it
      console.error("Email send failed:", emailErr.message);
    }

    return sendSuccess(res, 201, "Enquiry submitted successfully", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

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

const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry fetched", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry updated", enquiry);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return sendError(res, 404, "Enquiry not found");
    return sendSuccess(res, 200, "Enquiry deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

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
  createEnquiry, getAllEnquiries, getEnquiryById,
  updateEnquiry, deleteEnquiry, getEnquiryStats,
};
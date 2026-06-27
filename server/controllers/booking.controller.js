const Booking = require("../models/Booking.model");
const Client  = require("../models/Client.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const { sendEmail } = require("../utils/sendEmail");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const {
      clientName, clientEmail, clientPhone,
      eventType, eventDate, eventTime, venue,
      guestCount, packageType, specialRequests,
      dietaryNeeds, estimatedBudget,
    } = req.body;

    // Create or find client
    let client = await Client.findOne({ email: clientEmail });
    if (!client) {
      client = await Client.create({
        name:  clientName,
        email: clientEmail,
        phone: clientPhone,
      });
    }

    const booking = await Booking.create({
      clientName, clientEmail, clientPhone,
      eventType, eventDate, eventTime, venue,
      guestCount, packageType, specialRequests,
      dietaryNeeds, estimatedBudget,
      client: client._id,
    });

    // Link booking to client
    client.bookings.push(booking._id);
    client.totalEvents += 1;
    client.lastEventDate = eventDate;
    await client.save();

    // Send confirmation email to client
    await sendEmail({
      to:      clientEmail,
      subject: "Booking Confirmed – Raj Caterers",
      template: "bookingConfirmation",
      data: {
        name:      clientName,
        eventType,
        eventDate: new Date(eventDate).toLocaleDateString("en-IN"),
        venue,
        guestCount,
        bookingId: booking._id,
      },
    });

    // Notify admin
    await sendEmail({
      to:      process.env.EMAIL_USER,
      subject: `New Booking – ${eventType} | ${clientName}`,
      template: "adminBookingAlert",
      data: {
        clientName, clientEmail, clientPhone,
        eventType, eventDate: new Date(eventDate).toLocaleDateString("en-IN"),
        venue, guestCount, packageType,
        bookingId: booking._id,
      },
    });

    return sendSuccess(res, 201, "Booking created successfully", booking);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private
const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, status,
      eventType, startDate, endDate, search,
    } = req.query;

    const query = {};

    if (status)    query.status = status;
    if (eventType) query.eventType = eventType;
    if (startDate || endDate) {
      query.eventDate = {};
      if (startDate) query.eventDate.$gte = new Date(startDate);
      if (endDate)   query.eventDate.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { clientName:  { $regex: search, $options: "i" } },
        { clientEmail: { $regex: search, $options: "i" } },
        { clientPhone: { $regex: search, $options: "i" } },
      ];
    }

    const total    = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate("client", "name email phone type")
      .sort({ eventDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, "Bookings fetched", {
      bookings,
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

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("client");
    if (!booking) return sendError(res, 404, "Booking not found");
    return sendSuccess(res, 200, "Booking fetched", booking);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) return sendError(res, 404, "Booking not found");
    return sendSuccess(res, 200, "Booking updated", booking);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return sendError(res, 404, "Booking not found");
    return sendSuccess(res, 200, "Booking deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/bookings/stats
// @access  Private
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "Confirmed" });
    const pendingBookings   = await Booking.countDocuments({ status: "Pending" });
    const completedBookings = await Booking.countDocuments({ status: "Completed" });

    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly booking volume for current year
    const currentYear = new Date().getFullYear();
    const monthlyData = await Booking.aggregate([
      {
        $match: {
          eventDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id:   { $month: "$eventDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Event type breakdown
    const eventTypeBreakdown = await Booking.aggregate([
      { $group: { _id: "$eventType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return sendSuccess(res, 200, "Stats fetched", {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      monthlyData,
      eventTypeBreakdown,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingStats,
};

const Client  = require("../models/Client.model");
const Booking = require("../models/Booking.model");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;

    const query = { isActive: true };
    if (type)   query.type = type;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const total   = await Client.countDocuments(query);
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return sendSuccess(res, 200, "Clients fetched", {
      clients,
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

// @desc    Get single client with bookings
// @route   GET /api/clients/:id
// @access  Private
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return sendError(res, 404, "Client not found");

    const bookings = await Booking.find({ client: client._id }).sort({ eventDate: -1 });

    return sendSuccess(res, 200, "Client fetched", { client, bookings });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!client) return sendError(res, 404, "Client not found");
    return sendSuccess(res, 200, "Client updated", client);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Delete (deactivate) client
// @route   DELETE /api/clients/:id
// @access  Private
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!client) return sendError(res, 404, "Client not found");
    return sendSuccess(res, 200, "Client deactivated");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get client stats
// @route   GET /api/clients/stats
// @access  Private
const getClientStats = async (req, res) => {
  try {
    const total      = await Client.countDocuments({ isActive: true });
    const individual = await Client.countDocuments({ type: "Individual", isActive: true });
    const corporate  = await Client.countDocuments({ type: "Corporate",  isActive: true });
    const regular    = await Client.countDocuments({ type: "Regular",    isActive: true });

    // Top 5 clients by spend
    const topClients = await Client.find({ isActive: true })
      .sort({ totalSpend: -1 })
      .limit(5)
      .select("name email totalSpend totalEvents");

    return sendSuccess(res, 200, "Client stats fetched", {
      total, individual, corporate, regular, topClients,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientStats,
};

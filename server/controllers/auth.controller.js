const Admin         = require("../models/Admin.model");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/apiResponse");

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password");
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.comparePassword(password))) {
      return sendError(res, 401, "Invalid email or password");
    }

    if (!admin.isActive) {
      return sendError(res, 403, "Your account has been deactivated");
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    return sendSuccess(res, 200, "Login successful", {
      token,
      admin: {
        id:    admin._id,
        name:  admin.name,
        email: admin.email,
        role:  admin.role,
      },
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    return sendSuccess(res, 200, "Admin fetched", admin);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id).select("+password");

    if (!(await admin.comparePassword(currentPassword))) {
      return sendError(res, 401, "Current password is incorrect");
    }

    admin.password = newPassword;
    await admin.save();

    return sendSuccess(res, 200, "Password changed successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// @desc    Seed first admin (run once)
// @route   POST /api/auth/seed-admin
// @access  Public (disable after first use)
const seedAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (exists) {
      return sendError(res, 400, "Admin already exists");
    }

    const admin = await Admin.create({
      name:     "Raj Caterers Admin",
      email:    process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role:     "superadmin",
    });

    return sendSuccess(res, 201, "Admin created successfully", {
      email: admin.email,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { login, getMe, changePassword, seedAdmin };

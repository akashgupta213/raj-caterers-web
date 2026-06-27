const jwt   = require("jsonwebtoken");
const Admin = require("../models/Admin.model");
const { sendError } = require("../utils/apiResponse");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Not authorised – no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return sendError(res, 401, "Admin not found");
    }

    if (!admin.isActive) {
      return sendError(res, 403, "Account deactivated");
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendError(res, 401, "Not authorised – invalid token");
  }
};

module.exports = protect;

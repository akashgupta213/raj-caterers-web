const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,
  message:  { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  message:  { success: false, message: "Too many login attempts, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});

// Enquiry / contact form limiter
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max:      5,
  message:  { success: false, message: "Too many form submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { apiLimiter, authLimiter, formLimiter };

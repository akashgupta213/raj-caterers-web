const { sendSuccess, sendError } = require("../utils/apiResponse");
const { sendEmail } = require("../utils/sendEmail");

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return sendError(res, 400, "Name, email, and message are required");
    }

    // Send to admin
    await sendEmail({
      to:      process.env.EMAIL_USER,
      subject: `Contact Form: ${subject || "General Enquiry"} – ${name}`,
      template: "contactMessage",
      data: { name, email, phone, subject, message },
    });

    // Auto-reply to user
    await sendEmail({
      to:      email,
      subject: "We received your message – Raj Caterers",
      template: "contactAutoReply",
      data: { name },
    });

    return sendSuccess(res, 200, "Message sent successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { submitContact };

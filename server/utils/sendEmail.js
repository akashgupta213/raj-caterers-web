const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Email Templates ───────────────────────────────────────────

const templates = {
  // Client: booking confirmation
  bookingConfirmation: ({ name, eventType, eventDate, venue, guestCount, bookingId }) => ({
    subject: "Your Booking is Confirmed – Raj Caterers 🎉",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width:600px; margin:0 auto; color:#1b1c1c;">
        <div style="background:#8b4c4d; padding:32px; text-align:center;">
          <h1 style="color:#fff; font-family:Georgia,serif; margin:0;">Raj Caterers</h1>
          <p style="color:#fdacac; margin:8px 0 0;">Excellence in Every Bite</p>
        </div>
        <div style="padding:32px; background:#fcf9f8;">
          <h2 style="color:#8b4c4d;">Booking Confirmed! ✨</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We are delighted to confirm your booking with Raj Caterers. Here are your event details:</p>
          <table style="width:100%; border-collapse:collapse; margin:24px 0;">
            <tr style="background:#f0eded;"><td style="padding:12px; font-weight:600;">Event Type</td><td style="padding:12px;">${eventType}</td></tr>
            <tr><td style="padding:12px; font-weight:600;">Event Date</td><td style="padding:12px;">${eventDate}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:12px; font-weight:600;">Venue</td><td style="padding:12px;">${venue}</td></tr>
            <tr><td style="padding:12px; font-weight:600;">Guest Count</td><td style="padding:12px;">${guestCount} guests</td></tr>
            <tr style="background:#f0eded;"><td style="padding:12px; font-weight:600;">Booking ID</td><td style="padding:12px;">#${bookingId}</td></tr>
          </table>
          <p>Our team will be in touch shortly to discuss the finer details and make your event truly special.</p>
          <p>For any queries, please contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color:#8b4c4d;">${process.env.EMAIL_USER}</a></p>
          <p style="margin-top:32px;">Warm regards,<br><strong>The Raj Caterers Team</strong></p>
        </div>
        <div style="background:#1b1c1c; padding:16px; text-align:center;">
          <p style="color:#7d7577; font-size:12px; margin:0;">© ${new Date().getFullYear()} Raj Caterers. Excellence in Premium Hospitality.</p>
        </div>
      </div>
    `,
  }),

  // Admin: new booking alert
  adminBookingAlert: ({ clientName, clientEmail, clientPhone, eventType, eventDate, venue, guestCount, packageType, bookingId }) => ({
    subject: `🆕 New Booking – ${eventType} | ${clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#1b1c1c;">
        <div style="background:#8b4c4d; padding:20px; text-align:center;">
          <h2 style="color:#fff; margin:0;">New Booking Alert</h2>
        </div>
        <div style="padding:24px; background:#fcf9f8;">
          <table style="width:100%; border-collapse:collapse;">
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Client Name</td><td style="padding:10px;">${clientName}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Email</td><td style="padding:10px;">${clientEmail}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Phone</td><td style="padding:10px;">${clientPhone}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Event Type</td><td style="padding:10px;">${eventType}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Date</td><td style="padding:10px;">${eventDate}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Venue</td><td style="padding:10px;">${venue}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Guests</td><td style="padding:10px;">${guestCount}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Package</td><td style="padding:10px;">${packageType}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Booking ID</td><td style="padding:10px;">#${bookingId}</td></tr>
          </table>
        </div>
      </div>
    `,
  }),

  // Client: enquiry auto-reply
  enquiryAutoReply: ({ name, eventType }) => ({
    subject: "We received your enquiry – Raj Caterers",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width:600px; margin:0 auto;">
        <div style="background:#8b4c4d; padding:32px; text-align:center;">
          <h1 style="color:#fff; font-family:Georgia,serif; margin:0;">Raj Caterers</h1>
        </div>
        <div style="padding:32px; background:#fcf9f8;">
          <h2 style="color:#8b4c4d;">Thank you, ${name}!</h2>
          <p>We have received your enquiry for a <strong>${eventType}</strong> event.</p>
          <p>Our team will review your requirements and get back to you within <strong>24 hours</strong>.</p>
          <p>In the meantime, feel free to explore our services and menu on our website.</p>
          <p style="margin-top:32px;">Warm regards,<br><strong>The Raj Caterers Team</strong></p>
        </div>
        <div style="background:#1b1c1c; padding:16px; text-align:center;">
          <p style="color:#7d7577; font-size:12px; margin:0;">© ${new Date().getFullYear()} Raj Caterers</p>
        </div>
      </div>
    `,
  }),

  // Admin: new enquiry alert
  adminEnquiryAlert: ({ fullName, email, phone, eventType, estimatedGuests, preferredDate, message, enquiryId }) => ({
    subject: `🔔 New Enquiry – ${eventType} | ${fullName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#1b1c1c;">
        <div style="background:#8b4c4d; padding:20px; text-align:center;">
          <h2 style="color:#fff; margin:0;">New Enquiry</h2>
        </div>
        <div style="padding:24px; background:#fcf9f8;">
          <table style="width:100%; border-collapse:collapse;">
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Name</td><td style="padding:10px;">${fullName}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Email</td><td style="padding:10px;">${email}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Phone</td><td style="padding:10px;">${phone || "N/A"}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Event Type</td><td style="padding:10px;">${eventType}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Guests</td><td style="padding:10px;">${estimatedGuests || "Not specified"}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Preferred Date</td><td style="padding:10px;">${preferredDate}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Enquiry ID</td><td style="padding:10px;">#${enquiryId}</td></tr>
          </table>
          <div style="margin-top:16px; padding:16px; background:#f0eded; border-radius:8px;">
            <strong>Message:</strong><br><p style="margin:8px 0 0;">${message}</p>
          </div>
        </div>
      </div>
    `,
  }),

  // Contact form message
  contactMessage: ({ name, email, phone, subject, message }) => ({
    subject: `Contact Form: ${subject || "General Enquiry"} – ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#1b1c1c;">
        <div style="background:#8b4c4d; padding:20px; text-align:center;">
          <h2 style="color:#fff; margin:0;">Contact Form Message</h2>
        </div>
        <div style="padding:24px; background:#fcf9f8;">
          <table style="width:100%; border-collapse:collapse;">
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Name</td><td style="padding:10px;">${name}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Email</td><td style="padding:10px;">${email}</td></tr>
            <tr style="background:#f0eded;"><td style="padding:10px; font-weight:600;">Phone</td><td style="padding:10px;">${phone || "N/A"}</td></tr>
            <tr><td style="padding:10px; font-weight:600;">Subject</td><td style="padding:10px;">${subject || "General Enquiry"}</td></tr>
          </table>
          <div style="margin-top:16px; padding:16px; background:#f0eded; border-radius:8px;">
            <strong>Message:</strong><br><p style="margin:8px 0 0;">${message}</p>
          </div>
        </div>
      </div>
    `,
  }),

  // Contact auto-reply
  contactAutoReply: ({ name }) => ({
    subject: "We got your message – Raj Caterers",
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
        <div style="background:#8b4c4d; padding:32px; text-align:center;">
          <h1 style="color:#fff; font-family:Georgia,serif; margin:0;">Raj Caterers</h1>
        </div>
        <div style="padding:32px; background:#fcf9f8;">
          <h2 style="color:#8b4c4d;">Hi ${name},</h2>
          <p>Thank you for contacting us. We have received your message and will get back to you within <strong>24 hours</strong>.</p>
          <p style="margin-top:32px;">Warm regards,<br><strong>The Raj Caterers Team</strong></p>
        </div>
      </div>
    `,
  }),
};

// ─── Main sendEmail function ───────────────────────────────────

const sendEmail = async ({ to, subject, template, data, html }) => {
  try {
    let emailHtml = html;
    let emailSubject = subject;

    if (template && templates[template]) {
      const rendered = templates[template](data);
      emailHtml    = rendered.html;
      emailSubject = rendered.subject || subject;
    }

    const mailOptions = {
      from:    process.env.EMAIL_FROM,
      to,
      subject: emailSubject,
      html:    emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    // Don't throw — email failure shouldn't break the API response
  }
};

module.exports = { sendEmail };

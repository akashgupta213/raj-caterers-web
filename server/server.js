const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logger (dev only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes ────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/enquiries",require("./routes/enquiry.routes"));
app.use("/api/clients",  require("./routes/client.routes"));
app.use("/api/gallery",  require("./routes/gallery.routes"));
app.use("/api/menu",     require("./routes/menu.routes"));
app.use("/api/reviews",  require("./routes/review.routes"));
app.use("/api/contact",  require("./routes/contact.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Raj Caterers API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

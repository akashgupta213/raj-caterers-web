const express = require("express");
const router = express.Router();
const { uploadBanquetHall } = require("../config/cloudinary");
const {
  getPublicHalls,
  getAllHalls,
  getHallById,
  createHall,
  addImages,
  deleteImage,
  updateHall,
  deleteHall,
} = require("../controllers/banquetHall.controller");

// ⚠️ Swap in whatever auth/admin-only middleware you already use in gallery.routes.js, e.g.:
// const { protect, adminOnly } = require("../middleware/auth.middleware");

// Public
router.get("/", getPublicHalls);

// Admin — "/all" MUST be declared before "/:id" or Express will treat "all" as an :id
router.get("/all", /* protect, adminOnly, */ getAllHalls);
router.post("/", /* protect, adminOnly, */ uploadBanquetHall.array("images", 10), createHall);
router.post("/:id/images", /* protect, adminOnly, */ uploadBanquetHall.array("images", 10), addImages);
router.delete("/:id/images", /* protect, adminOnly, */ deleteImage);
router.put("/:id", /* protect, adminOnly, */ updateHall);
router.delete("/:id", /* protect, adminOnly, */ deleteHall);

// Public detail — declared last
router.get("/:id", getHallById);

module.exports = router;
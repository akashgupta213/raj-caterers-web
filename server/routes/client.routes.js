const express = require("express");
const router  = express.Router();
const {
  getAllClients, getClientById,
  updateClient, deleteClient, getClientStats,
} = require("../controllers/client.controller");
const protect = require("../middleware/auth.middleware");

// All private
router.get("/stats",  protect, getClientStats);
router.get("/",       protect, getAllClients);
router.get("/:id",    protect, getClientById);
router.put("/:id",    protect, updateClient);
router.delete("/:id", protect, deleteClient);

module.exports = router;
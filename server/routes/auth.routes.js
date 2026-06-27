const express = require("express");
const router  = express.Router();
const { login, getMe, changePassword, seedAdmin } = require("../controllers/auth.controller");
const protect = require("../middleware/auth.middleware");

router.post("/login",           login);
router.post("/seed-admin",      seedAdmin);   // run once then disable
router.get( "/me",              protect, getMe);
router.put( "/change-password", protect, changePassword);

module.exports = router;

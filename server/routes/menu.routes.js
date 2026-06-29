const express  = require("express");
const router   = express.Router();
const { createItem, getItems, getAllItems, updateItem, deleteItem } = require("../controllers/menu.controller");
const protect  = require("../middleware/auth.middleware");
const { uploadMenu } = require("../config/cloudinary");

router.get("/",        getItems);                                         // public
router.get("/all",     protect, getAllItems);                             // admin
router.post("/",       protect, uploadMenu.single("image"), createItem);  // admin
router.put("/:id",     protect, uploadMenu.single("image"), updateItem);  // admin
router.delete("/:id",  protect, deleteItem);                             // admin

module.exports = router;
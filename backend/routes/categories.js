const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const {getAllCategories} = require("../controllers/categoryController");

router.get("/", authenticateToken, getAllCategories);

module.exports = router;
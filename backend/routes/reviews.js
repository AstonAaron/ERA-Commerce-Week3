const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {createReview} = require("../controllers/reviewController");

router.post = ("/", authenticateToken, createReview);

module.exports = router;
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {createOrder, getAllOrders, getMyOrders, getOrderById} = require("../controllers/orderController");

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getAllOrders);
router.get("/my", authenticateToken, getMyOrders);
router.get("/:id", authenticateToken, getOrderById);

module.exports = router;
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const authorizeRole = require("../middleware/authorizeRole");

const {getSalesReport, getTopProducts, getCategorySales, getInventory} = require("../controllers/reportController");

router.get ("/sales", authenticateToken, authorizeRole("admin"), getSalesReport);
router.get ("/top-products", authenticateToken, authorizeRole("admin"), getTopProducts);
router.get("/category-sales", authenticateToken, authorizeRole("admin"), getCategorySales);
router.get("/inventory", authenticateToken, authorizeRole("admin"), getInventory);

module.exports = router;
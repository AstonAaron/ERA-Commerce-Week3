const db = require("../db");

const getSalesReport = (req, res) => {
    const sql = "SELECT count(*) AS total_orders, SUM(total_amount) AS total_revenue, AVG(total_amount) AS average_order_value, MAX(total_amount) AS highest_order, MIN(total_amount) AS lowest_order FROM orders;"
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        res.json(results[0]);
    });
};

const getTopProducts = (req, res) => {
    const sql = "SELECT p.id, p.name as product_name, SUM(oi.quantity) AS total_sold, SUM(oi.subtotal) AS total_revenue FROM order_items oi INNER JOIN products p ON p.id = oi.product_id GROUP BY p.id, p.name ORDER BY total_sold DESC LIMIT 10";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        res.json(results);
    });
};

const getCategorySales = (req, res) => {
    const sql = "SELECT c.id, c.name as category_name, COUNT(oi.id) AS total_orders, SUM(oi.subtotal) AS total_revenue, AVG(oi.subtotal) AS average_order_value FROM order_items oi INNER JOIN products p ON p.id = oi.product_id RIGHT JOIN categories c ON c.id = p.category_id GROUP BY c.id, c.name HAVING SUM(oi.subtotal) > 0 ORDER BY total_revenue DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        res.json(results);
    });
};

const getInventory = (req, res) => {
    const sql = "SELECT p.id, p.name, p.stock_quantity, c.name AS category_name, CASE WHEN p.stock_quantity > 10 then 'in_stock' WHEN p.stock_quantity > 0 THEN 'low_stock' ELSE 'out_of_stock' END AS stock_status FROM products p INNER JOIN categories c ON c.id = p.category_id ORDER BY p.stock_quantity ASC";
    db.query(sql, (err, results) => {
        if (err)
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        res.json(results);
    });
};

module.exports = {getSalesReport, getTopProducts, getCategorySales, getInventory};
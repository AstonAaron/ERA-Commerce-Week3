const db = require("../db");
const getAllCategories = (req, res) => {
    const sql =
        "SELECT c.id, c.name, c.description, COUNT(p.id) AS product_count FROM categories c LEFT JOIN products p ON  p.category_id = c.id GROUP BY c.id, c.name, c.description ORDER BY c.id ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        res.json(results);
    });
};

module.exports = {getAllCategories};
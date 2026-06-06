const db = require("../db");
const { getMongo } = require("../mongo");

const getAllProducts = (req, res) => {
    const sql =
        "SELECT p.id, p.name, p.description, p.price, p.stock_quantity, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id ORDER BY p.id ASC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: "Server error" });
        res.json(results);
    });
};

const getProductsByCategory = (req, res) => {
    const { categoryId } = req.params;
    const sql =
        "SELECT p.id, p.name, p.description, p.price, p.stock_quantity, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id WHERE p.category_id = ? ORDER BY p.id ASC";
    db.query(sql, [categoryId], (err, results) => {
        if (err) return res.status(500).json({ message: "Server Error" });
        res.json(results);
    });
};

const getProductById = async (req, res) => {
    const { id } = req.params;

    const sql = `SELECT p.id, p.name, p.description, p.price, p.stock_quantity, c.name AS category_name FROM products p INNER JOIN categories c ON p.category_id = c.id WHERE p.id = ?`;

    db.query(sql, [id], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const product = results[0];

        try {
            const mongoDb = getMongo();
            const reviews = await mongoDb
                .collection("product_reviews")
                .find({ product_id: Number(id) })
                .toArray();

            return res.json({ ...product, reviews });
        } catch (mongoErr) {
            console.error("MongoDB Error:", mongoErr);

            return res.json({ ...product, reviews: [] });
        }
    });
};

const createProduct = async (req, res) => {
    const { name, description, price, stock_quantity, category_id } = req.body;

    if (!name || !price || !category_id) {
        return res.status(400).json({
            message: "Name, price, and category ID are required"
        });
    }

    const sql = ` INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES (?, ?, ?, ?, ?) `;

    db.query(sql, [name, description, price, stock_quantity, category_id], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }

        try {
            const mongoDb = getMongo();

            await mongoDb.collection("inventory_logs").insertOne({
                product_id: result.insertId,
                product_name: name,
                action: "restocked",
                quantity_change: stock_quantity || 0,
                previous_stock: 0,
                new_stock: stock_quantity || 0,
                timestamp: new Date()
            });
        } catch (mongoErr) {
            console.error("MongoDB log failed:", mongoErr.message);
        }

        res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId
        });
    });
};

module.exports = { getAllProducts, getProductsByCategory, getProductById, createProduct};
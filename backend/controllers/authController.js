const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
 
const login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Server error." });
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    });
};
 
const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({message: "All fields are required."});
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
        db.query(sql, [first_name, last_name, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({message: "Email already registered."});
                }
                return res.status(500).json({message: "Server error."});
            }
            res.status(201).json({message: "User registered successfully.", userId: result.insertId});
        });
    } catch (err) {
        res.status(500).json({message: "Server error."});
    }
};
 
module.exports = {login, register};
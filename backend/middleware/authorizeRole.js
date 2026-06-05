function authorizeRole(role) {
    return function (req, res, next) {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden. Admins only boi" });
        }
        next();
    };
}

module.exports = authorizeRole;


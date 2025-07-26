const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header is required" });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Bearer token is required" });
        }
        
        const payload = jwt.verify(token, process.env.JWT_SECRET || "FiMoney");
        console.log('Token payload:', payload);
        
        const user = await db`select * from fiMoney.user where(username = ${payload.username})`;
        if (user.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }
        
        req.user = user[0];
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        } else if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "Authentication error" });
    }
}

module.exports = isAuthenticated;
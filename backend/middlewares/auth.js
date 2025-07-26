const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, "FiMoney");
        console.log(payload);
        const user = await db`select * from fiMoney.user where(username = ${payload.username})`;
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid Token" });
    }
    next();
}

module.exports = isAuthenticated;
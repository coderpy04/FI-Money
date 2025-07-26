const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @desc    Middleware to protect routes by verifying JWT
 */
module.exports = function (req, res, next) {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token is provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify the token
    try {
        // Decode the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user's information (from the token's payload) to the request object
        req.user = decoded.user;

        // Call the next middleware in the stack
        next();
    } catch (err) {
        // If the token is not valid (e.g., expired or malformed)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
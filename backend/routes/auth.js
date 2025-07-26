const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

const { hashPassword, checkPassword } = require('../utils/encrytion');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        
        const existing = await db`SELECT * from fiMoney.user where (username = ${username});`
        if (existing.length > 0) {
            return res.status(409).json({ message: "username already exists" });
        }
        
        const hashedPassword = await hashPassword(password);
        const result = await db`INSERT INTO fiMoney.user(username,password) VALUES(${username}, ${hashedPassword}) RETURNING id;`
        return res.status(201).json({ message: "User Created Successfully", user_id: result[0].id });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: "Internal server error during registration" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        
        const result = await db`SELECT id,username,password FROM fiMoney.user WHERE (username = ${username})`;
        const user = result.length > 0 ? result[0] : null;
        
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const isValidPassword = await checkPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || "FiMoney");
        return res.status(200).json({ message: "login successful", access_token: token, username: username });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error during login" });
    }
});

module.exports = router;
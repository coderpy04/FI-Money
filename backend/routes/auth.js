const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const jwt = require('jsonwebtoken');

const { hashPassword, checkPassword } = require('../utils/encryption');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existing = await db`SELECT * from fiMoney.user where (username = ${username});`
    if (existing != 0) {
        return res.status(409).json({ message: "username already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const result = await db`INSERT INTO fiMoney.user(username,password) VALUES(${username}, ${hashedPassword}) `
    return res.status(201).json({ message: "User Created Successfully" });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await db`SELECT id,username,password FROM fiMoney.user WHERE (username = ${username})`;
    const user = result.length > 0 ? result[0] : null;
    if (!user) {
        return res.status(404).json("user not found");
    }

    if (!(await checkPassword(password, user.password))) {
        return res.status(401).json("Invalid Credentials");
    }
    if ((await checkPassword(password, user.password))) {
        const token = jwt.sign({ username: user.username }, "FiMoney");
        return res.status(200).json({ message: "login successful", access_token: token, username: username });
    }
    return res.send("something is wrong");
});

module.exports = router;
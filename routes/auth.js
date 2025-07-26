const express = require('express');
const router = express.Router();
// Destructure both register and login from the controller
const { register, login } = require('../controllers/authController');

// Add the new register route
router.post('/register', register);

router.post('/login', login);

module.exports = router;
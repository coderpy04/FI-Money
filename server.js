const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
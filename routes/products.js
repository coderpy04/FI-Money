// routes/products.js

const express = require('express');
const router = express.Router();
const {
    addProduct,
    getProducts,
    updateProductQuantity,
} = require('../controllers/productController');
// Import the middleware
const authMiddleware = require('../middleware/authMiddleware');

// Apply the middleware to the routes you want to protect
router.post('/', authMiddleware, addProduct);
router.get('/', authMiddleware, getProducts);
router.put('/:id/quantity', authMiddleware, updateProductQuantity);

module.exports = router;
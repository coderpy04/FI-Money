const Product = require('../models/Product');

/**
 * @route   POST /api/products
 * @desc    Add a new product
 * @access  Private
 */
exports.addProduct = async (req, res) => {
    // Destructure the product details from the request body
    const { name, type, sku, image_url, description, quantity, price } = req.body;

    try {
        // Check if a product with the same SKU already exists
        let product = await Product.findOne({ sku });

        if (product) {
            return res.status(400).json({ msg: 'Product with this SKU already exists' });
        }

        // Create a new instance of the Product model
        product = new Product({
            name,
            type,
            sku,
            image_url,
            description,
            quantity,
            price,
        });

        // Save the new product to the database
        await product.save();

        // Respond with the new product's ID and a confirmation message
        res.status(201).json({
            msg: 'Product added successfully',
            productId: product.id,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination
 * @access  Private
 */
exports.getProducts = async (req, res) => {
    // Get page and limit from query parameters, with default values
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
        // Execute queries to get products for the current page and the total count
        const products = await Product.find().skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments();

        // Respond with the list of products and pagination details
        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @route   PUT /api/products/:id/quantity
 * @desc    Update a product's quantity
 * @access  Private
 */
exports.updateProductQuantity = async (req, res) => {
    const { quantity } = req.body;

    // Check if the provided quantity is a valid integer
    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
        return res.status(400).json({ msg: 'Quantity must be an integer.' });
    }

    try {
        // Find the product by its ID and update its quantity
        // The { new: true } option returns the modified document
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { quantity } },
            { new: true }
        );

        // If no product is found with that ID, return a 404 error
        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Respond with the updated product details
        res.json({
            msg: 'Product quantity updated successfully',
            product: updatedProduct,
        });
    } catch (err) {
        console.error(err.message);
        // Handle cases like an invalid MongoDB ObjectId
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(500).send('Server Error');
    }
};
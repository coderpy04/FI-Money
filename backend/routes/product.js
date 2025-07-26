const express = require('express');
const router = express.Router();
const db = require('../utils/db');

const isAuthenticated = require('../middlewares/auth');

router.post('/', isAuthenticated, async (req, res) => {
    const { name, type, sku, image_url, description, quantity, price } = req.body;
    try {
        if (!name || !type || !sku || !description || !price) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const result = await db`INSERT INTO fiMoney.products(name,type,sku,image_url,description,quantity,price) VALUES(${name}, ${type}, ${sku}, ${image_url}, ${description}, ${quantity}, ${price}) RETURNING * ;`
        return res.status(201).json({ product_id: result[0].id });
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something Went Wrong");
    }
});

router.put('/:id/quantity', isAuthenticated, async (req, res) => {
    const product_id = req.params.id;
    const { quantity } = req.body;
    const products = await db`select * from fiMoney.products where(id = ${product_id});`;
    if (products.length == 0) {
        return res.status(400).json("Invalid Product Id");
    }
    const result = await db`update fiMoney.products SET quantity = ${quantity} where id = ${product_id} RETURNING *;`;
    console.log(result);
    return res.status(200).json({ message: "Product Quantity Updated", product_id: result[0], quantity: result[0].quantity });
});

router.get('/', isAuthenticated, async (req, res) => {
    const page = req.query?.page ? req.query.page : 1;
    const result = await db`select * from fiMoney.products order by id limit 10 offset ${(10 * (page - 1))}`;
    return res.status(200).json(result);
});

module.exports = router;
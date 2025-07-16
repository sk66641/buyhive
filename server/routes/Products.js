const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const { adminMiddleware } = require('../Middleware/adminMiddleware');
const router = express.Router();

router.post('/', adminMiddleware, createProduct)
    .get('/', fetchAllProducts)
    .get('/:id', fetchProductById)
    .patch('/:id', adminMiddleware, updateProduct);

exports.router = router;
const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product');
const { adminMiddleware } = require('../Middleware/adminMiddleware');
const { productMiddleware } = require('../Middleware/productMiddleware');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createProduct)
    .get('/', productMiddleware, fetchAllProducts)
    .get('/:id', productMiddleware, fetchProductById)
    .patch('/:id', authMiddleware, adminMiddleware, updateProduct);

exports.router = router;
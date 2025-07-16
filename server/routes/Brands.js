const express = require('express');
const { fetchAllBrands, createBrand } = require('../controller/Brand');
const { adminMiddleware } = require('../Middleware/adminMiddleware');
const router = express.Router();

router.get('/', fetchAllBrands).post('/', adminMiddleware, createBrand);

exports.router = router;
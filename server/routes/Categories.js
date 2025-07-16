const express = require('express');
const { fetchAllCategories, createCategory } = require('../controller/Category');
const { adminMiddleware } = require('../Middleware/adminMiddleware');
const router = express.Router();

router.get('/', fetchAllCategories).post('/', adminMiddleware, createCategory);

exports.router = router;
const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, fetchAllOrders } = require('../controller/Order');
const { adminMiddleware } = require('../Middleware/adminMiddleware');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', createOrder).get('/user', fetchOrdersByUser).delete('/:id', authMiddleware, deleteOrder).patch('/:id', adminMiddleware, updateOrder).get('/', adminMiddleware, fetchAllOrders);

exports.router = router;
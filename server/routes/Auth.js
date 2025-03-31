const express = require('express');
const { createUser, loginUser } = require('../controller/Auth');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/signup', authMiddleware, createUser).post('/login', authMiddleware, loginUser);

exports.router = router;
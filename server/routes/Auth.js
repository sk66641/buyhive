const express = require('express');
const { createUser, loginUser, logout } = require('../controller/Auth');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();
const jwt = require('jsonwebtoken')

router.post('/signup', createUser).get('/logout', logout).post('/login', loginUser).get('/', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://buyhive-get.vercel.app"); // ✅ Allow frontend
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        res.json(decoded);

    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

exports.router = router;
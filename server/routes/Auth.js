const express = require('express');
const { createUser, loginUser, logout, sendMail, resetPassword } = require('../controller/Auth');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { resetPasswordRequest } = require('../controller/Auth');

router.post('/signup', createUser).get('/logout', logout).post('/login', loginUser).post('/reset-password-request', resetPasswordRequest).post('/reset-password', resetPassword).get('/', async (req, res) => {
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
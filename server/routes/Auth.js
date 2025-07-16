const express = require('express');
const { createUser, loginUser, logout, sendMail, resetPassword } = require('../controller/Auth');
const { authMiddleware } = require('../Middleware/authMiddleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { resetPasswordRequest } = require('../controller/Auth');

router.post('/signup', createUser).get('/logout', logout).post('/login', loginUser).post('/reset-password-request', resetPasswordRequest).post('/reset-password', resetPassword);

exports.router = router;
const express = require('express');
const { createUser, loginUser, logout, resetPassword } = require('../controller/Auth');
const router = express.Router();
const { resetPasswordRequest } = require('../controller/Auth');

router.post('/signup', createUser).get('/logout', logout).post('/login', loginUser).post('/reset-password-request', resetPasswordRequest).post('/reset-password', resetPassword);

exports.router = router;
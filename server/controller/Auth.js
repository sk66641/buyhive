const { User } = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendMail } = require('../services/common');

exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const response = await user.save();
        // Generate JWT token
        const token = jwt.sign(
            { id: response._id, name: user.name, email: response.email, role: response.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send token in response
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(201).json({ id: response._id, name: user.name, email: response.email, role: response.role });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ message: 'Error creating user' });
    }
}


exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: 'User not found' })
        }
        if (!(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({ message: 'invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(400).json({ message: 'Error logging in' });
    }
}

exports.logout = (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        domain: 'buyhive-get.vercel.app'
    };

    res.status(200)
        .clearCookie("token", options)
        .json({ message: 'Logged out successfully' });
}
exports.resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        await user.save();

        const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;
        const subject = "Reset password request";
        const html = `<a href="${resetPasswordLink}">Click to reset password</a>`

        res.json(sendMail(email, subject, html));
    } catch (error) {
        console.error("Error processing password reset request:", error);
        res.status(500).json({ message: 'Error processing password reset request' });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, email, password } = req.body;

        if (!token || !email || !password) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const user = await User.findOne({ email, resetPasswordToken: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found or invalid token' });
        }

        user.password = password;
        user.resetPasswordToken = null;
        await user.save();

        const subject = "Password Reset Successful";
        const html = `<p>Your password has been successfully reset.</p>`;

        res.json(sendMail(email, subject, html));
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: 'Error resetting password' });
    }
}
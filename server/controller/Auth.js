const { User } = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
            { id: response._id, email: response.email, role: response.role, addresses: response.addresses, orders: response.orders },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1h" }
        );

        // Send token in response
        res.cookie("token", token);
        // res.status(201);
        res.status(201).json({ id: response._id, email: response.email, role: response.role, addresses: response.addresses, orders: response.orders });
    } catch (error) {
        res.status(400).json(error);
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
            { id: user._id, email: user.email, role: user.role, addresses: user.addresses, orders: user.orders },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );
        res.cookie("token", token);
        res.status(201).json({ id: user._id, email: user.email, role: user.role, addresses: user.addresses, orders: user.orders });
    } catch (error) {
        res.status(400).json(error);
    }
}

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};
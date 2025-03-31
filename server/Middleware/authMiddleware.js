const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded; // Attach user info (id, role) to request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};


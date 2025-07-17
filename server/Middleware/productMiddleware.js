const jwt = require('jsonwebtoken');

exports.productMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        console.warn('Invalid token, proceeding as anonymous');
    }

    next();
};

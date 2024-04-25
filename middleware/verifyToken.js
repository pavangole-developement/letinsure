const jwt = require('jsonwebtoken');

const verifyTokenFromCookie = (req, res, next) => {
    try {
        // Extract token from cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Set user information in request object for further use
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyTokenFromCookie;

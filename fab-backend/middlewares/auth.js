const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret'

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
}

function authorizeProvider(req, res, next) {
    if (req.user && req.user.role === 'provider') {
        next();
    } else {
        res.status(403).json({ error: "Forbidden - Only providers can perform this action" });
    }
}

module.exports = { authenticate, authorizeProvider };

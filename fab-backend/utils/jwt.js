const jwt = require('jsonwebtoken');

function generateToken(payload) {
    // Ensure the secret key is available
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });
    
}

module.exports = generateToken;

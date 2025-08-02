import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token is required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        req.userId = user.userId;
        next();
    });
};

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registration attempts per hour
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware to check if user is admin (for future use)
const isAdmin = (req, res, next) => {
    // This would check if the user has admin privileges
    // For now, we'll just pass through
    next();
};

export { 
    authenticateToken, 
    loginLimiter, 
    registerLimiter, 
    isAdmin 
};
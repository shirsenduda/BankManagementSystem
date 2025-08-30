import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Middleware to authenticate admin JWT token
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Admin access token is required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired admin token'
            });
        }

        // Verify that the token contains admin information
        if (!decoded.isAdmin || decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        
        req.adminId = decoded.userId; // This will be 'admin'
        req.isAdmin = decoded.isAdmin;
        next();
    });
};

// Rate limiting for admin login attempts
const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // More restrictive than client login
    message: {
        success: false,
        message: 'Too many admin login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiting for admin API calls
const adminApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute for admin operations
    message: {
        success: false,
        message: 'Too many admin API requests. Please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware to log admin activities
const logAdminActivity = (action) => {
    return (req, res, next) => {
        // Log admin activities for audit trail
        console.log(`[ADMIN ACTIVITY] ${new Date().toISOString()} - Action: ${action} - Admin: ${req.adminId} - IP: ${req.ip}`);
        
        // You can extend this to save to a database if needed
        req.adminAction = action;
        next();
    };
};

// Middleware to validate admin environment variables
const validateAdminConfig = (req, res, next) => {
    if (!process.env.ADMIN_ID || !process.env.ADMIN_PASSWORD) {
        console.error('Admin configuration missing in environment variables');
        return res.status(500).json({
            success: false,
            message: 'Server configuration error'
        });
    }
    next();
};

export { 
    authenticateAdmin, 
    adminLoginLimiter, 
    adminApiLimiter,
    logAdminActivity,
    validateAdminConfig
};
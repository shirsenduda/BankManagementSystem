import express from 'express';
import { 
    authenticateAdmin, 
    adminLoginLimiter, 
    adminApiLimiter,
    logAdminActivity,
    validateAdminConfig
} from '../middleware/adminAuth.js';
import {
    adminLogin,
    getDashboardStats,
    getAllClients,
    updateClientStatus,
    getAllAccounts,
    getAllTransactions,
    getAllFixedDeposits,
    adminLogout
} from '../controllers/adminController.js';

const router = express.Router();

// Public admin routes
router.post('/login', adminLoginLimiter, validateAdminConfig, adminLogin);

// Protected admin routes - all require authentication and rate limiting
router.use(authenticateAdmin); // Apply to all routes below
router.use(adminApiLimiter); // Apply rate limiting to all admin API calls

// Dashboard
router.get('/dashboard', logAdminActivity('VIEW_DASHBOARD'), getDashboardStats);

// Client Management
router.get('/clients', logAdminActivity('VIEW_CLIENTS'), getAllClients);
router.put('/client-status/:clientId', logAdminActivity('UPDATE_CLIENT_STATUS'), updateClientStatus);

// Account Management
router.get('/accounts', logAdminActivity('VIEW_ACCOUNTS'), getAllAccounts);

// Transaction Management
router.get('/transactions', logAdminActivity('VIEW_TRANSACTIONS'), getAllTransactions);

// Fixed Deposit Management
router.get('/fixed-deposits', logAdminActivity('VIEW_FIXED_DEPOSITS'), getAllFixedDeposits);

// Logout
router.post('/logout', logAdminActivity('LOGOUT'), adminLogout);

export default router;
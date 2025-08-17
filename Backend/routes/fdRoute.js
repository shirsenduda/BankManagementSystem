import express from 'express';
import { authenticateToken } from '../middleware/clientAuth.js';
import {
    createFixedDeposit,
    getMyFixedDeposits,
    getFixedDepositDetails,
    closeFixedDeposit,
    getFDPlans,
    processMonthlyIncrements,
} from '../controllers/fixedDepositController.js';

const fdRoute = express.Router();

// Public routes
fdRoute.get('/plans', getFDPlans);

// Protected routes (Client only)
fdRoute.post('/create', authenticateToken, createFixedDeposit);
fdRoute.get('/my-fds', authenticateToken, getMyFixedDeposits);
fdRoute.get('/details/:fdId', authenticateToken, getFixedDepositDetails);
fdRoute.post('/close/:fdId', authenticateToken, closeFixedDeposit);

// System route for processing monthly increments (will be called by scheduler)
fdRoute.post('/process-monthly-increments', processMonthlyIncrements);

export default fdRoute;
// transactionRoutes.js - Make sure your routes are configured correctly
import express from 'express';
import { authenticateToken } from '../middleware/clientAuth.js';
import {
  getAccountsByType,
  getMySenderAccounts,
  createTransferOrder,
  verifyAndCompleteTransfer,
  getTransactionHistory,
  getTransactionDetails,
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Fund transfer routes
router.get('/accounts-by-type/:accountType', getAccountsByType);
router.get('/my-accounts/:accountType', getMySenderAccounts);
router.post('/create-order', createTransferOrder);

// CRITICAL: Make sure this route matches your frontend call
router.post('/verify-transfer', verifyAndCompleteTransfer);

// Transaction history routes
router.get('/history', getTransactionHistory);
router.get('/details/:transactionId', getTransactionDetails);

export default router;
import express from 'express';
import { authenticateToken } from '../middleware/clientAuth.js';
import {
    createAccount,
    getMyAccounts,
    getAccountDetails,
    searchAccountById,
    getAllActiveAccounts,
    getRecipientAccounts, // Add this
    updateAccountStatus,
    getAccountTypes,
    closeAccount
} from '../controllers/accountController.js';

const accountRoute = express.Router();

// Public routes
accountRoute.get('/types', getAccountTypes);

// Protected routes
accountRoute.post('/create', authenticateToken, createAccount);
accountRoute.get('/my-accounts', authenticateToken, getMyAccounts);
accountRoute.get('/details/:accountNumber', authenticateToken, getAccountDetails);
accountRoute.get('/search/:accountId', authenticateToken, searchAccountById);
accountRoute.get('/all-active', authenticateToken, getAllActiveAccounts);

// NEW: Route for getting recipient accounts by type for transfers
accountRoute.get('/recipients/:accountType', authenticateToken, getRecipientAccounts);

accountRoute.put('/status/:accountId', authenticateToken, updateAccountStatus);
accountRoute.delete('/close/:accountId', authenticateToken, closeAccount);

export default accountRoute;
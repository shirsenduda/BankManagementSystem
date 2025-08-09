import accountModel from '../models/accountModel.js';
import clientModel from '../models/clientModel.js';
import mongoose from 'mongoose';

// @desc    Create new account
// @route   POST /api/account/create
// @access  Private
const createAccount = async (req, res) => {
    try {
        const { accountType, purpose, initialDeposit } = req.body;
        const clientId = req.userId;

        // Validation
        if (!accountType) {
            return res.status(400).json({
                success: false,
                message: 'Account type is required'
            });
        }

        if (!['Savings', 'Current'].includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid account type. Must be Savings or Current'
            });
        }

        // Check if client exists and is active
        const client = await clientModel.findById(clientId);
        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Allow both Active and Pending clients to create accounts
        if (!['Active', 'Pending'].includes(client.status)) {
            return res.status(403).json({
                success: false,
                message: `Client account status is ${client.status}. Cannot create bank accounts with this status.`
            });
        }

        // Check if client already has this type of account
        const existingAccount = await accountModel.findOne({
            clientId,
            accountType,
            status: { $ne: 'Closed' }
        });

        if (existingAccount) {
            return res.status(400).json({
                success: false,
                message: `You already have an active ${accountType} account`
            });
        }

        // Validate initial deposit
        const minimumDeposit = accountType === 'Savings' ? 1000 : 5000;
        if (initialDeposit && initialDeposit < minimumDeposit) {
            return res.status(400).json({
                success: false,
                message: `Minimum initial deposit for ${accountType} account is ₹${minimumDeposit}`
            });
        }

        // Create new account
        const newAccount = new accountModel({
            clientId,
            accountType,
            balance: initialDeposit || 0,
            metadata: {
                purpose: purpose || '',
                notes: `${accountType} account created for ${client.name}`
            }
        });

        await newAccount.save();

        // Populate client details for response
        await newAccount.populate('clientId', 'name email accountNumber');

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            account: {
                _id: newAccount._id,
                accountNumber: newAccount.accountNumber,
                accountType: newAccount.accountType,
                balance: newAccount.balance,
                status: newAccount.status,
                minimumBalance: newAccount.minimumBalance,
                interestRate: newAccount.interestRate,
                openedDate: newAccount.openedDate,
                client: newAccount.clientId
            }
        });

    } catch (error) {
        console.error('Create account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during account creation'
        });
    }
};

// @desc    Get all accounts for a client
// @route   GET /api/account/my-accounts
// @access  Private
const getMyAccounts = async (req, res) => {
    try {
        const clientId = req.userId;

        const accounts = await accountModel.find({
            clientId,
            status: { $ne: 'Closed' }
        }).populate('clientId', 'name email accountNumber')
          .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            accounts: accounts.map(account => ({
                _id: account._id,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                status: account.status,
                minimumBalance: account.minimumBalance,
                interestRate: account.interestRate,
                dailyTransactionLimit: account.dailyTransactionLimit,
                monthlyTransactionLimit: account.monthlyTransactionLimit,
                openedDate: account.openedDate,
                lastActivityDate: account.lastActivityDate,
                isVerified: account.isVerified
            }))
        });

    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching accounts'
        });
    }
};

// @desc    Get account details
// @route   GET /api/account/details/:accountNumber
// @access  Private
const getAccountDetails = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const clientId = req.userId;

        // Find account belonging to the authenticated client
        const account = await accountModel.findOne({
            accountNumber,
            clientId
        }).populate('clientId', 'name email phone city state');

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found or you do not have access to this account'
            });
        }

        res.status(200).json({
            success: true,
            account: {
                _id: account._id,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                status: account.status,
                minimumBalance: account.minimumBalance,
                interestRate: account.interestRate,
                dailyTransactionLimit: account.dailyTransactionLimit,
                monthlyTransactionLimit: account.monthlyTransactionLimit,
                monthlyTransactionAmount: account.monthlyTransactionAmount,
                dailyTransactionAmount: account.dailyTransactionAmount,
                openedDate: account.openedDate,
                lastActivityDate: account.lastActivityDate,
                lastTransactionDate: account.lastTransactionDate,
                branchCode: account.branchCode,
                isVerified: account.isVerified,
                metadata: account.metadata,
                client: account.clientId
            }
        });

    } catch (error) {
        console.error('Get account details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching account details'
        });
    }
};

// @desc    Update account status (for admin use)
// @route   PUT /api/account/status/:accountId
// @access  Private (Admin only)
const updateAccountStatus = async (req, res) => {
    try {
        const { accountId } = req.params;
        const { status } = req.body;
        const clientId = req.userId;

        if (!['Active', 'Inactive', 'Frozen', 'Closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const account = await accountModel.findOne({
            _id: accountId,
            clientId
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found or you do not have access to this account'
            });
        }

        account.status = status;
        account.lastActivityDate = new Date();
        await account.save();

        res.status(200).json({
            success: true,
            message: `Account status updated to ${status}`,
            account: {
                _id: account._id,
                accountNumber: account.accountNumber,
                status: account.status,
                lastActivityDate: account.lastActivityDate
            }
        });

    } catch (error) {
        console.error('Update account status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating account status'
        });
    }
};

// @desc    Get account types and their features
// @route   GET /api/account/types
// @access  Public
const getAccountTypes = async (req, res) => {
    try {
        const accountTypes = {
            Savings: {
                type: 'Savings',
                minimumBalance: 1000,
                minimumDeposit: 1000,
                interestRate: 3.5,
                dailyTransactionLimit: 10000,
                monthlyTransactionLimit: 50000,
                features: [
                    'Earn interest on your balance',
                    'Low minimum balance requirement',
                    'Suitable for personal savings',
                    'Free online banking',
                    'ATM access'
                ]
            },
            Current: {
                type: 'Current',
                minimumBalance: 5000,
                minimumDeposit: 5000,
                interestRate: 0,
                dailyTransactionLimit: 50000,
                monthlyTransactionLimit: 200000,
                features: [
                    'Higher transaction limits',
                    'No limit on transactions',
                    'Suitable for business use',
                    'Overdraft facility available',
                    'Priority banking services'
                ]
            }
        };

        res.status(200).json({
            success: true,
            accountTypes
        });

    } catch (error) {
        console.error('Get account types error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching account types'
        });
    }
};

// @desc    Close account
// @route   DELETE /api/account/close/:accountId
// @access  Private
const closeAccount = async (req, res) => {
    try {
        const { accountId } = req.params;
        const clientId = req.userId;

        const account = await accountModel.findOne({
            _id: accountId,
            clientId
        });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found or you do not have access to this account'
            });
        }

        if (account.status === 'Closed') {
            return res.status(400).json({
                success: false,
                message: 'Account is already closed'
            });
        }

        if (account.balance > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot close account with remaining balance. Please withdraw all funds first.'
            });
        }

        account.status = 'Closed';
        account.lastActivityDate = new Date();
        await account.save();

        res.status(200).json({
            success: true,
            message: 'Account closed successfully',
            account: {
                _id: account._id,
                accountNumber: account.accountNumber,
                status: account.status
            }
        });

    } catch (error) {
        console.error('Close account error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while closing account'
        });
    }
};

export {
    createAccount,
    getMyAccounts,
    getAccountDetails,
    updateAccountStatus,
    getAccountTypes,
    closeAccount
};
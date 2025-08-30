import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientModel from '../models/clientModel.js';
import accountModel from '../models/accountModel.js';
import transactionModel from '../models/transactionModel.js';
import FixedDepositModel from '../models/fixedDepositModel.js';

// Generate JWT Token for Admin
const generateAdminToken = () => {
    return jwt.sign(
        { 
            userId: 'admin', 
            role: 'admin',
            isAdmin: true 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8h' } // Shorter expiry for admin
    );
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
    try {
        const { adminId, password } = req.body;

        // Validation
        if (!adminId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Admin ID and password are required'
            });
        }

        // Get admin credentials from environment
        const envAdminId = process.env.ADMIN_ID;
        const envAdminPassword = process.env.ADMIN_PASSWORD;

        if (!envAdminId || !envAdminPassword) {
            console.error('Admin credentials not found in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Verify admin credentials
        if (adminId !== envAdminId || password !== envAdminPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Generate token
        const token = generateAdminToken();

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: envAdminId,
                role: 'admin',
                loginTime: new Date()
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin login'
        });
    }
};

// @desc    Get Dashboard Statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
    try {
        // Get client statistics
        const totalClients = await clientModel.countDocuments();
        const activeClients = await clientModel.countDocuments({ status: 'Active' });
        const pendingClients = await clientModel.countDocuments({ status: 'Pending' });
        const suspendedClients = await clientModel.countDocuments({ status: 'Suspended' });

        // Get account statistics
        const totalAccounts = await accountModel.countDocuments();
        const activeAccounts = await accountModel.countDocuments({ status: 'Active' });
        const savingsAccounts = await accountModel.countDocuments({ accountType: 'Savings' });
        const currentAccounts = await accountModel.countDocuments({ accountType: 'Current' });

        // Get transaction statistics
        const totalTransactions = await transactionModel.countDocuments();
        const completedTransactions = await transactionModel.countDocuments({ status: 'Completed' });
        const pendingTransactions = await transactionModel.countDocuments({ status: 'Pending' });
        const failedTransactions = await transactionModel.countDocuments({ status: 'Failed' });

        // Calculate total transaction volume
        const transactionVolume = await transactionModel.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Get Fixed Deposit statistics
        const totalFDs = await FixedDepositModel.countDocuments();
        const activeFDs = await FixedDepositModel.countDocuments({ status: 'Active' });
        const maturedFDs = await FixedDepositModel.countDocuments({ status: 'Matured' });

        // Calculate total FD investment
        const fdInvestment = await FixedDepositModel.aggregate([
            { $match: { status: { $in: ['Active', 'Matured'] } } },
            { $group: { _id: null, total: { $sum: '$principalAmount' } } }
        ]);

        // Get recent activities
        const recentTransactions = await transactionModel
            .find({ status: 'Completed' })
            .populate('senderClientId', 'name email')
            .populate('recipientClientId', 'name email')
            .sort({ completedAt: -1 })
            .limit(10);

        const recentClients = await clientModel
            .find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('name email status accountNumber createdAt');

        res.status(200).json({
            success: true,
            dashboard: {
                clients: {
                    total: totalClients,
                    active: activeClients,
                    pending: pendingClients,
                    suspended: suspendedClients
                },
                accounts: {
                    total: totalAccounts,
                    active: activeAccounts,
                    savings: savingsAccounts,
                    current: currentAccounts
                },
                transactions: {
                    total: totalTransactions,
                    completed: completedTransactions,
                    pending: pendingTransactions,
                    failed: failedTransactions,
                    volume: transactionVolume[0]?.total || 0
                },
                fixedDeposits: {
                    total: totalFDs,
                    active: activeFDs,
                    matured: maturedFDs,
                    totalInvestment: fdInvestment[0]?.total || 0
                },
                recentActivities: {
                    transactions: recentTransactions.map(txn => ({
                        transactionId: txn.transactionId,
                        amount: txn.amount,
                        sender: txn.senderClientId?.name || 'Unknown',
                        recipient: txn.recipientClientId?.name || 'Unknown',
                        date: txn.completedAt
                    })),
                    clients: recentClients
                }
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard statistics'
        });
    }
};

// @desc    Get All Clients
// @route   GET /api/admin/clients
// @access  Private (Admin)
const getAllClients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const search = req.query.search || '';

        // Build query
        let query = {};
        if (status && ['Pending', 'Active', 'Suspended', 'Closed'].includes(status)) {
            query.status = status;
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { accountNumber: searchRegex },
                { phone: searchRegex }
            ];
        }

        const clients = await clientModel
            .find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalClients = await clientModel.countDocuments(query);

        res.status(200).json({
            success: true,
            clients,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalClients / limit),
                totalClients,
                limit
            }
        });

    } catch (error) {
        console.error('Get all clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching clients'
        });
    }
};

// @desc    Update Client Status
// @route   PUT /api/admin/client-status/:clientId
// @access  Private (Admin)
const updateClientStatus = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Active', 'Suspended', 'Closed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const client = await clientModel.findByIdAndUpdate(
            clientId,
            { status },
            { new: true }
        ).select('-password');

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Client status updated to ${status}`,
            client
        });

    } catch (error) {
        console.error('Update client status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating client status'
        });
    }
};

// @desc    Get All Accounts
// @route   GET /api/admin/accounts
// @access  Private (Admin)
const getAllAccounts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const accountType = req.query.accountType;
        const status = req.query.status;

        let query = {};
        if (accountType && ['Savings', 'Current'].includes(accountType)) {
            query.accountType = accountType;
        }
        if (status && ['Active', 'Inactive', 'Frozen', 'Closed'].includes(status)) {
            query.status = status;
        }

        const accounts = await accountModel
            .find(query)
            .populate('clientId', 'name email accountNumber status')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalAccounts = await accountModel.countDocuments(query);

        res.status(200).json({
            success: true,
            accounts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalAccounts / limit),
                totalAccounts,
                limit
            }
        });

    } catch (error) {
        console.error('Get all accounts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching accounts'
        });
    }
};

// @desc    Get All Transactions
// @route   GET /api/admin/transactions
// @access  Private (Admin)
const getAllTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let query = {};
        if (status && ['Pending', 'Completed', 'Failed'].includes(status)) {
            query.status = status;
        }

        const transactions = await transactionModel
            .find(query)
            .populate('senderClientId', 'name email accountNumber')
            .populate('recipientClientId', 'name email accountNumber')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalTransactions = await transactionModel.countDocuments(query);

        res.status(200).json({
            success: true,
            transactions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions,
                limit
            }
        });

    } catch (error) {
        console.error('Get all transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching transactions'
        });
    }
};

// @desc    Get All Fixed Deposits
// @route   GET /api/admin/fixed-deposits
// @access  Private (Admin)
const getAllFixedDeposits = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let query = {};
        if (status && ['Active', 'Matured', 'Premature_Closure'].includes(status)) {
            query.status = status;
        }

        const fixedDeposits = await FixedDepositModel
            .find(query)
            .populate('clientId', 'name email accountNumber')
            .populate('sourceAccountId', 'accountNumber accountType')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalFDs = await FixedDepositModel.countDocuments(query);

        // Add current values to FDs
        const fdsWithCurrentValues = fixedDeposits.map(fd => ({
            ...fd.toObject(),
            currentValue: fd.calculateCurrentValue(),
            isMature: fd.isMature(),
            monthsElapsed: fd.getMonthsElapsed()
        }));

        res.status(200).json({
            success: true,
            fixedDeposits: fdsWithCurrentValues,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalFDs / limit),
                totalFDs,
                limit
            }
        });

    } catch (error) {
        console.error('Get all fixed deposits error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching fixed deposits'
        });
    }
};

// @desc    Admin Logout
// @route   POST /api/admin/logout
// @access  Private (Admin)
const adminLogout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Admin logged out successfully'
        });
    } catch (error) {
        console.error('Admin logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin logout'
        });
    }
};

export {
    adminLogin,
    getDashboardStats,
    getAllClients,
    updateClientStatus,
    getAllAccounts,
    getAllTransactions,
    getAllFixedDeposits,
    adminLogout
};
// Razorpay utility functions
import crypto from 'crypto';

export const generateRazorpaySignature = (orderId, paymentId, secret) => {
    const sign = orderId + "|" + paymentId;
    return crypto
        .createHmac("sha256", secret)
        .update(sign.toString())
        .digest("hex");
};

export const verifyRazorpaySignature = (orderId, paymentId, signature, secret) => {
    const expectedSignature = generateRazorpaySignature(orderId, paymentId, secret);
    return signature === expectedSignature;
};

// Transaction fee calculation
export const calculateTransactionFee = (amount, accountType = 'Savings') => {
    // Different fee structures based on account type and amount
    if (accountType === 'Current') {
        // Business accounts have different fee structure
        if (amount <= 50000) return 0; // Free for amounts up to 50k
        if (amount <= 100000) return Math.round(amount * 0.005); // 0.5%
        return Math.round(amount * 0.003); // 0.3% for higher amounts
    } else {
        // Savings account fee structure
        if (amount <= 10000) return 0; // Free for amounts up to 10k
        if (amount <= 50000) return Math.round(amount * 0.01); // 1%
        return Math.round(amount * 0.008); // 0.8% for higher amounts
    }
};

// Validate transfer limits
export const validateTransferLimits = (amount, accountType = 'Savings') => {
    const limits = {
        Savings: {
            daily: 10000,
            monthly: 50000,
            perTransaction: 25000
        },
        Current: {
            daily: 50000,
            monthly: 200000,
            perTransaction: 100000
        }
    };

    const accountLimits = limits[accountType];
    
    if (amount > accountLimits.perTransaction) {
        return {
            valid: false,
            message: `Per transaction limit exceeded. Maximum: ₹${accountLimits.perTransaction}`
        };
    }

    return { valid: true };
};
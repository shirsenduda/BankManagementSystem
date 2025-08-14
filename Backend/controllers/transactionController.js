import transactionModel from "../models/transactionModel.js";
import accountModel from "../models/accountModel.js";
import clientModel from "../models/clientModel.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay with better error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("Razorpay initialized successfully");
} catch (error) {
  console.error("Razorpay initialization failed:", error);
}

// Updated verifyAndCompleteTransfer function - removed minimum balance check

const verifyAndCompleteTransfer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    console.log("=== VERIFY TRANSFER START ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // STEP 1: Extract payment data with comprehensive fallback
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Alternative formats
      orderId,
      paymentId,
      signature,
      order_id,
      payment_id,
    } = req.body;

    const clientId = req.userId;

    const finalOrderId = razorpay_order_id || orderId || order_id;
    const finalPaymentId = razorpay_payment_id || paymentId || payment_id;
    const finalSignature = razorpay_signature || signature;

    console.log("Extracted data:", {
      finalOrderId,
      finalPaymentId: finalPaymentId
        ? finalPaymentId.substring(0, 10) + "..."
        : "missing",
      finalSignature: finalSignature
        ? finalSignature.substring(0, 10) + "..."
        : "missing",
      clientId,
    });

    // STEP 2: Validation
    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Missing required payment verification data",
        required: [
          "razorpay_order_id",
          "razorpay_payment_id",
          "razorpay_signature",
        ],
        received: Object.keys(req.body),
      });
    }

    // STEP 3: Find transaction with multiple strategies
    console.log("Searching for transaction...");

    let transaction = await transactionModel
      .findOne({
        razorpayOrderId: finalOrderId,
        senderClientId: clientId,
        status: "Pending",
      })
      .session(session);

    // Fallback: Search by recent pending transactions
    if (!transaction) {
      console.log("Trying fallback search...");
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      transaction = await transactionModel
        .findOne({
          senderClientId: clientId,
          status: "Pending",
          createdAt: { $gte: fiveMinutesAgo },
        })
        .sort({ createdAt: -1 })
        .session(session);

      if (transaction) {
        console.log("Found recent transaction, updating order ID");
        transaction.razorpayOrderId = finalOrderId;
        await transaction.save({ session });
      }
    }

    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Transaction not found or already processed",
        debug: {
          searchedOrderId: finalOrderId,
          clientId,
        },
      });
    }

    console.log("Transaction found:", {
      id: transaction._id,
      transactionId: transaction.transactionId,
      status: transaction.status,
      amount: transaction.amount,
    });

    // STEP 4: Verify signature (skip in development if needed)
    const isDevelopment = process.env.NODE_ENV === "development";
    const skipSignatureCheck =
      isDevelopment && process.env.SKIP_RAZORPAY_SIGNATURE === "true";

    if (!skipSignatureCheck) {
      const body = finalOrderId + "|" + finalPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== finalSignature) {
        await session.abortTransaction();

        // Mark transaction as failed
        transaction.status = "Failed";
        transaction.errorMessage = "Payment signature verification failed";
        await transaction.save({ session });

        return res.status(400).json({
          success: false,
          message: "Payment verification failed. Invalid signature.",
        });
      }
      console.log("✅ Payment signature verified");
    } else {
      console.log("⚠️ DEVELOPMENT: Skipping signature verification");
    }

    // STEP 5: Get and validate accounts
    const [senderAccount, recipientAccount] = await Promise.all([
      accountModel.findById(transaction.senderAccountId).session(session),
      accountModel.findById(transaction.recipientAccountId).session(session),
    ]);

    if (!senderAccount || !recipientAccount) {
      await session.abortTransaction();

      transaction.status = "Failed";
      transaction.errorMessage = "Account not found";
      await transaction.save({ session });

      return res.status(404).json({
        success: false,
        message: "One or both accounts not found",
      });
    }

    console.log("Accounts found:", {
      sender: {
        accountNumber: senderAccount.accountNumber,
        balance: senderAccount.balance,
        status: senderAccount.status,
      },
      recipient: {
        accountNumber: recipientAccount.accountNumber,
        balance: recipientAccount.balance,
        status: recipientAccount.status,
      },
    });

    // STEP 6: Final validations
    if (
      senderAccount.status !== "Active" ||
      recipientAccount.status !== "Active"
    ) {
      await session.abortTransaction();

      transaction.status = "Failed";
      transaction.errorMessage = "Account not active";
      await transaction.save({ session });

      return res.status(400).json({
        success: false,
        message: "One or both accounts are not active",
      });
    }

    const totalAmount = transaction.amount + transaction.fees;

    // SIMPLIFIED: Only check if sender has sufficient balance (no minimum balance requirement)
    if (senderAccount.balance < totalAmount) {
      await session.abortTransaction();

      transaction.status = "Failed";
      transaction.errorMessage = "Insufficient balance";
      await transaction.save({ session });

      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // STEP 7: Execute the transfer
    console.log("=== EXECUTING TRANSFER ===");
    console.log("Before transfer:", {
      senderBalance: senderAccount.balance,
      recipientBalance: recipientAccount.balance,
      transferAmount: transaction.amount,
      fees: transaction.fees,
      totalDeduction: totalAmount,
    });

    try {
      // Deduct from sender (amount + fees)
      senderAccount.balance -= totalAmount;
      senderAccount.updateTransactionLimits(totalAmount);
      senderAccount.lastActivityDate = new Date();
      await senderAccount.save({ session });

      console.log("✅ Sender account updated:", {
        newBalance: senderAccount.balance,
        deducted: totalAmount,
      });

      // Credit to recipient (only the transfer amount, not fees)
      recipientAccount.balance += transaction.amount;
      recipientAccount.lastActivityDate = new Date();
      await recipientAccount.save({ session });

      console.log("✅ Recipient account updated:", {
        newBalance: recipientAccount.balance,
        credited: transaction.amount,
      });

      // Update transaction status
      transaction.status = "Completed";
      transaction.razorpayPaymentId = finalPaymentId;
      transaction.razorpaySignature = finalSignature;
      transaction.completedAt = new Date();
      await transaction.save({ session });

      console.log("✅ Transaction marked as completed");

      // Commit the transaction
      await session.commitTransaction();
      console.log("✅ Database transaction committed");

      // STEP 8: Return success response
      res.status(200).json({
        success: true,
        message: "Fund transfer completed successfully",
        transaction: {
          transactionId: transaction.transactionId,
          referenceNumber: transaction.referenceNumber,
          amount: transaction.amount,
          fees: transaction.fees,
          totalAmount: totalAmount,
          status: transaction.status,
          completedAt: transaction.completedAt,
          sender: {
            accountNumber: senderAccount.accountNumber,
            newBalance: senderAccount.balance,
          },
          recipient: {
            accountNumber: recipientAccount.accountNumber,
            newBalance: recipientAccount.balance,
          },
          paymentDetails: {
            razorpayOrderId: finalOrderId,
            razorpayPaymentId: finalPaymentId,
          },
        },
      });

      console.log("=== TRANSFER COMPLETED SUCCESSFULLY ===");
    } catch (transferError) {
      console.error("❌ Transfer execution error:", transferError);

      // Mark transaction as failed
      transaction.status = "Failed";
      transaction.errorMessage = `Transfer failed: ${transferError.message}`;
      await transaction.save({ session });

      throw transferError;
    }
  } catch (error) {
    await session.abortTransaction();
    console.error("❌ Verify transfer error:", error);

    res.status(500).json({
      success: false,
      message: "Server error during fund transfer",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  } finally {
    await session.endSession();
  }
};

// Helper function to calculate transfer fees
const calculateTransferFees = (amount, accountType = "Savings") => {
  try {
    const numericAmount = parseFloat(amount);

    if (accountType === "Current") {
      if (numericAmount <= 50000) return 0;
      if (numericAmount <= 100000) return Math.round(numericAmount * 0.005);
      return Math.round(numericAmount * 0.003);
    } else {
      if (numericAmount <= 1000) return 5;
      if (numericAmount <= 10000) return 10;
      return Math.min(Math.round(numericAmount * 0.001), 100);
    }
  } catch (error) {
    console.error("Fee calculation error:", error);
    return 10;
  }
};

// @desc    Get accounts by type for fund transfer
// @route   GET /api/transaction/accounts-by-type/:accountType
// @access  Private
const getAccountsByType = async (req, res) => {
  try {
    const { accountType } = req.params;
    const clientId = req.userId;

    if (!["Savings", "Current"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type. Must be Savings or Current",
      });
    }

    // Get all active accounts of the specified type (excluding current user's accounts)
    const accounts = await accountModel
      .find({
        accountType,
        status: "Active",
        clientId: { $ne: clientId }, // Exclude current user's accounts
      })
      .populate("clientId", "name email accountNumber")
      .select("_id accountNumber accountType clientId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      accounts: accounts.map((account) => ({
        _id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        clientName: account.clientId.name,
        clientEmail: account.clientId.email,
        clientAccountNumber: account.clientId.accountNumber,
      })),
    });
  } catch (error) {
    console.error("Get accounts by type error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching accounts",
    });
  }
};

// @desc    Get sender's accounts (user's own accounts)
// @route   GET /api/transaction/my-accounts/:accountType
// @access  Private
const getMySenderAccounts = async (req, res) => {
  try {
    const { accountType } = req.params;
    const clientId = req.userId;

    if (!["Savings", "Current"].includes(accountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type. Must be Savings or Current",
      });
    }

    // Get user's active accounts of the specified type
    const accounts = await accountModel
      .find({
        clientId,
        accountType,
        status: "Active",
      })
      .select("_id accountNumber accountType balance")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      accounts: accounts.map((account) => ({
        _id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance,
      })),
    });
  } catch (error) {
    console.error("Get sender accounts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching sender accounts",
    });
  }
};

// Fixed version of createTransferOrder function in transactionController.js

const createTransferOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error("Razorpay not initialized");
      return res.status(500).json({
        success: false,
        message: "Payment service not available",
      });
    }

    const {
      senderAccountId,
      recipientAccountId,
      amount,
      description = "",
    } = req.body;
    const clientId = req.userId;

    console.log("Transfer order request:", {
      senderAccountId,
      recipientAccountId,
      amount,
      clientId,
    });

    // Validation
    if (!senderAccountId || !recipientAccountId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Sender account, recipient account, and amount are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(senderAccountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sender account ID format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientAccountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient account ID format",
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number",
      });
    }

    if (numericAmount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum transfer amount is ₹1",
      });
    }

    if (senderAccountId === recipientAccountId) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to the same account",
      });
    }

    // Get and validate accounts
    const senderAccount = await accountModel
      .findOne({
        _id: senderAccountId,
        clientId,
        status: "Active",
      })
      .populate("clientId", "name email");

    if (!senderAccount) {
      return res.status(404).json({
        success: false,
        message: "Sender account not found or you don't have access",
      });
    }

    const recipientAccount = await accountModel
      .findOne({
        _id: recipientAccountId,
        status: "Active",
      })
      .populate("clientId", "name email");

    if (!recipientAccount) {
      return res.status(404).json({
        success: false,
        message: "Recipient account not found or inactive",
      });
    }

    // Prevent self-transfer
    if (
      senderAccount.clientId._id.toString() ===
      recipientAccount.clientId._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to your own account",
      });
    }

    // Calculate fees FIRST
    const fees = calculateTransferFees(
      numericAmount,
      senderAccount.accountType
    );
    const totalAmount = numericAmount + fees;

    console.log("Amount breakdown:", {
      transferAmount: numericAmount,
      fees: fees,
      totalAmount: totalAmount,
      senderBalance: senderAccount.balance,
      minimumBalance: senderAccount.minimumBalance,
    });

    // Simple balance check - user can send money as long as they have enough balance
    if (senderAccount.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Check transaction limits using the total amount
    const transactionCheck = senderAccount.canTransact(totalAmount, "debit");
    if (!transactionCheck.canTransact) {
      return res.status(400).json({
        success: false,
        message: transactionCheck.reason,
      });
    }

    // Generate custom transaction IDs FIRST
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const transactionId = `TXN${timestamp}${random}`;
    const referenceNumber = `REF${timestamp}${random}`;

    console.log("Generated custom IDs:", { transactionId, referenceNumber });

    // Create Razorpay order
    console.log("Creating Razorpay order...");
    const orderOptions = {
      amount: Math.round(totalAmount * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `transfer_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      notes: {
        senderAccountId: senderAccountId.toString(),
        recipientAccountId: recipientAccountId.toString(),
        transferAmount: numericAmount.toString(),
        fees: fees.toString(),
        description: description || "Fund Transfer",
        clientId: clientId.toString(),
        customTransactionId: transactionId,
        customReferenceNumber: referenceNumber,
      },
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
      console.log("✅ Razorpay order created:", {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (razorpayError) {
      console.error("Razorpay order creation failed:", razorpayError);
      return res.status(500).json({
        success: false,
        message: "Failed to create payment order. Please try again.",
        error:
          process.env.NODE_ENV === "development"
            ? razorpayError.message
            : undefined,
      });
    }

    // Create transaction record
    console.log("Creating transaction record...");

    const transaction = new transactionModel({
      transactionId: transactionId,
      referenceNumber: referenceNumber,
      transactionType: "Transfer",
      amount: numericAmount,
      fees: fees,
      senderAccountId: senderAccount._id,
      senderAccountNumber: senderAccount.accountNumber,
      senderClientId: senderAccount.clientId._id,
      recipientAccountId: recipientAccount._id,
      recipientAccountNumber: recipientAccount.accountNumber,
      recipientClientId: recipientAccount.clientId._id,
      razorpayOrderId: razorpayOrder.id,
      description: description || "Fund Transfer",
      status: "Pending",
      metadata: {
        userAgent: req.get("User-Agent") || "",
        ipAddress: req.ip || req.connection.remoteAddress || "",
      },
    });

    try {
      const validationError = transaction.validateSync();
      if (validationError) {
        console.error("Validation error:", validationError);
        return res.status(400).json({
          success: false,
          message: "Transaction validation failed",
          error: validationError.message,
        });
      }

      await transaction.save();
      console.log("✅ Transaction saved successfully:", {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        razorpayOrderId: transaction.razorpayOrderId,
      });
    } catch (saveError) {
      console.error("Transaction save error:", saveError);
      return res.status(500).json({
        success: false,
        message: "Failed to save transaction record",
        error:
          process.env.NODE_ENV === "development"
            ? saveError.message
            : undefined,
      });
    }

    // Return success response
    console.log("✅ Transfer order created successfully");
    res.status(200).json({
      success: true,
      message: "Transfer order created successfully",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        transactionId: transaction.transactionId,
        referenceNumber: transaction.referenceNumber,
      },
      transferDetails: {
        senderAccount: {
          _id: senderAccount._id,
          accountNumber: senderAccount.accountNumber,
          accountType: senderAccount.accountType,
          currentBalance: senderAccount.balance,
          holderName: senderAccount.clientId.name,
        },
        recipientAccount: {
          _id: recipientAccount._id,
          accountNumber: recipientAccount.accountNumber,
          accountType: recipientAccount.accountType,
          recipientName: recipientAccount.clientId.name,
          recipientEmail: recipientAccount.clientId.email,
        },
        amount: numericAmount,
        fees: fees,
        totalAmount: totalAmount,
        description: description || "Fund Transfer",
      },
    });
  } catch (error) {
    console.error("Create transfer order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating transfer order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// @desc    Get transaction history
// @route   GET /api/transaction/history
// @access  Private
const getTransactionHistory = async (req, res) => {
  try {
    const clientId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type; // 'sent' or 'received' or undefined for all

    let query = {
      $or: [{ senderClientId: clientId }, { recipientClientId: clientId }],
      status: { $in: ["Completed", "Failed"] },
    };

    // Filter by transaction type
    if (type === "sent") {
      query = {
        senderClientId: clientId,
        status: { $in: ["Completed", "Failed"] },
      };
    } else if (type === "received") {
      query = {
        recipientClientId: clientId,
        status: { $in: ["Completed", "Failed"] },
      };
    }

    const transactions = await transactionModel
      .find(query)
      .populate("senderClientId", "name email accountNumber")
      .populate("recipientClientId", "name email accountNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTransactions = await transactionModel.countDocuments(query);

    res.status(200).json({
      success: true,
      transactions: transactions.map((transaction) => ({
        _id: transaction._id,
        transactionId: transaction.transactionId,
        referenceNumber: transaction.referenceNumber,
        amount: transaction.amount,
        fees: transaction.fees,
        status: transaction.status,
        type:
          transaction.senderClientId._id.toString() === clientId
            ? "sent"
            : "received",
        description: transaction.description,
        senderAccount: transaction.senderAccountNumber,
        recipientAccount: transaction.recipientAccountNumber,
        senderName: transaction.senderClientId.name,
        recipientName: transaction.recipientClientId.name,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTransactions / limit),
        totalTransactions,
        limit,
      },
    });
  } catch (error) {
    console.error("Get transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transaction history",
    });
  }
};

// @desc    Get transaction details by ID
// @route   GET /api/transaction/details/:transactionId
// @access  Private
const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const clientId = req.userId;

    const transaction = await transactionModel
      .findOne({
        $or: [
          { transactionId, senderClientId: clientId },
          { transactionId, recipientClientId: clientId },
        ],
      })
      .populate("senderClientId", "name email accountNumber")
      .populate("recipientClientId", "name email accountNumber");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or you don't have access",
      });
    }

    res.status(200).json({
      success: true,
      transaction: {
        _id: transaction._id,
        transactionId: transaction.transactionId,
        referenceNumber: transaction.referenceNumber,
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        fees: transaction.fees,
        status: transaction.status,
        description: transaction.description,
        senderAccount: transaction.senderAccountNumber,
        recipientAccount: transaction.recipientAccountNumber,
        sender: transaction.senderClientId,
        recipient: transaction.recipientClientId,
        createdAt: transaction.createdAt,
        completedAt: transaction.completedAt,
        razorpayPaymentId: transaction.razorpayPaymentId,
        errorMessage: transaction.errorMessage,
      },
    });
  } catch (error) {
    console.error("Get transaction details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching transaction details",
    });
  }
};

export {
  getAccountsByType,
  getMySenderAccounts,
  createTransferOrder,
  verifyAndCompleteTransfer,
  getTransactionHistory,
  getTransactionDetails,
};

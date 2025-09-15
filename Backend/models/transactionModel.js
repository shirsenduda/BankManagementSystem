import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    // Transaction Identification - REMOVED unique: true to prevent duplicate index warning
    transactionId: {
      type: String,
      // Remove required: true - we'll set it manually
    },
    
    // Transaction Type
    transactionType: {
      type: String,
      enum: ["Transfer", "Deposit", "Withdrawal", "Payment"],
      required: true
    },
    
    // Amount
    amount: {
      type: Number,
      required: true,
      min: [1, 'Amount must be greater than 0']
    },
    
    // Sender Account Details
    senderAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    
    senderAccountNumber: {
      type: String,
      required: true
    },
    
    senderClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    
    // Recipient Account Details
    recipientAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    
    recipientAccountNumber: {
      type: String,
      required: true
    },
    
    recipientClientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    
    // Transaction Status
    status: {
      type: String,
      enum: ["Pending", "Processing", "Completed", "Failed", "Cancelled"],
      default: "Pending"
    },
    
    // Payment Gateway Details
    razorpayOrderId: {
      type: String,
      default: null
    },
    
    razorpayPaymentId: {
      type: String,
      default: null
    },
    
    razorpaySignature: {
      type: String,
      default: null
    },
    
    // Transaction Description/Notes
    description: {
      type: String,
      default: ""
    },
    
    // Transaction Fees (if any)
    fees: {
      type: Number,
      default: 0
    },
    
    // Reference Number for tracking - REMOVED unique: true to prevent duplicate index warning
    referenceNumber: {
      type: String
    },
    
    // Transaction completion date
    completedAt: {
      type: Date,
      default: null
    },
    
    // Error message (if failed)
    errorMessage: {
      type: String,
      default: null
    },
    
    // Additional metadata
    metadata: {
      userAgent: String,
      ipAddress: String,
      deviceInfo: String
    }
  },
  {
    timestamps: true,
  }
);

// NO PRE-HOOKS - We'll generate IDs manually in the controller

// Static method to generate unique IDs
transactionSchema.statics.generateUniqueIds = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  
  return {
    transactionId: `TXN${timestamp}${random}`,
    referenceNumber: `REF${timestamp}${random}`
  };
};

// Add indexes manually to prevent duplicate warnings
transactionSchema.index({ senderClientId: 1 });
transactionSchema.index({ recipientClientId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ transactionType: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ transactionId: 1 }, { unique: true }); // Make this unique
transactionSchema.index({ referenceNumber: 1 }, { unique: true }); // Make this unique
transactionSchema.index({ razorpayOrderId: 1 });

const transactionModel = mongoose.model("Transaction", transactionSchema);

export default transactionModel;
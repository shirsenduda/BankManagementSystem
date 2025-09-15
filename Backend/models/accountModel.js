import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    // Account Identification
    accountNumber: {
      type: String,
      unique: true,
      // Remove required: true since we're generating it in pre-save
    },

    // Reference to the client who owns this account
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Account Type
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      required: true,
    },

    // Balance
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },

    // Account Status
    status: {
      type: String,
      enum: ["Active", "Inactive", "Frozen", "Closed"],
      default: "Active",
    },

    // Interest Rate removed - no longer applicable
    // interestRate: {
    //   type: Number,
    //   default: function() {
    //     return this.accountType === 'Savings' ? 3.5 : 0;
    //   }
    // },

    // Minimum Balance Requirements
    minimumBalance: {
      type: Number,
      default: function () {
        return this.accountType === "Savings" ? 1000 : 5000;
      },
    },

    // Monthly Transaction Limit
    monthlyTransactionLimit: {
      type: Number,
      default: function () {
        return this.accountType === "Savings" ? 50000 : 200000;
      },
    },

    // Daily Transaction Limit
    dailyTransactionLimit: {
      type: Number,
      default: function () {
        return this.accountType === "Savings" ? 10000 : 50000;
      },
    },

    // Transaction tracking for limits
    monthlyTransactionAmount: {
      type: Number,
      default: 0,
    },

    dailyTransactionAmount: {
      type: Number,
      default: 0,
    },

    lastTransactionDate: {
      type: Date,
      default: Date.now,
    },

    // Account opening date
    openedDate: {
      type: Date,
      default: Date.now,
    },

    // Last activity
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },

    // Branch Information (optional)
    branchCode: {
      type: String,
      default: "MAIN001",
    },

    // Account holder verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Additional metadata
    metadata: {
      purpose: {
        type: String,
        default: "",
      },
      notes: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate account number before saving - use 'validate' hook instead of 'save'
accountSchema.pre("validate", function (next) {
  if (this.isNew && !this.accountNumber) {
    const prefix = this.accountType === "Savings" ? "SAV" : "CUR";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.accountNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Method to check if account can perform transaction - SIMPLIFIED
accountSchema.methods.canTransact = function (
  amount,
  transactionType = "debit"
) {
  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const accountMonth = new Date(this.lastTransactionDate).getMonth();

  // Reset daily and monthly counters if needed
  if (new Date(this.lastTransactionDate).toDateString() !== today) {
    this.dailyTransactionAmount = 0;
  }

  if (accountMonth !== currentMonth) {
    this.monthlyTransactionAmount = 0;
  }

  // Check account status
  if (this.status !== "Active") {
    return { canTransact: false, reason: "Account is not active" };
  }

  if (transactionType === "debit") {
    // Only check transaction limits - NO minimum balance check

    // Check daily limit
    if (this.dailyTransactionAmount + amount > this.dailyTransactionLimit) {
      return {
        canTransact: false,
        reason: `Daily transaction limit exceeded. Limit: ₹${this.dailyTransactionLimit}`,
      };
    }

    // Check monthly limit
    if (this.monthlyTransactionAmount + amount > this.monthlyTransactionLimit) {
      return {
        canTransact: false,
        reason: `Monthly transaction limit exceeded. Limit: ₹${this.monthlyTransactionLimit}`,
      };
    }
  }

  return { canTransact: true };
};

// Method to update transaction amounts
accountSchema.methods.updateTransactionLimits = function (amount) {
  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  const accountMonth = new Date(this.lastTransactionDate).getMonth();

  // Reset counters if needed
  if (new Date(this.lastTransactionDate).toDateString() !== today) {
    this.dailyTransactionAmount = 0;
  }

  if (accountMonth !== currentMonth) {
    this.monthlyTransactionAmount = 0;
  }

  // Update amounts
  this.dailyTransactionAmount += amount;
  this.monthlyTransactionAmount += amount;
  this.lastTransactionDate = new Date();
  this.lastActivityDate = new Date();
};

// Index for better query performance
accountSchema.index({ clientId: 1 });
accountSchema.index({ status: 1 });
// Add index for accountNumber since it's used for lookups
// accountSchema.index({ accountNumber: 1 });

const accountModel = mongoose.model("Account", accountSchema);

export default accountModel;

import mongoose from "mongoose";

const fixedDepositSchema = new mongoose.Schema(
  {
    // FD Identification
    fdNumber: {
      type: String,
      unique: true,
      // Auto-generated in pre-save hook
    },

    // Reference to the client who owns this FD
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    // Reference to the source account from which money is debited
    sourceAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },

    // Principal amount deposited
    principalAmount: {
      type: Number,
      required: true,
      min: [10000, "Minimum FD amount is ₹10,000"],
    },

    // Current maturity amount (principal + accrued interest)
    currentValue: {
      type: Number,
      default: function() {
        return this.principalAmount;
      }
    },

    // Interest rate (annual percentage)
    interestRate: {
      type: Number,
      default: 6.0, // 6% annual interest
    },

    // Monthly increment amount
    monthlyIncrement: {
      type: Number,
      default: 500,
    },

    // FD Status
    status: {
      type: String,
      enum: ["Active", "Matured", "Closed", "Premature_Closure"],
      default: "Active",
    },

    // FD Term in months
    termInMonths: {
      type: Number,
      required: true,
      enum: [12, 24, 36, 60], // 1, 2, 3, 5 years
    },

    // Important dates
    startDate: {
      type: Date,
      default: Date.now,
    },

    maturityDate: {
      type: Date,
      // Remove required: true since we calculate it in pre-validate hook
    },

    lastInterestCreditDate: {
      type: Date,
      default: Date.now,
    },

    // Interest calculation tracking
    interestCredits: [{
      date: {
        type: Date,
        default: Date.now,
      },
      amount: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["monthly_increment", "interest_credit"],
        required: true,
      }
    }],

    // Premature closure penalty (if applicable)
    penaltyRate: {
      type: Number,
      default: 1.0, // 1% penalty for premature closure
    },

    // Auto-renewal settings
    autoRenewal: {
      enabled: {
        type: Boolean,
        default: false,
      },
      newTerm: {
        type: Number,
        enum: [12, 24, 36, 60],
        default: 12,
      }
    },

    // Nomination details (optional)
    nominee: {
      name: {
        type: String,
        default: "",
      },
      relationship: {
        type: String,
        default: "",
      }
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

// Auto-generate FD number before saving
fixedDepositSchema.pre("validate", function (next) {
  if (this.isNew && !this.fdNumber) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.fdNumber = `FD${timestamp}${random}`;
  }
  
  // Calculate maturity date based on term if not already set
  if (this.isNew && !this.maturityDate) {
    const maturityDate = new Date(this.startDate || Date.now());
    maturityDate.setMonth(maturityDate.getMonth() + this.termInMonths);
    this.maturityDate = maturityDate;
  }
  
  next();
});

// Remove the separate pre-save hook since we're doing everything in pre-validate

// Method to calculate current FD value with monthly increments
fixedDepositSchema.methods.calculateCurrentValue = function () {
  const now = new Date();
  const monthsElapsed = this.getMonthsElapsed();
  
  // Add monthly increments
  const totalIncrements = monthsElapsed * this.monthlyIncrement;
  
  // Calculate simple interest on growing principal
  // For simplicity, we'll calculate interest on average balance
  const avgPrincipal = this.principalAmount + (totalIncrements / 2);
  const yearsFraction = monthsElapsed / 12;
  const interest = (avgPrincipal * this.interestRate * yearsFraction) / 100;
  
  return this.principalAmount + totalIncrements + interest;
};

// Method to get months elapsed since start
fixedDepositSchema.methods.getMonthsElapsed = function () {
  const now = new Date();
  const start = new Date(this.startDate);
  
  let months = (now.getFullYear() - start.getFullYear()) * 12;
  months += now.getMonth() - start.getMonth();
  
  // Don't count partial months for increment calculation
  return Math.max(0, months);
};

// Method to check if FD is mature
fixedDepositSchema.methods.isMature = function () {
  return new Date() >= this.maturityDate;
};

// Method to calculate penalty for premature closure
fixedDepositSchema.methods.calculatePrematurePenalty = function () {
  if (this.isMature()) return 0;
  
  const currentValue = this.calculateCurrentValue();
  return (currentValue * this.penaltyRate) / 100;
};

// Method to get maturity amount
fixedDepositSchema.methods.getMaturityAmount = function () {
  const totalMonths = this.termInMonths;
  const totalIncrements = totalMonths * this.monthlyIncrement;
  
  // Calculate interest on average balance over full term
  const avgPrincipal = this.principalAmount + (totalIncrements / 2);
  const years = totalMonths / 12;
  const interest = (avgPrincipal * this.interestRate * years) / 100;
  
  return this.principalAmount + totalIncrements + interest;
};

// Static method to get FD plans
fixedDepositSchema.statics.getFDPlans = function () {
  return {
    "12": {
      termInMonths: 12,
      termLabel: "1 Year",
      interestRate: 6.0,
      monthlyIncrement: 500,
      minAmount: 10000,
      features: [
        "6% annual interest rate",
        "₹500 monthly increment",
        "Minimum deposit ₹10,000",
        "Premature withdrawal allowed with 1% penalty"
      ]
    },
    "24": {
      termInMonths: 24,
      termLabel: "2 Years",
      interestRate: 6.5,
      monthlyIncrement: 500,
      minAmount: 10000,
      features: [
        "6.5% annual interest rate",
        "₹500 monthly increment",
        "Minimum deposit ₹10,000",
        "Higher returns for longer commitment"
      ]
    },
    "36": {
      termInMonths: 36,
      termLabel: "3 Years",
      interestRate: 7.0,
      monthlyIncrement: 500,
      minAmount: 10000,
      features: [
        "7% annual interest rate",
        "₹500 monthly increment",
        "Minimum deposit ₹10,000",
        "Best returns for medium-term investment"
      ]
    },
    "60": {
      termInMonths: 60,
      termLabel: "5 Years",
      interestRate: 7.5,
      monthlyIncrement: 500,
      minAmount: 10000,
      features: [
        "7.5% annual interest rate",
        "₹500 monthly increment",
        "Minimum deposit ₹10,000",
        "Maximum returns for long-term investment"
      ]
    }
  };
};

// Indexes for better query performance
fixedDepositSchema.index({ clientId: 1 });
fixedDepositSchema.index({ status: 1 });
fixedDepositSchema.index({ fdNumber: 1 });
fixedDepositSchema.index({ maturityDate: 1 });

const FixedDepositModel = mongoose.model("FixedDeposit", fixedDepositSchema);

export default FixedDepositModel;
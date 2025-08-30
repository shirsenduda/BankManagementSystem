import FixedDepositModel from "../models/FixedDepositModel.js";
import accountModel from "../models/accountModel.js";
import clientModel from "../models/clientModel.js";
import mongoose from "mongoose";

// @desc    Create new Fixed Deposit
// @route   POST /api/fd/create
// @access  Private
const createFixedDeposit = async (req, res) => {
  try {
    const { sourceAccountId, principalAmount, termInMonths, nominee } = req.body;
    const clientId = req.userId;

    // Validation
    if (!sourceAccountId || !principalAmount || !termInMonths) {
      return res.status(400).json({
        success: false,
        message: "Source account, principal amount, and term are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(sourceAccountId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid source account ID",
      });
    }

    if (![12, 24, 36, 60].includes(parseInt(termInMonths))) {
      return res.status(400).json({
        success: false,
        message: "Invalid term. Must be 12, 24, 36, or 60 months",
      });
    }

    if (principalAmount < 10000) {
      return res.status(400).json({
        success: false,
        message: "Minimum FD amount is ₹10,000",
      });
    }

    // Check if source account exists and belongs to the client
    const sourceAccount = await accountModel.findOne({
      _id: sourceAccountId,
      clientId,
      status: "Active",
    });

    if (!sourceAccount) {
      return res.status(404).json({
        success: false,
        message: "Source account not found or inactive",
      });
    }

    // Check if account has sufficient balance
    if (sourceAccount.balance < principalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance in source account",
      });
    }

    // Check transaction limits
    const canTransact = sourceAccount.canTransact(principalAmount, "debit");
    if (!canTransact.canTransact) {
      return res.status(400).json({
        success: false,
        message: canTransact.reason,
      });
    }

    // Get interest rate based on term
    const fdPlans = FixedDepositModel.getFDPlans();
    const selectedPlan = fdPlans[termInMonths.toString()];

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Debit from source account
      sourceAccount.balance -= principalAmount;
      sourceAccount.updateTransactionLimits(principalAmount);
      await sourceAccount.save({ session });

      // Create Fixed Deposit
      const newFD = new FixedDepositModel({
        clientId,
        sourceAccountId,
        principalAmount,
        termInMonths: parseInt(termInMonths),
        interestRate: selectedPlan.interestRate,
        nominee: nominee || {},
        metadata: {
          notes: `Fixed Deposit created from account ${sourceAccount.accountNumber}`,
        },
      });

      await newFD.save({ session });

      // Populate client details for response
      await newFD.populate("clientId", "name email accountNumber");
      await newFD.populate("sourceAccountId", "accountNumber accountType");

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: "Fixed Deposit created successfully",
        fixedDeposit: {
          _id: newFD._id,
          fdNumber: newFD.fdNumber,
          principalAmount: newFD.principalAmount,
          termInMonths: newFD.termInMonths,
          interestRate: newFD.interestRate,
          monthlyIncrement: newFD.monthlyIncrement,
          startDate: newFD.startDate,
          maturityDate: newFD.maturityDate,
          expectedMaturityAmount: newFD.getMaturityAmount(),
          status: newFD.status,
          client: newFD.clientId,
          sourceAccount: newFD.sourceAccountId,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Create FD error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during FD creation",
    });
  }
};

// @desc    Get all FDs for a client
// @route   GET /api/fd/my-fds
// @access  Private
const getMyFixedDeposits = async (req, res) => {
  try {
    const clientId = req.userId;

    const fds = await FixedDepositModel
      .find({
        clientId,
        status: { $ne: "Closed" },
      })
      .populate("clientId", "name email accountNumber")
      .populate("sourceAccountId", "accountNumber accountType")
      .sort({ createdAt: -1 });

    // Calculate current values for each FD
    const fdsWithCurrentValues = fds.map((fd) => {
      const currentValue = fd.calculateCurrentValue();
      const isMature = fd.isMature();
      
      return {
        _id: fd._id,
        fdNumber: fd.fdNumber,
        principalAmount: fd.principalAmount,
        currentValue: currentValue,
        interestRate: fd.interestRate,
        monthlyIncrement: fd.monthlyIncrement,
        termInMonths: fd.termInMonths,
        startDate: fd.startDate,
        maturityDate: fd.maturityDate,
        status: fd.status,
        isMature: isMature,
        monthsElapsed: fd.getMonthsElapsed(),
        sourceAccount: fd.sourceAccountId,
      };
    });

    res.status(200).json({
      success: true,
      fixedDeposits: fdsWithCurrentValues,
      summary: {
        totalFDs: fdsWithCurrentValues.length,
        totalInvested: fdsWithCurrentValues.reduce((sum, fd) => sum + fd.principalAmount, 0),
        currentTotalValue: fdsWithCurrentValues.reduce((sum, fd) => sum + fd.currentValue, 0),
        activeFDs: fdsWithCurrentValues.filter(fd => fd.status === "Active").length,
        matureFDs: fdsWithCurrentValues.filter(fd => fd.isMature).length,
      },
    });
  } catch (error) {
    console.error("Get FDs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching Fixed Deposits",
    });
  }
};

// @desc    Get FD details
// @route   GET /api/fd/details/:fdId
// @access  Private
const getFixedDepositDetails = async (req, res) => {
  try {
    const { fdId } = req.params;
    const clientId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(fdId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FD ID format",
      });
    }

    const fd = await FixedDepositModel
      .findOne({
        _id: fdId,
        clientId,
      })
      .populate("clientId", "name email phone city state")
      .populate("sourceAccountId", "accountNumber accountType balance");

    if (!fd) {
      return res.status(404).json({
        success: false,
        message: "Fixed Deposit not found or you do not have access",
      });
    }

    const currentValue = fd.calculateCurrentValue();
    const isMature = fd.isMature();
    const monthsElapsed = fd.getMonthsElapsed();
    const maturityAmount = fd.getMaturityAmount();
    const prematurePenalty = fd.calculatePrematurePenalty();

    res.status(200).json({
      success: true,
      fixedDeposit: {
        _id: fd._id,
        fdNumber: fd.fdNumber,
        principalAmount: fd.principalAmount,
        currentValue: currentValue,
        expectedMaturityAmount: maturityAmount,
        interestRate: fd.interestRate,
        monthlyIncrement: fd.monthlyIncrement,
        termInMonths: fd.termInMonths,
        startDate: fd.startDate,
        maturityDate: fd.maturityDate,
        lastInterestCreditDate: fd.lastInterestCreditDate,
        status: fd.status,
        isMature: isMature,
        monthsElapsed: monthsElapsed,
        monthsRemaining: Math.max(0, fd.termInMonths - monthsElapsed),
        prematurePenalty: prematurePenalty,
        autoRenewal: fd.autoRenewal,
        nominee: fd.nominee,
        metadata: fd.metadata,
        client: fd.clientId,
        sourceAccount: fd.sourceAccountId,
        interestCredits: fd.interestCredits,
      },
    });
  } catch (error) {
    console.error("Get FD details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching FD details",
    });
  }
};

// @desc    Close Fixed Deposit (Premature or at maturity)
// @route   POST /api/fd/close/:fdId
// @access  Private
const closeFixedDeposit = async (req, res) => {
  try {
    const { fdId } = req.params;
    const { targetAccountId } = req.body;
    const clientId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(fdId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid FD ID format",
      });
    }

    if (!targetAccountId || !mongoose.Types.ObjectId.isValid(targetAccountId)) {
      return res.status(400).json({
        success: false,
        message: "Valid target account ID is required",
      });
    }

    // Find FD
    const fd = await FixedDepositModel.findOne({
      _id: fdId,
      clientId,
      status: "Active",
    });

    if (!fd) {
      return res.status(404).json({
        success: false,
        message: "Active Fixed Deposit not found",
      });
    }

    // Find target account
    const targetAccount = await accountModel.findOne({
      _id: targetAccountId,
      clientId,
      status: "Active",
    });

    if (!targetAccount) {
      return res.status(404).json({
        success: false,
        message: "Target account not found or inactive",
      });
    }

    const currentValue = fd.calculateCurrentValue();
    const isMature = fd.isMature();
    const penalty = fd.calculatePrematurePenalty();
    const finalAmount = currentValue - penalty;

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Credit amount to target account
      targetAccount.balance += finalAmount;
      await targetAccount.save({ session });

      // Update FD status
      fd.status = isMature ? "Matured" : "Premature_Closure";
      fd.currentValue = currentValue;
      
      // Add final interest credit record
      fd.interestCredits.push({
        date: new Date(),
        amount: finalAmount - fd.principalAmount,
        type: "interest_credit",
      });
      
      await fd.save({ session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: `Fixed Deposit ${isMature ? 'matured' : 'closed prematurely'} successfully`,
        closure: {
          fdNumber: fd.fdNumber,
          principalAmount: fd.principalAmount,
          currentValue: currentValue,
          penalty: penalty,
          finalAmount: finalAmount,
          closureType: isMature ? "Maturity" : "Premature",
          targetAccount: targetAccount.accountNumber,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error("Close FD error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while closing Fixed Deposit",
    });
  }
};

// @desc    Get FD plans and rates
// @route   GET /api/fd/plans
// @access  Public
const getFDPlans = async (req, res) => {
  try {
    const fdPlans = FixedDepositModel.getFDPlans();

    res.status(200).json({
      success: true,
      message: "FD plans retrieved successfully",
      plans: fdPlans,
      features: [
        "Monthly increment of ₹500",
        "Competitive interest rates",
        "Flexible terms from 1 to 5 years",
        "Premature withdrawal available with minimal penalty",
        "Automatic renewal options",
        "Nomination facility available",
      ],
    });
  } catch (error) {
    console.error("Get FD plans error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching FD plans",
    });
  }
};

// @desc    Process monthly increments (scheduled job)
// @route   POST /api/fd/process-monthly-increments
// @access  Private (Admin/System)
const processMonthlyIncrements = async (req, res) => {
  try {
    const activeFDs = await FixedDepositModel.find({
      status: "Active",
      maturityDate: { $gt: new Date() },
    }).populate("sourceAccountId");

    let processedCount = 0;
    const errors = [];

    for (const fd of activeFDs) {
      try {
        const now = new Date();
        const lastCreditMonth = new Date(fd.lastInterestCreditDate);
        
        // Check if a month has passed since last increment
        if (now.getMonth() !== lastCreditMonth.getMonth() || 
            now.getFullYear() !== lastCreditMonth.getFullYear()) {
          
          // Check if source account has sufficient balance
          if (fd.sourceAccountId && fd.sourceAccountId.balance >= fd.monthlyIncrement) {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
              // Debit from source account
              fd.sourceAccountId.balance -= fd.monthlyIncrement;
              await fd.sourceAccountId.save({ session });

              // Update FD
              fd.currentValue += fd.monthlyIncrement;
              fd.lastInterestCreditDate = now;
              fd.interestCredits.push({
                date: now,
                amount: fd.monthlyIncrement,
                type: "monthly_increment",
              });
              
              await fd.save({ session });
              await session.commitTransaction();
              processedCount++;
            } catch (error) {
              await session.abortTransaction();
              errors.push({
                fdNumber: fd.fdNumber,
                error: error.message,
              });
            } finally {
              await session.endSession();
            }
          } else {
            errors.push({
              fdNumber: fd.fdNumber,
              error: "Insufficient balance in source account",
            });
          }
        }
      } catch (error) {
        errors.push({
          fdNumber: fd.fdNumber,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed monthly increments for ${processedCount} FDs`,
      processedCount,
      totalFDs: activeFDs.length,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (error) {
    console.error("Process monthly increments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing monthly increments",
    });
  }
};

export {
  createFixedDeposit,
  getMyFixedDeposits,
  getFixedDepositDetails,
  closeFixedDeposit,
  getFDPlans,
  processMonthlyIncrements,
};
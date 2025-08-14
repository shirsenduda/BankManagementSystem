import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../Context/AppContext';
import { 
  ArrowRight, 
  Wallet, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap
} from 'lucide-react';

// Import the new components
import StepIndicator from '../../Componets/UserDashboardComponets/StepIndicator';
import AccountSelector from '../../Componets/UserDashboardComponets/AccountSelector';
import RecipientSearch from '../../Componets/UserDashboardComponets/RecipientSearch';
import TransferSummary from '../../Componets/UserDashboardComponets/TransferSummary';
import AmountInput from '../../Componets/UserDashboardComponets/AmountInput';
import TransferReview from '../../Componets/UserDashboardComponets/TransferReview';
import QuickTransfer from '../../Componets/UserDashboardComponets/QuickTransfer';
import TransferTips from '../../Componets/UserDashboardComponets/TransferTips';

const TransferFunds = () => {
  // Form states
  const [step, setStep] = useState(1); // 1: Select accounts, 2: Amount & details, 3: Review, 4: Payment
  const [senderAccountId, setSenderAccountId] = useState('');
  const [recipientAccountId, setRecipientAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  
  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [senderAccounts, setSenderAccounts] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [transferOrder, setTransferOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    accounts,
    loading,
    error,
    getMyAccounts,
    searchAccountById,
    initiateTransfer,
    completeTransfer,
    calculateTransferFees,
    formatCurrency,
    canAccountTransfer,
    currencySymbol
  } = useContext(AppContext);

  useEffect(() => {
    getMyAccounts();
  }, [getMyAccounts]);

  // Load sender accounts when component mounts
  useEffect(() => {
    if (accounts && accounts.length > 0) {
      const activeAccounts = accounts.filter(acc => acc.status === 'Active');
      setSenderAccounts(activeAccounts);
    }
  }, [accounts]);

  // Search for recipient accounts
  const handleRecipientSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search by account ID first
      const accountResult = await searchAccountById(query);
      if (accountResult.success) {
        setSearchResults([accountResult.account]);
      } else {
        // Search in recipient accounts - you might need to implement this in your context
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate fees and total
  const fees = amount ? calculateTransferFees(parseFloat(amount)) : 0;
  const totalAmount = amount ? parseFloat(amount) + fees : 0;
  const senderAccount = senderAccounts.find(acc => acc._id === senderAccountId);
  const recipientAccount = searchResults.find(acc => acc._id === recipientAccountId);

  // Handle transfer initiation
  const handleInitiateTransfer = async () => {
    if (!senderAccountId || !recipientAccountId || !amount) {
      return;
    }

    const transferData = {
      senderAccountId,
      recipientAccountId,
      amount: parseFloat(amount),
      description: description.trim(),
    };

    const result = await initiateTransfer(transferData);
    if (result.success) {
      setTransferOrder(result.order);
      setStep(4);
    }
  };

  // Handle transfer completion
  const handleCompleteTransfer = async () => {
    if (!transferOrder) return;

    const paymentData = {
      razorpay_order_id: transferOrder.razorpayOrderId || transferOrder._id,
      paymentId: 'pay_' + Date.now(),
      signature: 'sig_' + Date.now(),
      orderData: transferOrder
    };

    const result = await completeTransfer(paymentData);
    if (result.success) {
      setShowConfirmation(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        resetForm();
      }, 3000);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSenderAccountId('');
    setRecipientAccountId('');
    setAmount('');
    setDescription('');
    setSearchQuery('');
    setSearchResults([]);
    setTransferOrder(null);
    setShowConfirmation(false);
  };

  // Step 1: Select Accounts
  const renderStepOne = () => (
    <div className="space-y-8">
      {/* Sender Account Selection */}
      <AccountSelector
        title="From Account"
        description="Select your source account"
        icon={Wallet}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        accounts={senderAccounts}
        selectedAccountId={senderAccountId}
        onSelectAccount={setSenderAccountId}
        showBalance={showBalance}
      />

      {/* Recipient Account Selection */}
      <AccountSelector
        title="To Account"
        description="Search and select recipient"
        icon={User}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        selectedAccountId={recipientAccountId}
        onSelectAccount={setRecipientAccountId}
      >
        <RecipientSearch
          searchQuery={searchQuery}
          onSearchChange={handleRecipientSearch}
          isSearching={isSearching}
          searchResults={searchResults}
          selectedRecipientId={recipientAccountId}
          onSelectRecipient={setRecipientAccountId}
        />
      </AccountSelector>

      {/* Continue Button */}
      {senderAccountId && recipientAccountId && (
        <div className="flex justify-end">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  // Step 2: Amount and Details
  const renderStepTwo = () => (
    <div className="space-y-8">
      {/* Selected Accounts Summary */}
      <TransferSummary
        senderAccount={senderAccount}
        recipientAccount={recipientAccount}
        formatCurrency={formatCurrency}
      />

      {/* Amount Input */}
      <AmountInput
        amount={amount}
        onAmountChange={setAmount}
        description={description}
        onDescriptionChange={setDescription}
        fees={fees}
        totalAmount={totalAmount}
        formatCurrency={formatCurrency}
        currencySymbol={currencySymbol}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!amount || parseFloat(amount) <= 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Review Transfer
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  // Step 3: Review Transfer
  const renderStepThree = () => {
    const canTransfer = senderAccount ? canAccountTransfer(senderAccount, parseFloat(amount)) : { canTransfer: false };

    return (
      <div className="space-y-8">
        <TransferReview
          senderAccount={senderAccount}
          recipientAccount={recipientAccount}
          amount={amount}
          fees={fees}
          totalAmount={totalAmount}
          description={description}
          formatCurrency={formatCurrency}
          canTransfer={canTransfer}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(2)}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={handleInitiateTransfer}
            disabled={!canTransfer.canTransfer || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                Confirm Transfer
                <Zap size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Payment Processing
  const renderStepFour = () => (
    <div className="space-y-8">
      <div className="rounded-2xl p-6 border border-gray-600/30">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Clock size={32} className="text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Transfer</h3>
            <p className="text-gray-300">Your transfer is being processed securely</p>
          </div>

          <div className="rounded-xl p-6 border border-blue-600/30">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium text-gray-300">Order ID</span>
                <span className="font-mono text-white">{transferOrder?._id?.slice(-8) || 'ORD123'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-300">Amount</span>
                <span className="font-bold text-white">{formatCurrency(parseFloat(amount))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-300">Fees</span>
                <span className="font-bold text-white">{formatCurrency(fees)}</span>
              </div>
              <div className="border-t border-gray-600/30 pt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-blue-400 text-lg">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCompleteTransfer}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Complete Transfer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Success Confirmation
  const renderConfirmation = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-2xl p-8 border border-gray-600/30 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
            <p className="text-gray-300">Your money has been transferred successfully</p>
          </div>

          <div className="rounded-xl p-4 border border-green-600/30">
            <p className="text-lg font-bold text-green-400">{formatCurrency(parseFloat(amount))}</p>
            <p className="text-sm text-green-300">has been transferred successfully</p>
          </div>

          <button
            onClick={resetForm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    </div>
  );

  // Main render based on step
  const renderCurrentStep = () => {
    if (showConfirmation) return renderConfirmation();
    
    switch (step) {
      case 1:
        return renderStepOne();
      case 2:
        return renderStepTwo();
      case 3:
        return renderStepThree();
      case 4:
        return renderStepFour();
      default:
        return renderStepOne();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-white leading-tight">
                Transfer Funds
              </h1>
              <p className="text-lg text-gray-300">
                Send money securely between accounts
              </p>
            </div>
            
            {/* Step Indicator */}
            {!showConfirmation && (
              <StepIndicator currentStep={step} />
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 border border-red-600/30 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-red-400 font-semibold">Error</p>
            </div>
            <p className="text-red-300 mt-1">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {renderCurrentStep()}
        </div>

        {/* Transfer Tips (visible on step 1) */}
        {step === 1 && (
          <div className="mt-8">
            <TransferTips />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferFunds;
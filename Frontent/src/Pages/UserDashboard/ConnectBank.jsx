import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { 
  PlusCircle, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Calculator,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  X,
  ArrowRight,
  Search,
  Shield
} from 'lucide-react';

const ConnectBank = () => {
  const {
    // FD States
    fixedDeposits,
    fdPlans,
    selectedFD,
    fdSummary,
    accounts,
    loading,
    error,
    
    // FD Methods
    createFixedDeposit,
    getMyFixedDeposits,
    getFixedDepositDetails,
    closeFixedDeposit,
    getFDPlans,
    
    // Utility functions
    calculateMaturityAmount,
    calculateCurrentValue,
    calculatePrematurePenalty,
    isFDMature,
    getMonthsElapsed,
    getMonthsRemaining,
    validateFDData,
    getFDStatistics,
    getActiveFDs,
    getMatureFDs,
    formatCurrency
  } = useContext(AppContext);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateFD, setShowCreateFD] = useState(false);
  const [showFDDetails, setShowFDDetails] = useState(false);
  const [selectedFDForDetails, setSelectedFDForDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state for creating FD
  const [fdForm, setFdForm] = useState({
    sourceAccountId: '',
    principalAmount: '',
    termInMonths: '12',
    monthlyIncrement: 500
  });

  const [calculatorValues, setCalculatorValues] = useState({
    amount: '',
    term: '12',
    rate: '6.5'
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        getMyFixedDeposits(),
        getFDPlans()
      ]);
    };
    loadData();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFdForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new FD
  const handleCreateFD = async (e) => {
    e.preventDefault();
    
    const validation = validateFDData(fdForm);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const result = await createFixedDeposit({
      ...fdForm,
      principalAmount: parseFloat(fdForm.principalAmount),
      termInMonths: parseInt(fdForm.termInMonths),
      monthlyIncrement: parseInt(fdForm.monthlyIncrement)
    });

    if (result.success) {
      setShowCreateFD(false);
      setFdForm({
        sourceAccountId: '',
        principalAmount: '',
        termInMonths: '12',
        monthlyIncrement: 500
      });
    }
  };

  // View FD details
  const handleViewDetails = async (fd) => {
    setSelectedFDForDetails(fd);
    setShowFDDetails(true);
    await getFixedDepositDetails(fd._id);
  };

  // Close FD
  const handleCloseFD = async (fdId, targetAccountId) => {
    if (window.confirm('Are you sure you want to close this Fixed Deposit?')) {
      const result = await closeFixedDeposit(fdId, targetAccountId);
      if (result.success) {
        setShowFDDetails(false);
      }
    }
  };

  // Filter FDs based on search and status
  const filteredFDs = fixedDeposits.filter(fd => {
    const matchesSearch = fd.fdNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fd.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && fd.status === 'Active') ||
                         (filterStatus === 'mature' && isFDMature(fd)) ||
                         (filterStatus === 'closed' && fd.status === 'Closed');
    
    return matchesSearch && matchesStatus;
  });

  // Get statistics
  const stats = getFDStatistics();

  // Calculate maturity for calculator
  const calculatedMaturity = calculatorValues.amount ? 
    calculateMaturityAmount(
      parseFloat(calculatorValues.amount),
      parseInt(calculatorValues.term),
      parseFloat(calculatorValues.rate)
    ) : 0;

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Fixed Deposits</h1>
        <p className="text-gray-400">Secure your future with guaranteed returns</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('myFDs')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'myFDs'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My FDs ({fixedDeposits.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'calculator'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Calculator
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeTab === 'plans'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Plans & Rates
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-600/20">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Invested</h3>
              <p className="text-2xl font-bold text-white">₹{stats.totalInvested.toLocaleString()}</p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-600/20">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Current Value</h3>
              <p className="text-2xl font-bold text-white">₹{stats.currentTotalValue.toLocaleString()}</p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-600/20">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Active FDs</h3>
              <p className="text-2xl font-bold text-white">{stats.activeFDs}</p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-yellow-600/20">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Interest Earned</h3>
              <p className="text-2xl font-bold text-white">₹{stats.totalInterestEarned.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowCreateFD(true)}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New FD
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className="flex items-center px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white font-medium transition-colors"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Returns
              </button>
            </div>
          </div>

          {/* Recent FDs */}
          {fixedDeposits.length > 0 && (
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Recent Fixed Deposits</h2>
                <button
                  onClick={() => setActiveTab('myFDs')}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {fixedDeposits.slice(0, 3).map((fd) => (
                  <div key={fd._id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-green-600/20">
                        <DollarSign className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{fd.fdNumber}</h3>
                        <p className="text-sm text-gray-400">
                          {fd.termInMonths} months • {fd.interestRate}% p.a.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">₹{fd.principalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">
                        {isFDMature(fd) ? 'Mature' : `${getMonthsRemaining(fd)} months left`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* My FDs Tab */}
      {activeTab === 'myFDs' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by FD number or account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="mature">Mature</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => setShowCreateFD(true)}
              className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Create FD
            </button>
          </div>

          {/* FDs List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-400 mt-2">Loading your Fixed Deposits...</p>
            </div>
          ) : filteredFDs.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No Fixed Deposits Found</h3>
              <p className="text-gray-400 mb-6">Start building your wealth with a Fixed Deposit today</p>
              <button
                onClick={() => setShowCreateFD(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                Create Your First FD
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredFDs.map((fd) => (
                <div key={fd._id} className="border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        fd.status === 'Active' ? 'bg-green-600/20' :
                        isFDMature(fd) ? 'bg-yellow-600/20' : 'bg-gray-600/20'
                      }`}>
                        <DollarSign className={`w-6 h-6 ${
                          fd.status === 'Active' ? 'text-green-400' :
                          isFDMature(fd) ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{fd.fdNumber}</h3>
                        <p className="text-sm text-gray-400">Account: {fd.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        fd.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                        isFDMature(fd) ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {isFDMature(fd) ? 'Mature' : fd.status}
                      </span>
                      <button
                        onClick={() => handleViewDetails(fd)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Principal Amount</p>
                      <p className="font-semibold text-white">₹{fd.principalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                      <p className="font-semibold text-white">{fd.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Term</p>
                      <p className="font-semibold text-white">{fd.termInMonths} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Current Value</p>
                      <p className="font-semibold text-white">₹{calculateCurrentValue(fd).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="text-sm">
                          <span className="text-gray-400">Start Date: </span>
                          <span className="text-white">{new Date(fd.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Maturity: </span>
                          <span className="text-white">{new Date(fd.maturityDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">
                          {isFDMature(fd) ? 'Ready to close' : `${getMonthsRemaining(fd)} months remaining`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Input */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">FD Calculator</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Principal Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={calculatorValues.amount}
                    onChange={handleCalculatorChange}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Term (Months)
                  </label>
                  <select
                    name="term"
                    value={calculatorValues.term}
                    onChange={handleCalculatorChange}
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="12">12 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                    <option value="60">60 Months</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={calculatorValues.rate}
                    onChange={handleCalculatorChange}
                    step="0.1"
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Results */}
            <div className="border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Calculation Results</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Principal Amount</p>
                  <p className="text-xl font-semibold text-white">
                    ₹{calculatorValues.amount ? parseFloat(calculatorValues.amount).toLocaleString() : '0'}
                  </p>
                </div>

                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Monthly Increments</p>
                  <p className="text-xl font-semibold text-white">
                    ₹{(500 * parseInt(calculatorValues.term)).toLocaleString()}
                  </p>
                </div>

                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Interest Earned</p>
                  <p className="text-xl font-semibold text-green-400">
                    ₹{calculatorValues.amount ? 
                      (calculatedMaturity - parseFloat(calculatorValues.amount) - (500 * parseInt(calculatorValues.term))).toLocaleString() 
                      : '0'}
                  </p>
                </div>

                <div className="p-4 border border-green-600/30 rounded-lg bg-green-600/10">
                  <p className="text-sm text-gray-400 mb-1">Maturity Amount</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{calculatorValues.amount ? calculatedMaturity.toLocaleString() : '0'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setFdForm({
                    ...fdForm,
                    principalAmount: calculatorValues.amount,
                    termInMonths: calculatorValues.term
                  });
                  setShowCreateFD(true);
                }}
                className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                disabled={!calculatorValues.amount}
              >
                Create This FD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Fixed Deposit Plans</h2>
            <p className="text-gray-400">Choose the plan that suits your investment goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(fdPlans).map(([term, plan]) => (
              <div key={term} className="border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{term} Months</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-1">{plan.interestRate}%</div>
                  <p className="text-sm text-gray-400">Per Annum</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Amount</span>
                    <span className="text-white">₹{plan.minAmount?.toLocaleString() || '10,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Amount</span>
                    <span className="text-white">₹{plan.maxAmount?.toLocaleString() || '1,00,00,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monthly Add</span>
                    <span className="text-white">₹{plan.monthlyIncrement || 500}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Penalty Rate</span>
                    <span className="text-white">{plan.penaltyRate || 1}%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFdForm({
                      ...fdForm,
                      termInMonths: term,
                      monthlyIncrement: plan.monthlyIncrement || 500
                    });
                    setShowCreateFD(true);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          {/* FD Security Tips */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Fixed Deposit Security Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Your deposits are insured up to ₹5 lakhs</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Guaranteed returns with no market risk</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Automatic renewal options available</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Premature closure with minimal penalty</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create FD Modal */}
      {showCreateFD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Create Fixed Deposit</h2>
                <button
                  onClick={() => setShowCreateFD(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateFD} className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Source Account
                  </label>
                  <select
                    name="sourceAccountId"
                    value={fdForm.sourceAccountId}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select source account</option>
                    {accounts.filter(acc => acc.status === 'Active').map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.accountNumber} - {account.accountType} (₹{account.balance.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Principal Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="principalAmount"
                    value={fdForm.principalAmount}
                    onChange={handleFormChange}
                    min="10000"
                    max="10000000"
                    required
                    placeholder="Minimum ₹10,000"
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₹10,000 | Maximum: ₹1,00,00,000</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Investment Term
                  </label>
                  <select
                    name="termInMonths"
                    value={fdForm.termInMonths}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="12">12 Months - 6.5% p.a.</option>
                    <option value="24">24 Months - 7.0% p.a.</option>
                    <option value="36">36 Months - 7.5% p.a.</option>
                    <option value="60">60 Months - 8.0% p.a.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Monthly Increment (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncrement"
                    value={fdForm.monthlyIncrement}
                    onChange={handleFormChange}
                    min="500"
                    step="100"
                    className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Amount to add monthly (minimum ₹500)</p>
                </div>

                {fdForm.principalAmount && fdForm.termInMonths && (
                  <div className="p-4 border border-blue-600/30 rounded-lg bg-blue-600/10">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">Investment Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Principal Amount:</span>
                        <span className="text-white">₹{parseFloat(fdForm.principalAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Increments:</span>
                        <span className="text-white">₹{(fdForm.monthlyIncrement * fdForm.termInMonths).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Interest:</span>
                        <span className="text-green-400">
                          ₹{(calculateMaturityAmount(parseFloat(fdForm.principalAmount), parseInt(fdForm.termInMonths)) 
                            - parseFloat(fdForm.principalAmount) 
                            - (fdForm.monthlyIncrement * fdForm.termInMonths)).toLocaleString()}
                        </span>
                      </div>
                      <hr className="border-gray-600" />
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-300">Maturity Amount:</span>
                        <span className="text-green-400">
                          ₹{calculateMaturityAmount(parseFloat(fdForm.principalAmount), parseInt(fdForm.termInMonths)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateFD(false)}
                  className="flex-1 px-6 py-3 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg text-white font-medium transition-colors"
                >
                  {loading ? 'Creating...' : 'Create FD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FD Details Modal */}
      {showFDDetails && selectedFDForDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedFDForDetails.fdNumber}</h2>
                  <p className="text-gray-400">Fixed Deposit Details</p>
                </div>
                <button
                  onClick={() => setShowFDDetails(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">FD Number:</span>
                        <span className="text-white font-medium">{selectedFDForDetails.fdNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Number:</span>
                        <span className="text-white">{selectedFDForDetails.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedFDForDetails.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                          'bg-gray-600/20 text-gray-400'
                        }`}>
                          {isFDMature(selectedFDForDetails) ? 'Mature' : selectedFDForDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-white">{new Date(selectedFDForDetails.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Maturity Date:</span>
                        <span className="text-white">{new Date(selectedFDForDetails.maturityDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Investment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Principal Amount:</span>
                        <span className="text-white font-medium">₹{selectedFDForDetails.principalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interest Rate:</span>
                        <span className="text-white">{selectedFDForDetails.interestRate}% per annum</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Term:</span>
                        <span className="text-white">{selectedFDForDetails.termInMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly Increment:</span>
                        <span className="text-white">₹{selectedFDForDetails.monthlyIncrement.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Penalty Rate:</span>
                        <span className="text-white">{selectedFDForDetails.penaltyRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Value & Actions */}
                <div className="space-y-6">
                  <div className="border border-green-600/30 rounded-lg p-4 bg-green-600/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Current Value</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Months Elapsed:</span>
                        <span className="text-white">{getMonthsElapsed(selectedFDForDetails)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Months Remaining:</span>
                        <span className="text-white">{getMonthsRemaining(selectedFDForDetails)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Increments Added:</span>
                        <span className="text-white">
                          ₹{(getMonthsElapsed(selectedFDForDetails) * selectedFDForDetails.monthlyIncrement).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interest Earned:</span>
                        <span className="text-green-400 font-medium">
                          ₹{(calculateCurrentValue(selectedFDForDetails) 
                            - selectedFDForDetails.principalAmount 
                            - (getMonthsElapsed(selectedFDForDetails) * selectedFDForDetails.monthlyIncrement)).toLocaleString()}
                        </span>
                      </div>
                      <hr className="border-gray-600" />
                      <div className="flex justify-between">
                        <span className="text-gray-300 font-medium">Current Value:</span>
                        <span className="text-green-400 font-bold text-lg">
                          ₹{calculateCurrentValue(selectedFDForDetails).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedFDForDetails.status === 'Active' && (
                    <div className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">Maturity Projection</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Increments:</span>
                          <span className="text-white">
                            ₹{(selectedFDForDetails.termInMonths * selectedFDForDetails.monthlyIncrement).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Interest:</span>
                          <span className="text-green-400">
                            ₹{(calculateMaturityAmount(selectedFDForDetails.principalAmount, selectedFDForDetails.termInMonths, selectedFDForDetails.interestRate)
                              - selectedFDForDetails.principalAmount 
                              - (selectedFDForDetails.termInMonths * selectedFDForDetails.monthlyIncrement)).toLocaleString()}
                          </span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Maturity Amount:</span>
                          <span className="text-green-400 font-bold text-lg">
                            ₹{calculateMaturityAmount(selectedFDForDetails.principalAmount, selectedFDForDetails.termInMonths, selectedFDForDetails.interestRate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Premature Closure */}
                  {selectedFDForDetails.status === 'Active' && !isFDMature(selectedFDForDetails) && (
                    <div className="border border-yellow-600/30 rounded-lg p-4 bg-yellow-600/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Premature Closure</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Value:</span>
                          <span className="text-white">₹{calculateCurrentValue(selectedFDForDetails).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Penalty ({selectedFDForDetails.penaltyRate}%):</span>
                          <span className="text-red-400">-₹{calculatePrematurePenalty(selectedFDForDetails).toLocaleString()}</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Amount After Penalty:</span>
                          <span className="text-yellow-400 font-bold">
                            ₹{(calculateCurrentValue(selectedFDForDetails) - calculatePrematurePenalty(selectedFDForDetails)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {selectedFDForDetails.status === 'Active' && (
                    <div className="space-y-4">
                      {accounts.filter(acc => acc.status === 'Active').length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Select Target Account for Closure
                          </label>
                          <select
                            className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            id="targetAccount"
                          >
                            <option value="">Select account to receive amount</option>
                            {accounts.filter(acc => acc.status === 'Active').map((account) => (
                              <option key={account._id} value={account._id}>
                                {account.accountNumber} - {account.accountType}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          const targetAccountId = document.getElementById('targetAccount').value;
                          if (!targetAccountId) {
                            alert('Please select a target account');
                            return;
                          }
                          handleCloseFD(selectedFDForDetails._id, targetAccountId);
                        }}
                        className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : isFDMature(selectedFDForDetails) ? 'Close Mature FD' : 'Close FD (Premature)'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-white">Processing...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectBank;
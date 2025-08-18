import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../Context/AppContext'; // Import your actual AppContext
import { 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  PieChart,
  Activity,
  Wallet,
  Shield,
  ChevronRight,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const context = useContext(AppContext);
  
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const {
    userData,
    accounts = [],
    transactions = [],
    fixedDeposits = [],
    loading,
    error: contextError,
    formatCurrency,
    getTotalBalance,
    getTransactionStatistics,
    getFDStatistics,
    getMyAccounts,
    getTransactionHistory,
    getMyFixedDeposits,
    refreshAccountData,
    refreshTransactionData,
    refreshFDData,
    isAuthenticated
  } = context || {};

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setRefreshing(true);
        await Promise.all([
          getMyAccounts?.(),
          getTransactionHistory?.({ limit: 10 }),
          getMyFixedDeposits?.()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard initialization error:', err);
      } finally {
        setRefreshing(false);
      }
    };

    initializeData();
  }, [isAuthenticated]);

  // Refresh all data
  const handleRefreshData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await Promise.all([
        refreshAccountData?.(),
        refreshTransactionData?.({ limit: 10 }),
        refreshFDData?.()
      ]);
    } catch (err) {
      setError('Failed to refresh data');
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate statistics
  const totalBalance = getTotalBalance ? getTotalBalance() : 0;
  const transactionStats = getTransactionStatistics ? getTransactionStatistics() : {
    total: 0, sent: 0, received: 0, totalSentAmount: 0, totalReceivedAmount: 0, netAmount: 0
  };
  const fdStats = getFDStatistics ? getFDStatistics() : {
    totalFDs: 0, activeFDs: 0, totalInvested: 0, totalInterestEarned: 0
  };
  
  const activeFDs = fixedDeposits.filter(fd => fd.status === 'Active');
  const recentTransactions = transactions.slice(0, 5);
  const activeAccounts = accounts.filter(acc => acc.status === 'Active');

  // Quick stats calculation
  const quickStats = [
    {
      title: 'Total Balance',
      value: formatCurrency ? formatCurrency(totalBalance) : `₹${totalBalance?.toLocaleString('en-IN') || 0}`,
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Active Accounts',
      value: activeAccounts.length,
      change: '+0',
      trend: 'neutral',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'This Month Income',
      value: formatCurrency ? formatCurrency(transactionStats.totalReceivedAmount) : `₹${transactionStats.totalReceivedAmount?.toLocaleString('en-IN') || 0}`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Active FDs',
      value: activeFDs.length,
      change: '+1',
      trend: 'up',
      icon: PieChart,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10'
    }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Show loading state
  if (loading && !accounts.length) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-emerald-400 mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <p className="text-white text-lg">Please log in to view dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-400">
              Welcome back, {userData?.firstName || 'User'}! Here's your financial summary.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshData}
              disabled={refreshing}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Error Display */}
        {(error || contextError) && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <div>
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error || contextError}</p>
            </div>
            <button
              onClick={() => {setError(null);}}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:bg-slate-800/70">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} border border-slate-600/30`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full border ${
                stat.trend === 'up' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                stat.trend === 'down' ? 'text-red-400 bg-red-500/10 border-red-500/30' :
                'text-slate-400 bg-slate-500/10 border-slate-500/30'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-400 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Connected Accounts */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <Building2 size={20} className="text-blue-400" />
                </div>
                Connected Bank Accounts
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
                >
                  {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {accounts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto text-slate-400 mb-4" size={48} />
                <p className="text-slate-400 mb-2">No accounts found</p>
                <p className="text-slate-500 text-sm">Create your first account to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account._id} className="group flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-all duration-200 hover:bg-slate-900/70">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        account.accountType === 'Savings' 
                          ? 'bg-emerald-500/10 border border-emerald-500/30' 
                          : 'bg-blue-500/10 border border-blue-500/30'
                      }`}>
                        <CreditCard className={`${
                          account.accountType === 'Savings' ? 'text-emerald-400' : 'text-blue-400'
                        }`} size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{account.accountType} Account</h3>
                        <p className="text-sm text-slate-400">{account.accountNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-white text-lg">
                          {balanceVisible ? (formatCurrency ? formatCurrency(account.balance) : `₹${account.balance?.toLocaleString('en-IN') || 0}`) : '••••••'}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          account.status === 'Active' 
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' 
                            : 'text-slate-400 bg-slate-500/10 border-slate-500/30'
                        }`}>
                          {account.status}
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Account Summary */}
            {accounts.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={16} className="text-emerald-400" />
                    <span className="text-sm text-slate-400">Total Balance</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {balanceVisible ? (formatCurrency ? formatCurrency(totalBalance) : `₹${totalBalance?.toLocaleString('en-IN') || 0}`) : '••••••'}
                  </p>
                </div>
                <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-blue-400" />
                    <span className="text-sm text-slate-400">Net Income</span>
                  </div>
                  <p className="text-xl font-bold text-emerald-400">
                    +{formatCurrency ? formatCurrency(transactionStats.netAmount) : `₹${transactionStats.netAmount?.toLocaleString('en-IN') || 0}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Deposits Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <PieChart size={20} className="text-orange-400" />
              </div>
              Fixed Deposits
            </h2>
          </div>
          <div className="p-6">
            {fixedDeposits.length === 0 ? (
              <div className="text-center py-8">
                <PieChart className="mx-auto text-slate-400 mb-4" size={48} />
                <p className="text-slate-400 mb-2">No Fixed Deposits</p>
                <p className="text-slate-500 text-sm">Create your first FD to start earning</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Active FDs</span>
                      <span className="text-2xl font-bold text-white">{activeFDs.length}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{width: `${fdStats.totalFDs > 0 ? (activeFDs.length / fdStats.totalFDs) * 100 : 0}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Total Invested</span>
                      <span className="text-lg font-bold text-white">{formatCurrency ? formatCurrency(fdStats.totalInvested) : `₹${fdStats.totalInvested?.toLocaleString('en-IN') || 0}`}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Interest Earned</span>
                      <span className="text-lg font-bold text-emerald-400">+{formatCurrency ? formatCurrency(fdStats.totalInterestEarned) : `₹${fdStats.totalInterestEarned?.toLocaleString('en-IN') || 0}`}</span>
                    </div>
                  </div>
                </div>

                {/* Recent FDs */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Recent FDs</h3>
                  {activeFDs.slice(0, 3).map((fd) => (
                    <div key={fd._id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30">
                      <div>
                        <p className="font-medium text-white">{formatCurrency ? formatCurrency(fd.principalAmount) : `₹${fd.principalAmount?.toLocaleString('en-IN') || 0}`}</p>
                        <p className="text-xs text-slate-400">{fd.termInMonths} months @ {fd.interestRate}%</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                        {fd.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <Activity size={20} className="text-purple-400" />
              </div>
              Recent Transactions
            </h2>
            <div className="flex items-center gap-2">
              <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50">
                <Filter size={18} />
              </button>
              <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                View All
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-slate-400 mb-2">No transactions yet</p>
              <p className="text-slate-500 text-sm">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction._id} className="group flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700/30 hover:border-slate-600 hover:bg-slate-900/50 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'received' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30' 
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      {transaction.type === 'received' ? (
                        <ArrowDownLeft className="text-emerald-400" size={20} />
                      ) : (
                        <ArrowUpRight className="text-red-400" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{transaction.description || 'Transaction'}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{transaction.type === 'received' ? 'From:' : 'To:'} {
                          transaction.type === 'received' ? (transaction.senderName || 'Unknown') : (transaction.recipientName || 'Unknown')
                        }</span>
                        <span>•</span>
                        <span>{formatDate(transaction.createdAt)}</span>
                        <span>•</span>
                        <span>{formatTime(transaction.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'received' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {transaction.type === 'received' ? '+' : '-'}{formatCurrency ? formatCurrency(transaction.amount) : `₹${transaction.amount?.toLocaleString('en-IN') || 0}`}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700/50">
                      <MoreHorizontal size={16} className="text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transaction Summary */}
          {transactions.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownLeft size={16} className="text-emerald-400" />
                  <span className="text-sm text-slate-400">Total Received</span>
                </div>
                <p className="text-xl font-bold text-emerald-400">
                  {formatCurrency ? formatCurrency(transactionStats.totalReceivedAmount) : `₹${transactionStats.totalReceivedAmount?.toLocaleString('en-IN') || 0}`}
                </p>
              </div>
              
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight size={16} className="text-red-400" />
                  <span className="text-sm text-slate-400">Total Sent</span>
                </div>
                <p className="text-xl font-bold text-red-400">
                  {formatCurrency ? formatCurrency(transactionStats.totalSentAmount) : `₹${transactionStats.totalSentAmount?.toLocaleString('en-IN') || 0}`}
                </p>
              </div>
              
              <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-blue-400" />
                  <span className="text-sm text-slate-400">Net Flow</span>
                </div>
                <p className={`text-xl font-bold ${
                  transactionStats.netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {transactionStats.netAmount >= 0 ? '+' : ''}{formatCurrency ? formatCurrency(transactionStats.netAmount) : `₹${transactionStats.netAmount?.toLocaleString('en-IN') || 0}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
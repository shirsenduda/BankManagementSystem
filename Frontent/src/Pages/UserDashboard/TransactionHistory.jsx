import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Eye, Download, Filter, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight, Search, Calendar, TrendingUp, TrendingDown, Clock, CreditCard, Building2 } from 'lucide-react';

// Mobile responsive styles
const mobileStyles = `
@media (max-width: 768px) {
  .transaction-stats-grid {
    grid-template-columns: 1fr !important;
  }
  .transaction-table th,
  .transaction-table td {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 13px;
  }
  .transaction-table {
    font-size: 13px;
  }
  .transaction-table-action {
    min-width: 85px;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }
  .transaction-table-scroll {
    overflow-x: auto;
    width: 100vw;
    min-width: 600px;
  }
  .transaction-table-container {
    padding: 0;
  }
  .transaction-pagination {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
`;

const TransactionHistory = () => {
  const {
    transactions,
    getTransactionHistory,
    loading,
    formatCurrency,
    userData
  } = useContext(AppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getTransactionHistory();
  }, []);

  // Sample transaction data (fallback if context data is empty)
  const sampleTransactions = [
    {
      _id: 'T-001',
      type: 'sent',
      amount: 5000,
      fees: 10,
      status: 'Completed',
      description: 'Monthly rent payment',
      recipientName: 'John Smith',
      recipientEmail: 'john.smith@example.com',
      recipientAccountNumber: 'SAV1 7548 0022',
      senderAccountNumber: 'CUR1 7550 8561',
      createdAt: '2024-08-14T10:30:00Z',
      transactionId: 'TXN123456789'
    },
    {
      _id: 'T-002',
      type: 'received',
      amount: 15000,
      fees: 0,
      status: 'Completed',
      description: 'Salary credit',
      senderName: 'ABC Company',
      senderEmail: 'payroll@abccompany.com',
      senderAccountNumber: 'CUR2 8899 1234',
      recipientAccountNumber: 'SAV1 7548 0022',
      createdAt: '2024-08-13T15:45:00Z',
      transactionId: 'TXN123456788'
    },
    {
      _id: 'T-003',
      type: 'sent',
      amount: 2500,
      fees: 5,
      status: 'Completed',
      description: 'Grocery shopping',
      recipientName: 'SuperMart',
      recipientEmail: 'payments@supermart.com',
      recipientAccountNumber: 'CUR3 9988 7766',
      senderAccountNumber: 'SAV1 7548 0022',
      createdAt: '2024-08-12T09:20:00Z',
      transactionId: 'TXN123456787'
    },
    {
      _id: 'T-004',
      type: 'received',
      amount: 8000,
      fees: 0,
      status: 'Pending',
      description: 'Freelance payment',
      senderName: 'Tech Solutions Ltd',
      senderEmail: 'finance@techsolutions.com',
      senderAccountNumber: 'CUR4 5566 3344',
      recipientAccountNumber: 'CUR1 7550 8561',
      createdAt: '2024-08-11T14:15:00Z',
      transactionId: 'TXN123456786'
    },
    {
      _id: 'T-005',
      type: 'sent',
      amount: 1200,
      fees: 5,
      status: 'Failed',
      description: 'Utility bill payment',
      recipientName: 'Power Grid Corp',
      recipientEmail: 'billing@powergrid.com',
      recipientAccountNumber: 'SAV2 4455 6677',
      senderAccountNumber: 'SAV1 7548 0022',
      createdAt: '2024-08-10T11:30:00Z',
      transactionId: 'TXN123456785'
    },
    {
      _id: 'T-006',
      type: 'received',
      amount: 3500,
      fees: 0,
      status: 'Completed',
      description: 'Investment return',
      senderName: 'InvestCorp Ltd',
      senderEmail: 'returns@investcorp.com',
      senderAccountNumber: 'INV1 2233 4455',
      recipientAccountNumber: 'SAV1 7548 0022',
      createdAt: '2024-08-09T16:20:00Z',
      transactionId: 'TXN123456784'
    },
    {
      _id: 'T-007',
      type: 'sent',
      amount: 850,
      fees: 2,
      status: 'Completed',
      description: 'Online shopping',
      recipientName: 'E-Store Inc',
      recipientEmail: 'payments@estore.com',
      recipientAccountNumber: 'COM1 5566 7788',
      senderAccountNumber: 'CUR1 7550 8561',
      createdAt: '2024-08-08T12:45:00Z',
      transactionId: 'TXN123456783'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions;

  // Filter transactions
  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.recipientName && transaction.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (transaction.senderName && transaction.senderName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Handle checkbox selection
  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId) 
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === currentTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentTransactions.map(t => t._id));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Pending':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'Failed':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
    }
  };

  // Calculate stats
  const stats = {
    total: displayTransactions.length,
    completed: displayTransactions.filter(t => t.status === 'Completed').length,
    pending: displayTransactions.filter(t => t.status === 'Pending').length,
    failed: displayTransactions.filter(t => t.status === 'Failed').length,
    totalAmount: displayTransactions.reduce((sum, t) => sum + (t.type === 'received' ? t.amount : -t.amount), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-emerald-400 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-100 mb-1">Loading Transactions</h3>
            <p className="text-slate-400">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{mobileStyles}</style>
      <div className="min-h-screen bg-slate-900">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-2 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 transaction-stats-grid">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Transactions</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">{stats.total}</p>
                  <p className="text-xs text-slate-500 mt-1">All time</p>
                </div>
                <div className="w-12 h-12 bg-slate-700/50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.completed}</p>
                  <p className="text-xs text-emerald-400 mt-1">+{Math.round((stats.completed / stats.total) * 100)}% success rate</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">{stats.pending}</p>
                  <p className="text-xs text-amber-400 mt-1">Awaiting processing</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Net Balance</p>
                  <p className={`text-2xl font-bold mt-1 ${stats.totalAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stats.totalAmount >= 0 ? '+' : ''}₹{Math.abs(stats.totalAmount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">This period</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.totalAmount >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {stats.totalAmount >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Transaction Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden transaction-table-container">
            {/* Table Header */}
            <div className="px-6 py-5 bg-slate-800/30 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-slate-100">Recent Transactions</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                    {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
                  </span>
                  {selectedTransactions.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedTransactions.length} selected
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto transaction-table-scroll">
              <table className="w-full transaction-table">
                <thead className="bg-slate-800/20 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-500 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2 bg-slate-700"
                        checked={selectedTransactions.length === currentTransactions.length && currentTransactions.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider transaction-table-action">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-500 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2 bg-slate-700"
                          checked={selectedTransactions.includes(transaction._id)}
                          onChange={() => handleSelectTransaction(transaction._id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-slate-200 font-mono">
                            #{transaction.transactionId || transaction._id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 ${
                          transaction.type === 'sent' 
                            ? 'text-red-400 bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20' 
                            : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20'
                        }`}>
                          {transaction.type === 'sent' ? (
                            <ArrowUpRight className="w-3 h-3 mr-1.5" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1.5" />
                          )}
                          {transaction.type === 'sent' ? 'Sent' : 'Received'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-200 mb-1 group-hover:text-slate-100 transition-colors">
                            {transaction.description || 'No description'}
                          </div>
                          <div className="text-xs text-slate-500 mb-1">
                            {transaction.type === 'sent' ? 
                              `To: ${transaction.recipientName || transaction.recipientEmail || 'Unknown'}` :
                              `From: ${transaction.senderName || transaction.senderEmail || 'Unknown'}`
                            }
                          </div>
                          <div className="text-xs text-slate-600 font-mono bg-slate-700/30 px-2 py-0.5 rounded inline-block">
                            {transaction.type === 'sent' ? 
                              transaction.recipientAccountNumber : 
                              transaction.senderAccountNumber
                            }
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-bold transition-colors ${
                          transaction.type === 'sent' ? 'text-red-400 group-hover:text-red-300' : 'text-emerald-400 group-hover:text-emerald-300'
                        }`}>
                          {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toLocaleString('en-IN')}
                        </div>
                        {transaction.fees > 0 && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            Fee: ₹{transaction.fees}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${getStatusStyle(transaction.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            transaction.status === 'Completed' ? 'bg-emerald-400' :
                            transaction.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                          }`}></div>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-300 font-medium group-hover:text-slate-200 transition-colors">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right transaction-table-action">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="inline-flex items-center p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all duration-150">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="inline-flex items-center p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-150">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="bg-slate-800/20 px-6 py-4 border-t border-slate-700/50">
              <div className="flex items-center justify-between transaction-pagination">
                <div className="text-sm text-slate-400">
                  Showing <span className="font-medium text-slate-200">{indexOfFirstTransaction + 1}</span> to{' '}
                  <span className="font-medium text-slate-200">{Math.min(indexOfLastTransaction, filteredTransactions.length)}</span> of{' '}
                  <span className="font-medium text-slate-200">{filteredTransactions.length}</span> transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                              : 'text-slate-300 bg-slate-800/50 border border-slate-600 hover:bg-slate-700/50 hover:border-slate-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-lg text-sm font-medium text-slate-300 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
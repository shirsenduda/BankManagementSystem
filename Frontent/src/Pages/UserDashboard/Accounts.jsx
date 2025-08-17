import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Plus,
  Wallet,
  TrendingUp,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import EmptyState from "../../Componets/UserDashboardComponets/EmptyState";
import AccountCard from "../../Componets/UserDashboardComponets/AccountCard";
import CreateAccountModal from "../../Componets/UserDashboardComponets/CreateAccountModal";

const Accounts = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showTotalBalance, setShowTotalBalance] = useState(true);

  const {
    accounts,
    loading,
    error,
    createAccount,
    getMyAccounts,
    getTotalBalance,
    currencySymbol,
    // Remove sidebarOpen since MainContent handles the layout
  } = useContext(AppContext);

  useEffect(() => {
    getMyAccounts();
  }, [getMyAccounts]);

  const handleCreateAccount = async (accountData) => {
    try {
      const result = await createAccount(accountData);
      if (result?.success) {
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to create account:", err);
    }
  };

  const handleCopyAccount = async (account) => {
    const textToCopy = account._id || account.accountNumber;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch (err) {
      console.error("Failed to copy account details:", err);
    }
  };

  const totalBalance =
    accounts?.reduce((sum, account) => sum + (account.balance || 0), 0) || 0;

  // Loading State
  if (loading && (!accounts || accounts.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-100">
                Loading Your Accounts
              </h3>
              <p className="text-gray-400 max-w-sm">
                Please wait while we fetch your banking information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* No need for margin logic - MainContent handles it */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {!accounts || accounts.length === 0 ? (
          <EmptyState onCreateAccount={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Welcome Text */}
              <div className="flex-1">
                <div className="space-y-3">
                  <h1 className="text-3xl font-black text-white leading-tight">
                    My Bank account
                  </h1>
                  <p className="text-lg font-semibold text-gray-300 max-w-2xl leading-relaxed">
                    Manage your accounts and track your financial growth
                  </p>
                </div>
              </div>

              {/* Total Balance Card - Uncomment if needed */}
              {/* <div className="lg:flex-shrink-0">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-sm min-w-[320px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Wallet size={18} className="text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">Total Balance</span>
                    </div>
                    <button
                      onClick={() => setShowTotalBalance(!showTotalBalance)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      aria-label={showTotalBalance ? 'Hide balance' : 'Show balance'}
                    >
                      {showTotalBalance ? (
                        <Eye size={16} className="text-gray-400" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-3xl font-bold text-white">
                      {showTotalBalance 
                        ? `${currencySymbol}${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : '••••••'
                      }
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-xs font-semibold text-green-400">+2.5%</span>
                      </div>
                      <span className="text-sm text-gray-400">from last month</span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Accounts Section */}
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-white">
                    Your Accounts
                  </h2>
                  <p className="text-gray-400">
                    {accounts.length} active account
                    {accounts.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus size={20} />
                  Add New Account
                </button>
              </div>

              {/* Account Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <AccountCard
                    key={account._id}
                    account={account}
                    onCopyAccount={handleCopyAccount}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateAccount={handleCreateAccount}
      />

      {/* Error Toast */}
      {error && (
        <></>
      )}
    </>
  );
};

export default Accounts;
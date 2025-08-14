import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../../Context/AppContext';
import { Eye, EyeOff, Copy, MoreVertical, X, AlertTriangle, Trash2, Wifi } from 'lucide-react';

const AccountCard = ({ account, onCopyAccount }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const menuRef = useRef(null);
  
  const { currencySymbol, closeAccount, loading } = useContext(AppContext);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Add safety checks for account object
  if (!account) {
    return (
      <div className="w-80 h-48 bg-gray-200 rounded-xl p-5 flex items-center justify-center">
        <p className="text-gray-500">Account data not available</p>
      </div>
    );
  }

  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return '•••• •••• •••• 0000';
    const str = accountNumber.toString();
    return str.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatBalance = (balance) => {
    // Add safety check for balance
    const safeBalance = typeof balance === 'number' ? balance : 0;
    return `${currencySymbol || '$'}${safeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getAccountTypeDisplay = (accountType) => {
    if (!accountType) return 'BANK ACCOUNT';
    switch (accountType.toLowerCase()) {
      case 'savings':
        return 'SAVINGS ACCOUNT';
      case 'checking':
        return 'CHECKING ACCOUNT';
      case 'current':
        return 'CURRENT ACCOUNT';
      case 'business':
        return 'BUSINESS ACCOUNT';
      default:
        return 'BANK ACCOUNT';
    }
  };

  const getBankName = () => {
    return 'GREEN BANK';
  };

  const getCardColors = (accountType) => {
    if (!accountType) return 'from-slate-700 via-slate-800 to-slate-900';
    switch (accountType.toLowerCase()) {
      case 'savings':
        return 'from-emerald-800 via-emerald-900 to-teal-900';
      case 'checking':
        return 'from-slate-700 via-slate-800 to-slate-900';
      case 'current':
        return 'from-indigo-800 via-blue-900 to-navy-950';
      case 'business':
        return 'from-gray-900 via-black to-gray-950';
      default:
        return 'from-slate-700 via-slate-800 to-slate-900';
    }
  };

  const getChipColor = (accountType) => {
    if (!accountType) return 'from-gray-300 via-gray-400 to-gray-500';
    switch (accountType.toLowerCase()) {
      case 'business':
        return 'from-amber-400 via-yellow-500 to-amber-600';
      case 'savings':
        return 'from-emerald-300 via-emerald-400 to-emerald-500';
      case 'checking':
        return 'from-blue-300 via-blue-400 to-blue-500';
      default:
        return 'from-gray-300 via-gray-400 to-gray-500';
    }
  };

  const handleCloseAccount = async () => {
    if (confirmText.toUpperCase() !== 'CLOSE ACCOUNT') {
      return;
    }

    try {
      // Add safety check for account._id
      if (!account._id) {
        console.error("Account ID is missing");
        return;
      }
      
      const result = await closeAccount(account._id);
      if (result?.success) {
        setShowCloseModal(false);
        setConfirmText('');
        setShowMenu(false);
      }
    } catch (err) {
      console.error("Failed to close account:", err);
    }
  };

  const openCloseModal = () => {
    setShowCloseModal(true);
    setShowMenu(false);
  };

  const closeModal = () => {
    setShowCloseModal(false);
    setConfirmText('');
  };

  // Check if account is closed with safety check
  const isAccountClosed = account.status === 'Closed';

  // Generate fallback account ID display
  const getAccountIdDisplay = () => {
    if (account._id) {
      return account._id.slice(0, 8);
    }
    return 'OW110GMd';
  };

  // Generate fallback last 4 digits
  const getLastFourDigits = () => {
    if (account.accountNumber) {
      return account.accountNumber.toString().slice(-4);
    }
    return '0000';
  };

  return (
    <>
      {/* Bank Card Design */}
      <div className="group relative">
        {/* Main Card - Credit Card Size (3.375" × 2.125") */}
        <div className={`w-80 h-48 bg-gradient-to-br ${getCardColors(account.accountType)} rounded-xl p-5 text-white relative overflow-hidden transition-all duration-300 hover:scale-[1.00] hover:shadow-1xl shadow-xl ${isAccountClosed ? 'opacity-60 grayscale' : ''}`}>
          
          {/* Sophisticated Pattern */}
          <div className="absolute inset-0 opacity-10">
            {/* Large accent circle */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-white/20 to-white/5 rounded-full"></div>
            {/* Medium accent circle */}
            <div className="absolute top-12 right-4 w-16 h-16 border border-white/10 rounded-full"></div>
            {/* Small decorative elements */}
            <div className="absolute bottom-4 left-6 w-3 h-3 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            {/* Geometric lines */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute top-16 left-0 w-20 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Premium border accent */}
          <div className="absolute inset-0 rounded-xl border border-white/10"></div>

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col">
            
            {/* Top Section */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-white/60 to-white/30 rounded-full"></div>
                  <h3 className="text-sm font-bold tracking-[0.2em] opacity-95">
                    {getBankName()}
                  </h3>
                </div>
                <p className="text-xs opacity-75 font-medium tracking-wider pl-4">
                  {getAccountTypeDisplay(account.accountType)}
                </p>
                {isAccountClosed && (
                  <span className="text-xs bg-red-600/80 text-white px-2 py-1 rounded-md mt-2 inline-block font-semibold tracking-wide ml-4">
                    CLOSED
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Balance Toggle */}
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                  title={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                {/* Three-Dot Menu */}
                {!isAccountClosed && (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="Account options"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 min-w-[160px] z-30">
                        <button
                          onClick={openCloseModal}
                          className="w-full text-left px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-2.5 font-medium"
                        >
                          <Trash2 size={14} />
                          Close Account
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Contactless/Wifi Icon */}
                <div className="p-2">
                  <Wifi size={14} className="text-white/50 rotate-90" />
                </div>
              </div>
            </div>

            {/* Middle Section - Chip and Balance */}
            <div className="flex items-center justify-between mb-6 flex-1">
              {/* EMV Chip */}
              <div className={`w-12 h-9 bg-gradient-to-br ${getChipColor(account.accountType)} rounded-md relative shadow-lg`}>
                <div className="absolute inset-1 border border-gray-500/50 rounded-sm"></div>
                <div className="absolute inset-2 grid grid-cols-2 gap-0.5">
                  <div className="bg-gray-600/80 rounded-sm"></div>
                  <div className="bg-gray-600/60 rounded-sm"></div>
                  <div className="bg-gray-600/60 rounded-sm"></div>
                  <div className="bg-gray-600/80 rounded-sm"></div>
                </div>
              </div>

              {/* Balance Display */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs opacity-70 mb-2 tracking-[0.2em] font-medium uppercase">Balance</p>
                <p className="text-xl font-bold tracking-tight leading-none">
                  {showBalance ? formatBalance(account.balance) : '••••••'}
                </p>
              </div>
            </div>

            {/* Bottom Section - Account Number and Details */}
            <div className="mt-auto">
              <div className="flex justify-between items-end">
                <div className="flex-1">
                  <p className="text-base font-mono tracking-[0.15em] font-semibold mb-2 leading-snug">
                    {formatAccountNumber(account.accountNumber)}
                  </p>
                  <div className="flex items-center gap-6 text-xs opacity-70">
                    <span className="tracking-[0.15em] font-medium uppercase">Valid Thru</span>
                    <span className="font-mono font-bold text-sm">12/29</span>
                  </div>
                </div>
                
                {/* Status and Network Area */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${isAccountClosed ? 'bg-red-400' : 'bg-emerald-400'} shadow-sm`}></div>
                  <div className="text-xs opacity-70 font-semibold tracking-[0.15em] uppercase text-right">
                    {account.accountType?.toLowerCase() === 'business' ? 'Business' : 'Personal'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="mt-3  rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-2 h-2 rounded-full ${isAccountClosed ? 'bg-red-500' : 'bg-emerald-500'} flex-shrink-0`}></div>
              <div className="min-w-0 flex-1">
                
                <div className="flex items-center gap-2 text-xs text-white-600">
                  <span className="font-mono">ID: {getAccountIdDisplay()}...</span>
                  
                </div>
              </div>
            </div>
            {onCopyAccount && (
              <button
                onClick={() => onCopyAccount(account)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
                title="Copy Account Details"
              >
                <Copy size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Close Account Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Close Account</h3>
                  <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Account Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                <h4 className="font-bold text-gray-900">
                  {getAccountTypeDisplay(account.accountType)}
                </h4>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-gray-700 font-mono">
                  <span className="font-semibold">Number:</span> ••••{getLastFourDigits()}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Balance:</span> {formatBalance(account.balance)}
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm mb-2">
                    ⚠️ Important Warning
                  </h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Your account will be permanently closed</li>
                    <li>• All associated data will be removed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                Type "CLOSE ACCOUNT" to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CLOSE ACCOUNT"
                className={`w-full px-3 py-3 border-2 rounded-lg transition-all font-mono text-sm ${
                  confirmText && confirmText.toUpperCase() !== 'CLOSE ACCOUNT'
                    ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {confirmText && confirmText.toUpperCase() !== 'CLOSE ACCOUNT' && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Please type exactly: CLOSE ACCOUNT
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseAccount}
                disabled={loading || confirmText.toUpperCase() !== 'CLOSE ACCOUNT'}
                className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Closing...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Close Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountCard;
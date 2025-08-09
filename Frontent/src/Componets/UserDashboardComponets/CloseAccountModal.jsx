import React, { useState, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { X, AlertTriangle, Lock, CheckCircle } from 'lucide-react';

const CloseAccountModal = ({ isOpen, onClose, onCloseAccount, account, loading }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  
  const { currencySymbol } = useContext(AppContext);
  
  const confirmationPhrase = 'CLOSE ACCOUNT';
  const isConfirmationValid = confirmationText.toUpperCase() === confirmationPhrase;
  
  const handleSubmit = () => {
    if (isConfirmationValid && isChecked) {
      onCloseAccount();
    }
  };

  const resetForm = () => {
    setConfirmationText('');
    setIsChecked(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getAccountTypeDisplay = (accountType) => {
    switch (accountType?.toLowerCase()) {
      case 'savings':
        return 'Savings';
      case 'checking':
        return 'Checking';
      case 'current':
        return 'Current';
      case 'business':
        return 'Business';
      default:
        return 'Account';
    }
  };

  const formatBalance = (balance) => {
    return `${currencySymbol}${balance?.toLocaleString() || '0.00'}`;
  };

  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Close Account</h2>
              <p className="text-gray-600 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Account Information */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <h3 className="font-semibold text-gray-900">
              {getAccountTypeDisplay(account.accountType)} Account
            </h3>
          </div>
          <p className="text-sm text-gray-600 font-mono">
            Account: ••••{account.accountNumber?.toString().slice(-4) || '0000'}
          </p>
          <p className="text-sm text-gray-600">
            Balance: {formatBalance(account.balance)}
          </p>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-semibold text-red-900 text-sm">
                Important Notice
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• This will permanently close your account</li>
                <li>• Any remaining balance will be transferred to your primary account</li>
                <li>• You won't be able to reopen this account</li>
                <li>• All account history will be archived</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all ${
                isChecked 
                  ? 'bg-red-600 border-red-600' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                {isChecked && (
                  <CheckCircle size={12} className="text-white absolute inset-0 m-auto" />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700 leading-5">
              I understand that closing this account is permanent and cannot be undone
            </span>
          </label>
        </div>

        {/* Confirmation Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Type "{confirmationPhrase}" to confirm
          </label>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Type confirmation phrase"
            className={`w-full px-3 py-3 border-2 rounded-xl transition-all text-gray-900 placeholder-gray-400 ${
              confirmationText && !isConfirmationValid
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {confirmationText && !isConfirmationValid && (
            <p className="text-xs text-red-600 mt-1">
              Please type exactly: {confirmationPhrase}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !isConfirmationValid || !isChecked}
            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Closing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Lock size={16} />
                Close Account
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseAccountModal;
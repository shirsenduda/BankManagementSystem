import React from 'react';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';

const TransferReview = ({ 
  senderAccount, 
  recipientAccount, 
  amount, 
  fees, 
  totalAmount, 
  description,
  formatCurrency,
  canTransfer 
}) => {
  const getAccountTypeColor = (accountType) => {
    switch (accountType?.toLowerCase()) {
      case 'savings':
        return 'from-emerald-800 via-emerald-900 to-teal-900';
      case 'current':
        return 'from-indigo-800 via-blue-900 to-navy-950';
      case 'business':
        return 'from-gray-900 via-black to-gray-950';
      default:
        return 'from-slate-700 via-slate-800 to-slate-900';
    }
  };

  return (
    <div className="space-y-8">
      {/* Review Card */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Review Transfer</h3>
            <p className="text-sm text-gray-300">Confirm your transfer details</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Transfer Flow Visualization */}
          <div className="rounded-xl p-6 border border-gray-600/30">
            <div className="flex items-center justify-between">
              {/* From */}
              <div className="text-center flex-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${getAccountTypeColor(senderAccount?.accountType)} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                  {senderAccount?.accountType?.charAt(0) || 'A'}
                </div>
                <p className="text-sm font-semibold text-white">Your Account</p>
                <p className="text-xs text-gray-300 font-mono">••••{senderAccount?.accountNumber?.toString().slice(-4)}</p>
                <p className="text-xs text-gray-400">{senderAccount?.accountType}</p>
              </div>

              {/* Arrow with Amount */}
              <div className="flex-1 flex flex-col items-center mx-4">
                <div className="w-full flex items-center justify-center relative">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                  <div className="absolute bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                    {formatCurrency(parseFloat(amount))}
                  </div>
                </div>
                <ArrowRight size={24} className="text-blue-600 mt-2" />
              </div>

              {/* To */}
              <div className="text-center flex-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${getAccountTypeColor(recipientAccount?.accountType)} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                  {recipientAccount?.accountType?.charAt(0) || 'R'}
                </div>
                <p className="text-sm font-semibold text-white">{recipientAccount?.clientName || 'Recipient'}</p>
                <p className="text-xs text-gray-300 font-mono">••••{recipientAccount?.accountNumber?.toString().slice(-4)}</p>
                <p className="text-xs text-gray-400">{recipientAccount?.accountType}</p>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-600/30">
                <p className="text-sm font-medium text-gray-300 mb-1">Transfer Amount</p>
                <p className="text-xl font-bold text-white">{formatCurrency(parseFloat(amount))}</p>
              </div>
              <div className="p-4 rounded-xl border border-gray-600/30">
                <p className="text-sm font-medium text-gray-300 mb-1">Transfer Fees</p>
                <p className="text-lg font-bold text-white">{formatCurrency(fees)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-600/30">
                <p className="text-sm font-medium text-blue-400 mb-1">Total Debit</p>
                <p className="text-xl font-bold text-blue-300">{formatCurrency(totalAmount)}</p>
              </div>
              {description && (
                <div className="p-4 rounded-xl border border-gray-600/30">
                  <p className="text-sm font-medium text-gray-300 mb-1">Description</p>
                  <p className="text-sm text-white">{description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Validation */}
          {!canTransfer.canTransfer && (
            <div className="border border-red-600/30 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" />
                <div>
                  <p className="font-semibold text-red-400">Cannot Process Transfer</p>
                  <p className="text-sm text-red-300">{canTransfer.reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferReview;
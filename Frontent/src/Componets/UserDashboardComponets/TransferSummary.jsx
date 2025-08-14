import React from 'react';
import { ArrowRight } from 'lucide-react';

const TransferSummary = ({ senderAccount, recipientAccount, formatCurrency }) => {
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
    <div className="p-6 border border-gray-600/30 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">Selected Accounts</h3>
      
      <div className="flex items-center justify-between">
        {/* From Account */}
        <div className="text-center flex-1">
          <div className={`w-12 h-12 bg-gradient-to-br ${getAccountTypeColor(senderAccount?.accountType)} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold`}>
            {senderAccount?.accountType?.charAt(0) || 'F'}
          </div>
          <p className="text-sm font-semibold text-white">From</p>
          <p className="text-xs text-gray-300 font-mono">••••{senderAccount?.accountNumber?.toString().slice(-4)}</p>
          <p className="text-xs text-gray-400">{senderAccount?.accountType}</p>
          <p className="text-sm text-green-400 mt-1">{formatCurrency(senderAccount?.balance || 0)}</p>
        </div>

        {/* Arrow */}
        <div className="flex-1 flex justify-center">
          <ArrowRight size={24} className="text-blue-500" />
        </div>

        {/* To Account */}
        <div className="text-center flex-1">
          <div className={`w-12 h-12 bg-gradient-to-br ${getAccountTypeColor(recipientAccount?.accountType)} rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold`}>
            {recipientAccount?.accountType?.charAt(0) || 'T'}
          </div>
          <p className="text-sm font-semibold text-white">To</p>
          <p className="text-xs text-gray-300 font-mono">••••{recipientAccount?.accountNumber?.toString().slice(-4)}</p>
          <p className="text-xs text-gray-400">{recipientAccount?.accountType}</p>
          <p className="text-xs text-gray-400 mt-1">{recipientAccount?.clientName || 'Recipient'}</p>
        </div>
      </div>
    </div>
  );
};

export default TransferSummary;
import React from 'react';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const RecipientSearch = ({ 
  searchQuery, 
  onSearchChange, 
  isSearching, 
  searchResults, 
  selectedRecipientId, 
  onSelectRecipient 
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
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by account number, name, or email..."
          className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-transparent text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          {searchResults.map((account) => (
            <div
              key={account._id}
              onClick={() => onSelectRecipient(account._id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedRecipientId === account._id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${getAccountTypeColor(account.accountType)} rounded-xl flex items-center justify-center text-white font-bold`}>
                    {account.accountType?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{account.clientName || 'Account Holder'}</p>
                    <p className="text-sm text-gray-300 font-mono">••••{account.accountNumber?.toString().slice(-4)}</p>
                    <p className="text-xs text-gray-400">{account.accountType} Account</p>
                  </div>
                </div>
                {selectedRecipientId === account._id && (
                  <CheckCircle size={20} className="text-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <div className="text-center py-8">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-300">No accounts found matching your search</p>
        </div>
      )}
    </>
  );
};

export default RecipientSearch;
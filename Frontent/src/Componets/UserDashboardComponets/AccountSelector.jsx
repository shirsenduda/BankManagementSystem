import React from 'react';
import { Wallet, User, CheckCircle } from 'lucide-react';
import AccountCard from '../UserDashboardComponets/AccountCardtw';

const AccountSelector = ({ 
  title, 
  description, 
  icon: Icon, 
  iconBgColor, 
  iconColor,
  accounts, 
  selectedAccountId, 
  onSelectAccount, 
  showBalance = true,
  children 
}) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>

      {children}

      {accounts && accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div
              key={account._id}
              onClick={() => onSelectAccount(account._id)}
              className="relative cursor-pointer transition-all duration-300"
            >
              <div className="relative">
                <AccountCard 
                  account={account} 
                  showBalance={showBalance}
                />
              </div>
              {selectedAccountId === account._id && (
                <div className="absolute top-2 right-5 z-20">
                  <CheckCircle size={16} className="text-green-400 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountSelector;
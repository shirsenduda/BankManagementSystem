import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

const QuickTransfer = ({ hasAccounts = true }) => {
  return (
    <div className="rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
          <Zap size={20} className="text-yellow-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Quick Transfer</h3>
          <p className="text-sm text-gray-300">Recent and favorite recipients</p>
        </div>
      </div>
      
      <div className="text-center py-8">
        <TrendingUp size={48} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-300">No recent transfers found</p>
        <p className="text-sm text-gray-400">Your recent recipients will appear here</p>
      </div>
    </div>
  );
};

export default QuickTransfer;
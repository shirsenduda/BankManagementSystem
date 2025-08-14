import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const TransferTips = () => {
  const tips = [
    "Always verify recipient details before transferring",
    "Keep your transfer PIN secure and confidential",
    "Check account balance before large transfers",
    "Save transaction receipts for your records"
  ];

  return (
    <div className="rounded-2xl p-6 border border-blue-600/20">
      <h4 className="font-bold text-white mb-4 flex items-center gap-2">
        <Shield size={18} className="text-blue-400" />
        Transfer Security Tips
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransferTips;
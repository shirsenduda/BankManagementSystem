import React from 'react';
import { DollarSign, FileText, Calculator } from 'lucide-react';

const AmountInput = ({ 
  amount, 
  onAmountChange, 
  description, 
  onDescriptionChange, 
  fees, 
  totalAmount, 
  formatCurrency, 
  currencySymbol 
}) => {
  return (
    <div className="space-y-6">
      {/* Amount Input Section */}
      <div className="p-6 border border-gray-600/30 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Transfer Amount</h3>
            <p className="text-sm text-gray-300">Enter the amount you want to transfer</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 font-bold text-lg">{currencySymbol || '$'}</span>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full pl-10 pr-4 py-4 text-2xl font-bold border border-gray-600 bg-transparent text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-500"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Description Section */}
      <div className="p-6 border border-gray-600/30 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Description</h3>
            <p className="text-sm text-gray-300">Optional note for this transfer</p>
          </div>
        </div>

        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter transfer description (optional)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-600 bg-transparent text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 resize-none"
        />
      </div>

      {/* Fee Calculation */}
      {amount && parseFloat(amount) > 0 && (
        <div className="p-6 border border-blue-600/30 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Transfer Summary</h3>
              <p className="text-sm text-gray-300">Breakdown of charges and total</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Transfer Amount:</span>
              <span className="font-bold text-white">{formatCurrency(parseFloat(amount))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Processing Fee:</span>
              <span className="font-bold text-white">{formatCurrency(fees)}</span>
            </div>
            <div className="border-t border-gray-600/30 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">Total Amount:</span>
                <span className="font-bold text-blue-400 text-xl">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmountInput;
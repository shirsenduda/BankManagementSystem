import React, { useState, useContext } from 'react';
import { AppContext } from '../../Context/AppContext';
import { X, PiggyBank, Building2 } from 'lucide-react';

const CreateAccountModal = ({ isOpen, onClose, onCreateAccount }) => {
  const [formData, setFormData] = useState({
    accountType: 'Savings',
    initialDeposit: '',
    purpose: ''
  });

  const { loading } = useContext(AppContext);

  const handleSubmit = () => {
    if (!formData.accountType || !formData.initialDeposit) {
      return;
    }
    onCreateAccount(formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Based on backend enum: ["Savings", "Current"]
  const accountTypes = [
    {
      value: 'Savings',
      label: 'Savings Account',
      icon: PiggyBank,
      description: 'Personal savings, Min: ₹1,000',
      color: 'text-emerald-600',
      minDeposit: 1000
    },
    {
      value: 'Current',
      label: 'Current Account',
      icon: Building2,
      description: 'Business use, Min: ₹5,000',
      color: 'text-blue-600',
      minDeposit: 5000
    }
  ];

  const selectedType = accountTypes.find(type => type.value === formData.accountType);
  const minDeposit = selectedType?.minDeposit || 1000;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 text-sm">Choose account type and deposit</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Account Type
            </label>
            <div className="space-y-2">
              {accountTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.accountType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={type.value}
                      checked={formData.accountType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="p-2 bg-white rounded-lg mr-3">
                      <IconComponent size={20} className={type.color} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                    {formData.accountType === type.value && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Initial Deposit */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Initial Deposit
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full pl-8 pr-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
                min={minDeposit}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum: ₹{minDeposit.toLocaleString()}
            </p>
          </div>

          {/* Purpose (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Purpose (Optional)
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="e.g., Emergency fund, Business expenses"
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.initialDeposit || parseFloat(formData.initialDeposit) < minDeposit}
              className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountModal;
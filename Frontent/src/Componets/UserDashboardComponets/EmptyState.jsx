import React from 'react';
import { Plus, CreditCard, Sparkles } from 'lucide-react';

const EmptyState = ({ onCreateAccount }) => {
  return (
    <div className="text-center py-20">
      {/* Animated Icon */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <CreditCard size={32} className="text-white" />
        </div>
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles size={16} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto mb-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Banking</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          Start your financial journey by creating your first account. 
          Choose from savings, checking, or business accounts.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Secure Banking</h4>
          <p className="text-sm text-gray-600">Bank-level security for all transactions</p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Easy Management</h4>
          <p className="text-sm text-gray-600">Manage all accounts in one place</p>
        </div>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">24/7 Access</h4>
          <p className="text-sm text-gray-600">Access your money anytime, anywhere</p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onCreateAccount}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center gap-3 font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform"
      >
        <Plus size={24} />
        Create Your First Account
      </button>
    </div>
  );
};

export default EmptyState;
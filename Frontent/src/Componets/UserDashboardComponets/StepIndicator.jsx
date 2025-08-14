import React from 'react';

const StepIndicator = ({ currentStep, totalSteps = 4 }) => {
  const stepLabels = ['Select Accounts', 'Enter Amount', 'Review', 'Payment'];

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          return (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                currentStep >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'border border-gray-500 text-gray-400'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < totalSteps && (
                <div className={`w-8 h-px ml-2 transition-all duration-300 ${
                  currentStep > stepNumber ? 'bg-blue-600' : 'bg-gray-600'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-xs text-gray-400 max-w-md">
        {stepLabels.map((label, index) => (
          <span 
            key={index}
            className={currentStep >= index + 1 ? 'text-blue-400 font-semibold' : ''}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
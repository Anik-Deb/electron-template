/* eslint-disable react/prop-types */
import { cn } from '@/utils';
import React from 'react';

const FormSteper = ({ currentStep, totalSteps, className }) => {
  return (
    <div className={cn('flex justify-start items-center mb-8', className)}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        const isNextStepActive = currentStep > stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            {/* Step Circle */}
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full ${
                isActive
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
            {/* Step Line (except for the last step) */}
            {stepNumber < totalSteps && (
              <div
                className={`w-1/12 border-t-2 ${
                  isNextStepActive ? 'border-teal-500' : 'border-gray-300'
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FormSteper;

import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessMessage = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center flex-col">
        <CheckCircle className="size-8 text-[#28BD7D]" />
        <h2 className="text-xl mt-4 font-semibold text-gray-800">
          Payment Successful
        </h2>
      </div>

      <p className="mb-6 text-gray-700 text-center text-md">
        Your payment has been processed successfully. Thank you for your
        purchase!
      </p>
    </div>
  );
};

export default SuccessMessage;

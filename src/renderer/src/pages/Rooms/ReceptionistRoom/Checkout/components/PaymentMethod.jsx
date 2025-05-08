/* eslint-disable react/prop-types */
import React from 'react';

export default function PaymentMethods({ paymentMethods, setPaymentMethods }) {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await window.api.getPosMachines();

        // Filter to include only active machines
        const activeMachines = result.filter((machine) => machine.is_active);

        // Sort the active machines by their creation date (oldest first)
        const sortedMachines = activeMachines.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        setPaymentMethods(sortedMachines);
      } catch (error) {
        console.error('Error fetching pos machine data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="border-0 shadow-none mt-4 overflow-y-auto max-h-[70vh] pr-1">
      <div className="p-0 pb-2">
        <p className="text-lg font-semibold">Payment Method</p>
      </div>
      <div className="p-0">
        <div className="flex flex-col gap-2">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className={`flex justify-between items-center border-b pb-2 ${
                index === paymentMethods.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <span className="text-sm font-normal">{method.name}</span>
              <div
                className={`relative ${method.isEditing ? 'border rounded' : ''}`}
              >
                {method.isEditing ? (
                  <input
                    type="number"
                    value={method.amount}
                    onChange={(e) => {
                      const newAmount = parseFloat(e.target.value) || 0;
                      const updatedMethods = [...paymentMethods];
                      updatedMethods[index].amount = newAmount;
                      setPaymentMethods(updatedMethods);
                    }}
                    onBlur={() => {
                      const updatedMethods = [...paymentMethods];
                      updatedMethods[index].isEditing = false;
                      setPaymentMethods(updatedMethods);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const updatedMethods = [...paymentMethods];
                        updatedMethods[index].isEditing = false;
                        setPaymentMethods(updatedMethods);
                      }
                    }}
                    autoFocus
                    className="w-32 text-sm text-right text-gray-900 bg-transparent border-none focus:outline-none px-2 py-0.5"
                  />
                ) : (
                  <div
                    onClick={() => {
                      const updatedMethods = [...paymentMethods];
                      updatedMethods[index].isEditing = true;
                      setPaymentMethods(updatedMethods);
                    }}
                    className="w-32 text-sm text-right bg-gray-50 text-gray-900 cursor-pointer px-2 py-0.5"
                  >
                    {method?.amount === 0 || method?.amount === undefined
                      ? '--'
                      : '৳ ' + method?.amount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

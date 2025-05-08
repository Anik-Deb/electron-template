/* eslint-disable react/prop-types */
import React from 'react';

export default function SummarySection({ invoiceSummary }) {
  const { invoiceItems, subtotal, discountAmount, vatAmount, netAmount } =
    invoiceSummary;
  return (
    <>
      <div className="p-0 pb-2">
        <p className="text-lg font-semibold">Summary</p>
      </div>
      <div className="p-0">
        <div className="flex flex-col gap-2">
          <div
            // className={`max-h-[800px] overflow-y-scroll custom-scrollbar  pr-1`}
            className={`max-h-[800px] pr-1`}
          >
            {invoiceItems.map((invoiceItem, index) => (
              <div key={index} className="flex justify-between space-y-2">
                <span className="text-sm font-normal">
                  {invoiceItem?.service_type === 'room'
                    ? 'Room Rent'
                    : invoiceItem?.service?.service_name || 'Service'}
                </span>
                <span className="text-sm text-gray-800">
                  ৳ {parseFloat(invoiceItem?.total_price || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {/* Sub Total */}
          <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 pr-1">
            <span className="text-sm font-medium text-gray-900">Sub Total</span>
            <span className="text-sm font-medium text-gray-800">
              ৳ {subtotal.toFixed(2)}
            </span>
          </div>

          {/* Discount */}
          {discountAmount > 0 && (
            <div className="flex justify-between pr-1">
              <p className="text-sm font-normal">Discount</p>
              <span className="text-sm text-gray-800">
                -৳ {discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* VAT */}
          <div className="flex justify-between pr-1">
            <p className="text-sm font-normal">
              VAT <span className="font-thin pl-1 text-xs">(0%)</span>
            </p>
            <span className="text-sm text-gray-800">
              ৳ {vatAmount.toFixed(2)}
            </span>
          </div>

          {/* Total */}
          <div className="flex justify-between border-t border-solid border-gray-200 pt-2 pr-1">
            <p className="text-md font-semibold">
              Total <span className="font-thin text-xs pl-1">(Inc VAT)</span>
            </p>
            <p className="text-lg font-semibold">BDT {netAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
}

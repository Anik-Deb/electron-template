/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import React from 'react';
import PaymentOptions from './PaymentOptions';
import { ModalContent } from '@/components/Common/Modal/ModalContent';

const InvoiceTableList = ({
  step,
  setStep,
  paymentSuccess,
  onPaymentSuccess,
}) => {
  const invoice = {
    invoiceNumber: 'INV-20240210',
    invoiceDate: '2025-02-10',
    guestName: 'MR. XYZ',
    guestEmail: 'example@gmail.com',
    guestPhone: '+1 234 567 890',
    items: [
      { service: 'Room Service - Deluxe Suite', amount: 150.0 },
      { service: 'Laundry Service', amount: 20.0 },
      { service: 'Breakfast', amount: 15.0 },
    ],
    subtotal: 185.0,
    discount: 10.0,
    vat: 5.0,
    totalAmount: 180.0,
  };
  return (
    <>
      <ModalContent
        title={`${step !== 2 ? '' : 'Pay Bill'}`}
        isSeparatorHidden={step !== 2 && true }
        className={`${!paymentSuccess && step !== 2 ? 'max-w-2xl pt-6' : 'max-w-md pt-1'} [&>button]:p-1`}
      >
        {step !== 2 && (
          <div className="w-full mx-auto bg-white p-1">
            {/* Company Logo */}
            <div className="flex justify-between items-center relative mb-6">
              <img src="/logo.png" alt="Logo" />
              <h1 className="font-bold uppercase text-xl">#Invoice</h1>
            </div>

            {/* User Information and invoice info */}
            <div className="flex justify-between">
              {/* customer info */}
              <div>
                <h3 className="text-md font-semibold">BILL To</h3>
                <div className="text-[14px] space-y-2 pt-2">
                  <p>
                    <span className="font-semibold pr-1">Name:</span>
                    {invoice.guestName}
                  </p>
                  <p>
                    <span className="font-semibold pr-1">Email:</span>
                    {invoice.guestEmail}
                  </p>
                  <p>
                    <span className="font-semibold pr-1">Phone:</span>
                    {invoice.guestPhone}
                  </p>
                </div>
              </div>
              {/* invoice info */}
              <div className="text-right text-[14px]">
                <p className="mb-2">{invoice.invoiceNumber}</p>
                <p>
                  <span className="font-semibold">Date: </span>
                  {invoice.invoiceDate}
                </p>
                <p>
                  <span className="font-semibold">Total: </span>
                  {invoice.totalAmount}
                  <span className="text-[20px] font-bold pl-1">&#2547;</span>
                </p>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="pt-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-500 text-white h-10">
                    <th className="px-2 text-left font-medium">Service</th>
                    <th className="px-2 text-left font-medium">Rate</th>
                    <th className="px-2 text-center font-medium">QTY</th>
                    <th className="px-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b text-[#000] h-12 text-sm"
                    >
                      {/* service name */}
                      <td className="px-2 font-semibold text-base">
                        {item.service}
                      </td>
                      {/* service rate */}
                      <td className="px-2 text-left">
                        <span className="text-[20px] font-bold">&#2547;</span>{' '}
                        50
                      </td>
                      {/* service QTY */}
                      <td className="px-2 text-center">03</td>
                      {/* service Amount */}
                      <td className="px-2 text-right ">
                        {item.amount}
                        <span className="text-[20px] font-bold pl-1">
                          &#2547;
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex flex-col items-end px-2">
              <div className="w-5/12">
                <div className="flex justify-between items-center border-b h-12 text-sm">
                  <p className="uppercase text-gray-500 font-semibold">
                    Subtotal:
                  </p>
                  <p>
                    {invoice.subtotal}
                    <span className="text-[20px] font-bold pl-1">&#2547;</span>
                  </p>
                </div>
                <div className="flex justify-between items-center border-b h-12 text-sm">
                  <p className="uppercase text-gray-500 font-semibold">
                    Discount 5%:
                  </p>
                  <p>
                    {invoice.discount}
                    <span className="text-[20px] font-bold pl-1">&#2547;</span>
                  </p>
                </div>
                {/* <div className="flex justify-between items-center border-b h-12 text-sm">
                <p className="uppercase text-gray-500 font-semibold">VAT:</p>
                <p>
                  {invoice.vat}
                  <span className="text-[20px] font-bold pl-1 ">&#2547;</span>
                </p>
              </div> */}
                <div className="flex justify-between items-center py-2 font-semibold uppercase text-md">
                  <p>Total:</p>
                  <p className="text-primary text-xl">
                    {invoice.totalAmount}
                    <span className="text-2xl font-bold pl-1">&#2547;</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              <button className="px-4 py-2 border rounded-lg flex items-center gap-1 text-md text-gray-700">
                <Printer className="size-4" />
                Print
              </button>
              <Button onClick={() => setStep(2)} variant="primary">
                Checkout
              </Button>
            </div>
          </div>
        )}
        {step === 2 && (
          <PaymentOptions
            setStep={setStep}
            totalAmount={invoice.totalAmount}
            onPaymentSuccess={onPaymentSuccess} // Pass prop
          />
        )}
      </ModalContent>
    </>
  );
};

export default InvoiceTableList;

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SuccessMessage from './SuccessMessage';

const Invoice = ({ paymentDetails, invoiceSummary, onClose }) => {
  const navigate = useNavigate();

  const formattedInvoice = {
    guestName: invoiceSummary?.guestName || 'John Doe',
    guestEmail: invoiceSummary?.guestEmail || 'john.doe@example.com',
    guestPhone: invoiceSummary?.guestPhone || '+1234567890',
    invoiceNumber: invoiceSummary?.invoiceNumber || '#INV123456',
    invoiceDate:
      invoiceSummary?.invoiceDate || new Date().toISOString().split('T')[0],
    invoiceDueDate:
      invoiceSummary?.invoiceDueDate || new Date().toISOString().split('T')[0],

    totalAmount: invoiceSummary.netAmount,
    subtotal: invoiceSummary.subtotal,
    discount: invoiceSummary.discountAmount,
    items: invoiceSummary.invoiceItems.map((item) => ({
      service: item.name || 'Service',
      amount: item.total_price || 0,
    })),
  };
  console.log('formattedInvoice', formattedInvoice);

  const handleCheckout = () => {
    navigate(0); // Redirect to rooms route
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-2xl [&>button]:hidden">
        <DialogHeader className=" p-0 m-0">
          <DialogTitle className="sr-only hidden p-0 m-0">Invoice</DialogTitle>
          <DialogDescription className="sr-only hidden p-0 m-0">
            Invoice data
          </DialogDescription>
        </DialogHeader>

        <div className="w-full mx-auto bg-white p-1">
          <SuccessMessage />
          <section className="border p-6 rounded-sm">
            {/* Company Logo */}
            <div className="flex justify-between items-center relative mb-8">
              <h1 className="uppercase text-xl">Invoice</h1>
              <h1 className="uppercase text-xl font-medium">Logo</h1>
            </div>
            {/* User Information and Invoice Info */}
            <div className="flex justify-between items-end">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium">BILL To</h3>
                <div className="text-xs space-y-2 pt-2">
                  <p>
                    <span className="font-medium text-gray-800 pr-1">
                      Name:
                    </span>
                    {formattedInvoice.guestName}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800 pr-1">
                      Email:
                    </span>
                    {formattedInvoice.guestEmail}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800 pr-1">
                      Due Date:
                    </span>
                    {formattedInvoice.invoiceDueDate}
                  </p>
                </div>
              </div>
              {/* Invoice Info */}
              <div className="text-left text-xs space-y-2">
                <p className="flex gap-6 justify-between">
                  <span className="font-medium text-gray-800">
                    Invoice No.:
                  </span>
                  {formattedInvoice.invoiceNumber}
                </p>
                <p className="flex gap-6 justify-between">
                  <span className="font-medium text-gray-800">Date: </span>
                  {formattedInvoice.invoiceDate}
                </p>
                <p className="flex gap-6 justify-between">
                  <span className="font-medium text-gray-800">Total: </span>
                  {formattedInvoice.totalAmount} tk
                </p>
              </div>
            </div>
            {/* Invoice Table */}
            <div className="mt-10 border rounded-md max-h-[200px] overflow-y-scroll">
              <table className="w-full rounded-md">
                <thead>
                  <tr className="bg-[#F2F2F2] h-10 rounded-md text-sm">
                    <th className="px-4 text-left font-normal">Service</th>
                    <th className="px-4 text-right font-normal">Rate (BDT)</th>
                    <th className="px-4 text-right font-normal">QTY</th>
                    <th className="px-4 text-right font-normal">
                      Amount (BDT)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formattedInvoice.items.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 text-[#000] h-10 text-xs"
                    >
                      {/* Service Name */}
                      <td className="px-4">{item.service}</td>
                      {/* Service Rate */}
                      <td className="px-4 text-right">
                        <span className="text-[20px] font-bold">&#2547;</span>
                        50
                      </td>
                      {/* Service QTY */}
                      <td className="px-4 text-right">03</td>
                      {/* Service Amount */}
                      <td className="px-4 text-right">
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
            <div className="flex flex-col items-end mt-3">
              <div className="w-7/12 border rounded-md">
                <div className="flex justify-between items-center border-b h-8 text-xs px-4">
                  <p className="uppercase font-semibold">Subtotal:</p>
                  <p>
                    {formattedInvoice.subtotal}
                    <span className="text-[20px] font-bold pl-1">&#2547;</span>
                  </p>
                </div>
                <div className="flex justify-between items-center border-b h-8 text-xs px-4">
                  <p className="uppercase font-semibold ">Discount 5%:</p>
                  <p>
                    {formattedInvoice.discount}
                    <span className="text-[20px] font-bold pl-1">&#2547;</span>
                  </p>
                </div>
                <div className="flex justify-between items-center px-4 h-8 font-semibold uppercase text-xs bg-primary text-white rounded-md rounded-t-none">
                  <p>Total:</p>
                  <p>
                    {formattedInvoice.totalAmount}
                    <span className="text-lg font-bold pl-1">&#2547;</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="flex justify-between items-center mt-6 space-x-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="text-gray-600 font- bg-gray-50 hover:bg-gray-100 border-0 px-6"
            >
              Cancel
            </Button>
            <div className="flex gap-4 items-center">
              <button className="px-6 py-2 border rounded-md flex items-center gap-1 text-md text-gray-700">
                <Printer className="size-4" />
                Print
              </button>
              <Button
                // onClick={handleCheckout}
                variant="primary"
                className="font-normal px-6"
              >
                Download
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Invoice;

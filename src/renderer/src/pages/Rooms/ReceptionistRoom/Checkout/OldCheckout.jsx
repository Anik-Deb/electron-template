import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React from 'react';
import InvoiceTableList from './components/InvoiceTableList';
import SuccessDialog from './components/SuccessDialog';

const Checkout = ({ booking }) => {
  const [step, setStep] = React.useState(1);
  const [paymentSuccess, setPaymentSuccess] = React.useState(false);

  const handlePaymentSuccess = () => {
    // const roomPromise = window.api.updateRoom({id:booking?.roomId,status:'available'})
    // const bookingPromise = window.api.updateBooking({id:booking?.id,status:'check-out'})
    // const invoicePromise = window.api.updateInvoice({id:'', amount_paid:'', status:"paid"})
    // const paymentPromise = window.api.addPayment({booking_id:booking?.id,payment_status:'completed'})
    // const transactionPromise = window.api.addCashTransaction({booking_id:booking?.id, transaction_type:'payment', payment_status:'completed'})
    // const result = await Promise.all([roomPromise, bookingPromise, invoicePromise, paymentPromise, transactionPromise])
    // console.log('All Result in checkout:', result)
    setPaymentSuccess(true);
  };

  const dummy = [
    {
      item: 'Room Charges (Deluxe Suite)',
      description: '4 nights stay',
      unitPrice: 150.0,
      quantity: 4,
      total: 600.0,
    },
    {
      item: 'Service Tax',
      description: 'Applicable government tax',
      unitPrice: 20.0,
      quantity: 1,
      total: 20.0,
    },
  ];
  return (
    <>
      <Dialog>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <DialogTrigger asChild>
            <Button
              className="text-[13px] font-normal h-fit p-0 w-full"
              variant="transparent"
            >
              Check Out
            </Button>
          </DialogTrigger>
        </DropdownMenuItem>
        {/* checkout dialoge */}

        {paymentSuccess ? (
          <DialogContent className="p-2">
            <SuccessDialog
              onClose={() => {
                setPaymentSuccess(false);
              }}
            />
          </DialogContent>
        ) : (
          <InvoiceTableList
            step={step}
            setStep={setStep}
            data={dummy}
            paymentSuccess={paymentSuccess}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </Dialog>
    </>
  );
};
export default Checkout;

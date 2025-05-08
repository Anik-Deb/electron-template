import React from 'react';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PaymentConfirmation = ({ onPaymentSuccess }) => {
  return (
    <>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            You are about to proceed with the payment of totalAmount &#2547;.
            Please ensure all details are correct. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onPaymentSuccess} className="text-white">
            Confirm & Pay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </>
  );
};

export default PaymentConfirmation;

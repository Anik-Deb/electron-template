/* eslint-disable react/prop-types */
import React from 'react';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import PaymentConfirmation from './PaymentConfirmation';

export default function CheckoutFooter({
  setIsDrawerOpen,
  handleConfirmPayment,
}) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white py-4 px-6 border-t">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 text-md"
          onClick={() => setIsDrawerOpen(false)}
        >
          Go Back
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="primary" className="flex-1 h-12 text-md">
              Pay Now
            </Button>
          </AlertDialogTrigger>
          <PaymentConfirmation onPaymentSuccess={handleConfirmPayment} />
        </AlertDialog>
      </div>
    </div>
  );
}

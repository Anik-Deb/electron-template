/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import PaymentConfirmation from './PaymentConfirmation';

const PaymentOptions = ({ setStep, totalAmount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = React.useState('');
  const [posMachines, setPosMachines] = React.useState([]); //
  const [selectedPosMachine, setSelectedPosMachine] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const machines = await window.api.getPosMachines();
        setPosMachines(Array.isArray(machines) ? machines : []);
      } catch (error) {
        console.error('Error fetching POS machine data:', error);
        setPosMachines([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white border-none">
      {/* Payment Method Dropdown */}
      <div className="mb-4 space-y-2">
        <Label className="text-sm font-medium">Payment Method</Label>
        <Select onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="pos">POS Machine</SelectItem>
            
            <SelectItem value="mobile">Mobile Banking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Show POS Machine Selection if "POS Machine" is selected */}
      {paymentMethod === 'pos' && (
        <div className="mb-4 space-y-2">
          <Label className="text-sm font-medium">Select POS Machine</Label>
          <Select onValueChange={setSelectedPosMachine}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a POS machine" />
            </SelectTrigger>
            <SelectContent>
              {posMachines.length > 0 ? (
                posMachines.map((machine, index) => (
                  <SelectItem key={index} value={machine.name}>
                    {machine.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  No POS machines available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Total Amount */}
      <div className="flex justify-between items-center p-4 mt-4 bg-gray-50 rounded-lg">
        <p className="text-md font-semibold">Amount:</p>
        <p className="text-xl font-bold text-green-600">
          {totalAmount} <span className="text-lg">&#2547;</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          className="border px-4 py-2 rounded-md text-gray-700"
          onClick={() => setStep(1)}
        >
          Go Back
        </button>
        {/* Payment button with confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild disabled={!paymentMethod}>
            <Button disabled={!paymentMethod} variant="primary">
              Pay Now
            </Button>
          </AlertDialogTrigger>
          <PaymentConfirmation onPaymentSuccess={onPaymentSuccess} />
        </AlertDialog>
      </div>
    </div>
  );
};

export default PaymentOptions;

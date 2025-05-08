/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import handlePrint from '@/utils/handlePrint';
import { Printer } from 'lucide-react';
import React from 'react';

export default function PrintButton({ componentRef }) {
  return (
    <Button
      onClick={() => handlePrint(componentRef)}
      className="h-8 bg-gray-100 hover:bg-gray-200"
    >
      <Printer className="stroke-gray-500 size-4" />
      <p className="text-gray-600 font-normal ml-1">Print</p>
    </Button>
  );
}

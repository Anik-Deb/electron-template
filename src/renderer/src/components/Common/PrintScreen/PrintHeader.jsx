/* eslint-disable react/prop-types */
import React from 'react';
import { cn } from '@/utils';
export default function PrintHeader({ className }) {
  return (
    <div
      className={cn(
        `flex justify-between items-start mb-6 pb-2 border-b`,
        className
      )}
    >
      {/* <div className="text-gray-800">
        <img src={blackLogo} className="h-12 w-auto" alt="Company Logo" />
      </div> */}
      <div className="text-right text-gray-700 text-[14px]">
        <p className="text-black font-semibold text-base">Company name</p>
        <p>Aerial Legend, 16/17th Floor, 1080 CDA Avenue</p>
        <p>GEC Circle, Chattogram.</p>
        <p>Bangladesh</p>
      </div>
    </div>
  );
}

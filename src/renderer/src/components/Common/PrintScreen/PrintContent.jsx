/* eslint-disable react/prop-types */
import React from 'react';
import PrintHeader from './PrintHeader';

export default function PrintContent({
  componentRef,
  title,
  children,
  ...props
}) {
  return (
    <div
      ref={componentRef}
      style={{ fontFamily: 'Arial, sans-serif' }}
      className="text-black"
      {...props}
    >
      <div className="print-show">
        <PrintHeader className="mb-0" />
      </div>
      {title && (
        <div className="print-show text-lg text-center font-semibold py-2 border-b">
          {title}
        </div>
      )}
      <>{children}</>
    </div>
  );
}

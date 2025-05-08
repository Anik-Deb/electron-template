/* eslint-disable react/prop-types */
import React from 'react';

export const DetailItem = ({ icon: Icon, label, value }) => {
  console.log('value:', value);
  return (
    <div className="flex flex-col">
      <span className="text-gray-800 font-semibold text-sm mb-2">
        {label || 'Unknown'}
      </span>
      <div className="flex items-center gap-2">
        {Icon && <Icon className=" size-4 text-gray-500" />}
        <span className="text-gray-500 text-sm">{value || 'N/A'}</span>
      </div>
    </div>
  );
};

export function formatDate(dateString) {
  return dateString ? new Date(dateString || '')?.toLocaleDateString() : 'N/A';
}

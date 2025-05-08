import { cn } from '@/utils';
import React from 'react';

const CustomColumn = ({
  accessorKey,
  headerText,
  cellRenderer,
  formatDate = false,
  icon = null,
  conditionalStyles = null,
  headerClassName = '', // Class for header
  cellClassName = '', // Class for cell
}) => {
  return {
    accessorKey,
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && <p className={headerClassName}>{headerText}</p>}
          {/* Apply headerClassName here */}
        </>
      );
    },
    cell: ({ row }) => {
      const value = row.getValue(accessorKey);

      // Handle date formatting
      if (formatDate) {
        const formattedDate = value
          ? new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : 'N/A';

        // Render icon alongside the formatted date
        if (icon) {
          return (
            <div
              className={cn(
                'flex items-center gap-2 text-[13px] font-normal text-paragraph',
                cellClassName
              )}
            >
              {icon}
              <span className="text-[13px] font-medium text-subHeading">
                {formattedDate}
              </span>
            </div>
          );
        }

        // Render only the formatted date
        return (
          <span
            className={cn(
              'text-[13px] font-medium text-subHeading',
              cellClassName
            )}
          >
            {formattedDate}
          </span>
        );
      }

      // Handle conditional styling (e.g., for roles)
      if (conditionalStyles) {
        const roleClass = conditionalStyles(value);
        return (
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-semibold',
              roleClass,
              cellClassName // Apply cellClassName here
            )}
          >
            {value}
          </span>
        );
      }

      // Handle icon rendering (e.g., for emergency contact)
      if (icon) {
        return (
          <div
            className={cn(
              'flex items-center gap-2 text-[13px] font-normal text-paragraph',
              cellClassName
            )}
          >
            {icon}
            {value ? value : 'N/A'}
          </div>
        );
      }

      // Default cell rendering
      return cellRenderer ? (
        cellRenderer(value, { row })
      ) : (
        <span
          className={cn(
            'text-[13px] font-medium text-subHeading',
            cellClassName
          )}
        >
          {value ? value : 'N/A'}
        </span>
      );
    },
  };
};

export default CustomColumn;

// components/SelectionColumn.jsx
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export function MultiSelectColumn(DeleteALLComponent) {
  return {
    id: 'select',
    header: ({ table }) => {
      let resultIds = [];
      const selectedIds = table.getSelectedRowModel().rows;
      for (const element of selectedIds) {
        resultIds.push(element?.original?.id);
      }
      // console.log('result ids:', resultIds);
      return (
        <div className="pl-4 relative flex items-center print-hidden">
          <Checkbox
            className="data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          {(table.getIsAllPageRowsSelected() ||
            table.getIsSomeRowsSelected()) && (
            <div className="absolute left-full top-0 flex items-center">
              <DeleteALLComponent selectedIds={resultIds} />
              {/* <DeleteALLComponent /> */}
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 print-hidden">
        <Checkbox
          className="data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

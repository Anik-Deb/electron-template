import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils';
import { Link } from 'react-router-dom';
import DeleteRoom from './DeleteRoom';
import DeleteAllRoom from './DeleteAllRoom';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import CustomColumn from '@/components/Common/Columns/CustomColumn';

export const columns = [
  MultiSelectColumn(DeleteAllRoom), // Multi selection delete
  CustomColumn({
    accessorKey: 'room_number',
    headerText: 'Room Number',
  }),
  CustomColumn({
    accessorKey: 'status',
    headerText: 'Status',
    cellRenderer: (value) => {
      const statusClass =
        value === 'available'
          ? 'bg-blue-100 text-blue-500 capitalize'
          : value === 'checked'
            ? 'bg-orange-100 text-orange-500 capitalize'
            : 'bg-violet-100 text-violet-500 capitalize';

      return (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            statusClass
          )}
        >
          {value}
        </span>
      );
    },
  }),
  CustomColumn({
    accessorKey: 'base_price',
    headerText: 'Base Price',
    cellRenderer: (value) => (
      <span className="text-[13px] font-medium">
        {value ? (
          <>
            <span className="text-[20px] font-bold">&#2547;</span> {value}
          </>
        ) : (
          'None'
        )}
      </span>
    ),
  }),
  CustomColumn({
    accessorKey: 'capacity',
    headerText: 'Capacity',
  }),
  {
    accessorKey: 'id',
    enableHiding: false,
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && <p>Actions</p>}
        </>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id');
      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-gray-600 size-5 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  className="w-full"
                  to={`/rooms/edit-room/${row.original?.id}`}
                >
                  <Button
                    className="text-[13px] font-normal h-fit p-0 w-full pl-2"
                    variant="transparent"
                  >
                    Edit
                  </Button>
                </Link>
              </DropdownMenuItem>
              {/* Delete room Alert Dialog */}
              <DeleteRoom id={id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

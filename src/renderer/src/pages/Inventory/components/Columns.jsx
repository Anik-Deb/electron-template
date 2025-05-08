import CustomColumn from '@/components/Common/Columns/CustomColumn';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React from 'react';
import EditInventory from '../EditInventory';
import DeleteAllInventory from './DeleteAllInventory';
import DeleteInventory from './DeleteInventory';

export const columns = [
  MultiSelectColumn(DeleteAllInventory),
  CustomColumn({
    accessorKey: 'name',
    headerText: 'Name',
  }),
  CustomColumn({
    accessorKey: 'quantity',
    headerText: 'Quantity',
  }),
  {
    enableHiding: false,
    accessorKey: 'id',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && (
          <div className="print-hidden flex ml-auto max-w-max justify-end pr-4 pl-4 lg:pl-8 text-[13px] font-medium text-gray-600">
            Action
          </div>
        )}
      </>
    ),
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = React.useState();
      return (
        <div className="w-[91px] ml-auto pl-4 lg:pl-4 pr-4 text-end print-hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-colorVariant-paragraph size-6 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="text-[13px] font-normal h-10 w-full pl-4"
                    variant="transparent"
                  >
                    <span>Edit</span>
                  </Button>
                </DialogTrigger>
                <EditInventory
                  prevData={row.original}
                  setIsModalOpen={setIsModalOpen}
                />
              </Dialog>
              {/* Delete single inventory */}
              <DeleteInventory id={row.original.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

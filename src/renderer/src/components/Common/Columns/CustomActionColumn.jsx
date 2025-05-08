import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';

export const CustomActionColumn = ({ renderChildren }) => {
  return {
    enableHiding: false,
    id: 'custom-actions', // Change from accessorKey to id
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Actions</p>}
      </>
    ),
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = React.useState(false);
      const id = row.getValue('id');
      return (
        <React.Fragment key={`action-col-${id}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-gray-600 size-5 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {renderChildren({ id, row, isModalOpen, setIsModalOpen })}
            </DropdownMenuContent>
          </DropdownMenu>
        </React.Fragment>
      );
    },
  };
};

import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UpdateSMSConfigure from '../UpdateSMSConfigure';
import {
  DeleteAllSMSConfigure,
  DeleteSMSConfigure,
} from './DeleteSMSConfigure';

export const columns = [
  {
    id: 'select',
    header: ({ table }) => {
      let SMSConfigs = [];
      const selectedIds = table.getSelectedRowModel().rows;
      for (const element of selectedIds) {
        SMSConfigs.push(element?.original?.id);
      }
      return (
        <div className="pl-4 w-10 relative flex items-center print-hidden">
          <Checkbox
            className="border rounded-[3px] border-gray-400 size-4 data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          {(table.getIsAllPageRowsSelected() ||
            table.getIsSomeRowsSelected()) && (
            <div className="absolute left-full top-0 flex items-center">
              <div className="pl-4">
                <DeleteAllSMSConfigure
                  SMSConfigs={SMSConfigs}
                  redirectUrl="/SMSConfiguration"
                />
              </div>
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4 w-6 print-hidden">
        <Checkbox
          className="border rounded-[3px] border-gray-400 size-4 data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'senderid',
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && (
            <p className="inline-flex max-w-[120px] justify-start pl-4 text-[13px] font-medium text-gray-600">
              Sender Id
            </p>
          )}
        </>
      );
    },

    cell: ({ row }) => (
      // <div className="flex flex-wrap items-center sm:w-[120px] gap-2 text-[13px] pl-4 font-normal text-paragraph">
      <div className="flex flex-wrap items-center sm:w-[120px] gap-2 text-[13px] pl-4 font-normal text-paragraph">
        {row.getValue('senderid')}
      </div>
    ),
  },
  {
    accessorKey: 'api_key',
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && (
            <p className="inline-flex max-w-max justify-start pl-4 lg:pl-8 text-[13px] font-medium text-gray-600">
              API Key
            </p>
          )}
        </>
      );
    },

    cell: ({ row }) => (
      <div className="flex flex-wrap items-center sm:w-[120px] gap-2 text-[13px]  pl-4 font-normal text-paragraph lg:pl-8">
        {row.getValue('api_key')}
      </div>
    ),
  },
  {
    // id: 'actions',
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
      return (
        <div className="print-hidden w-[91px] ml-auto pl-4 lg:pl-4 pr-4 text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-gray-600 size-5 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Edit */}
              <UpdateSMSConfigure id={row.original?.id} />
              <DeleteSMSConfigure
                id={row.original?.id}
                redirectUrl="/SMSConfiguration"
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

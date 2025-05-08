import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import DeleteAdmin from '../../../user/deleteUser'
import {
  DeleteAllEmailAccount,
  DeleteEmailAccount,
} from './DeleteEmailAccount';

// import DeleteAdmin from './DeleteAdmin'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => {
      let Ids = [];
      const selectedIds = table.getSelectedRowModel().rows;
      for (const element of selectedIds) {
        Ids.push(element?.original?.id);
      }
      return (
        <div className="pr-4 sm:pr-0 pl-4 relative flex items-center">
          <Checkbox
            className="border rounded-[3px] border-gray-400 size-4 items-center flex data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          {(table.getIsAllPageRowsSelected() ||
            table.getIsSomeRowsSelected()) && (
            <div className="absolute left-20 items-center flex gap-2">
              <DeleteAllEmailAccount Ids={Ids} />
            </div>
          )}
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="pr-4 sm:pr-0 pl-4">
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
    accessorKey: 'smtp_user_email',
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && (
            <p className="inline-flex max-w-max justify-start pl-4 text-[13px] font-medium text-gray-600">
              Email
            </p>
          )}
        </>
      );
    },

    cell: ({ row }) => (
      <div className="text-[13px] max-w-max pl-4 font-medium text-subHeading">
        {row.original.smtp_user_email}
      </div>
    ),
  },
  {
    accessorKey: 'smtp_server',
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && (
            <p className="inline-flex max-w-max justify-start pl-4 text-[13px] font-medium text-gray-600">
              SMTP Server
            </p>
          )}
        </>
      );
    },

    cell: ({ row }) => (
      <div className="w-[100px] text-[13px] py-2 pl-4 font-normal text-paragraph">
        {row.original.smtp_server}
      </div>
    ),
  },
  {
    accessorKey: 'imap_server',
    header: ({ table }) => {
      return (
        <>
          {!(
            table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
          ) && (
            <p className="inline-flex max-w-max justify-start pl-4 text-[13px] font-medium text-gray-600">
              IMAP Server
            </p>
          )}
        </>
      );
    },

    cell: ({ row }) => (
      <div className="w-[100px] text-[13px] py-2 pl-4 font-normal text-paragraph">
        {row.original.imap_server}
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
          <div className="flex justify-center px-0 pr-4 text-[13px] font-medium text-gray-600">
            Action
          </div>
        )}
      </>
    ),
    cell: ({ row }) => {
      return (
        <div className="pr-4 text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-gray-600 size-5 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div>
                {/* <Button
                    className="text-[13px] font-normal h-fit p-0 hover:bg-accent hover:text-accent-foreground"
                    variant="transparent"
                  >
                    Send
                  </Button> */}

                {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <SendEmailForm memberIds={memberIds} setIsOpen={setIsOpen} />
              </Dialog> */}
              </div>

              <div>
                <DeleteEmailAccount id={row.original.id} />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

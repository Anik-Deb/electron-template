import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import React from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteAllProviders from './DeleteAllServiceProvider';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import EditServiceProvider from '../EditServiceProvider';
import DeleteServiceProvider from './DeleteServiceProvider';
import CustomColumn from '@/components/Common/Columns/CustomColumn';
import { Mail, MapPin, Phone } from 'lucide-react';

export const columns = [
  MultiSelectColumn(DeleteAllProviders), // Multi selection delete
  CustomColumn({
    accessorKey: 'service_provider_name',
    headerText: 'Provider Name',
  }),
  CustomColumn({
    accessorKey: 'contact_person',
    headerText: 'Person Name',
  }),
  CustomColumn({
    accessorKey: 'contact_email',
    headerText: 'Email',
    icon: <Mail className="text-gray-500 w-3 h-3" />, 
  }),
  CustomColumn({
    accessorKey: 'contact_phone',
    headerText: 'Phone',
    icon: <Phone className="text-gray-500 w-3 h-3" />,
  }),
  CustomColumn({
    accessorKey: 'address',
    headerText: 'Address',
    icon: <MapPin className="text-gray-500 w-3 h-3" />,
  }),
  CustomColumn({
    accessorKey: 'current_balance',
    headerText: 'Due Amount',
    cellRenderer: (value) => (
      <>
        <span className="text-[20px] font-bold">&#2547;</span> {value}
      </>
    ),
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
      const [isModalOpen, setIsModalOpen] = React.useState(false);
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
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} id={id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-[13px] font-normal h-fit p-0 w-full pl-2"
                      variant="transparent"
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                </DropdownMenuItem>
                {/* Add user form */}
                <EditServiceProvider setIsModalOpen={setIsModalOpen} id={id} />
              </Dialog>
              {/* Delete User Alert Dialog */}
              <DeleteServiceProvider id={id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

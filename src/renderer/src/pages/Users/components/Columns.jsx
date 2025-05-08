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
import { Mail, Phone } from 'lucide-react';
import DeleteUser from './DeleteUser';
import DeleteAll from '@/components/Common/DeleteAll/DeleteAll';
import EditUser from '../EditUser';
import ViewDetails from './ViewDetails';
import CustomColumn from '@/components/Common/Columns/CustomColumn';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';

export const columns = [
  MultiSelectColumn(DeleteAll),
  CustomColumn({
    accessorKey: 'first_name',
    headerText: 'First Name',
  }),
  CustomColumn({
    accessorKey: 'last_name',
    headerText: 'Last Name',
  }),
  CustomColumn({
    accessorKey: 'email',
    headerText: 'Email',
    icon: <Mail className="text-gray-500 w-3 h-3" />, // Add an icon
  }),
  CustomColumn({
    accessorKey: 'phone',
    headerText: 'Phone',
    icon: <Phone className="text-gray-500 w-3 h-3" />, // Add an icon
  }),
  CustomColumn({
    accessorKey: 'role',
    headerText: 'Role',
    conditionalStyles: (role) => {
      // Define conditional styles based on role
      return role === 'guest'
        ? 'bg-blue-100 text-blue-500 capitalize'
        : role === 'employee'
          ? 'bg-cyan-100 text-cyan-500 capitalize'
          : role === 'admin'
            ? 'bg-orange-100 text-orange-500 capitalize'
            : role === 'staff'
              ? 'bg-violet-100 text-violet-500 capitalize'
              : 'bg-gray-100';
    },
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
      const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
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
                <EditUser setIsModalOpen={setIsModalOpen} id={id} />
              </Dialog>
              {/* --------------View Dialog----------- */}
              <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-[13px] font-normal h-fit p-0 w-full pl-2"
                      variant="transparent"
                    >
                      View
                    </Button>
                  </DialogTrigger>
                </DropdownMenuItem>
                <ViewDetails details={row.original} />
              </Dialog>
              {/* --------------Delete User Alert Dialog----------- */}
              <DeleteUser id={id}></DeleteUser>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

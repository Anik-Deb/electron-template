import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import emptyAvatar from '../../../../assets/empty-avatar.png';
import { cn } from '@/utils';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
import DeleteEmployee from './DeleteEmployee';
import DeleteAllEmployee from '@/components/Common/DeleteAll/DeleteAllEmployee';
import ViewEmployeeDetails from '../../components/ViewEmployeeDetails';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import CustomColumn from '@/components/Common/Columns/CustomColumn';

export const columns = [
  MultiSelectColumn(DeleteAllEmployee),

  CustomColumn({
    accessorKey: 'profile_picture_url',
    headerText: 'Profile',
    cellRenderer: (value) => {
      const profileImage = value || emptyAvatar;
      return (
        <div className="flex items-center gap-[6px]">
          <img
            src={profileImage}
            className="h-8 w-8 rounded-full"
            alt="profile"
          />
        </div>
      );
    },
  }),
  CustomColumn({
    accessorKey: 'first_name',
    headerText: 'First Name',
    cellClassName: 'capitalize',
  }),

  CustomColumn({
    accessorKey: 'last_name',
    headerText: 'Last Name',
    cellClassName: 'capitalize',
  }),
  CustomColumn({
    accessorKey: 'email',
    headerText: 'Email',
    cellRenderer: (value) => (
      <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
        <Mail className="text-gray-500 w-3 h-3" />
        {value ? value : 'N/A'}
      </div>
    ),
  }),
  CustomColumn({
    accessorKey: 'phone',
    headerText: 'Phone',
    cellRenderer: (value) => (
      <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
        <Phone className="text-gray-500 w-3 h-3" />
        {value ? value : 'N/A'}
      </div>
    ),
  }),
  CustomColumn({
    accessorKey: 'address',
    headerText: 'Address',
    cellRenderer: (value) => (
      <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
        <MapPin className="text-gray-500 w-3 h-3" />
        {value ? value : 'N/A'}
      </div>
    ),
  }),
  CustomColumn({
    accessorKey: 'emergency_contact_phone',
    headerText: 'Emergency Contact',
    cellRenderer: (value) => (
      <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
        <Phone className="text-gray-500 w-3 h-3" />
        {value ? value : 'N/A'}
      </div>
    ),
  }),
  CustomColumn({
    accessorKey: 'date_of_birth',
    headerText: 'Date Of Birth',
    formatDate: true,
    icon: <Calendar className="text-gray-500 w-3 h-3" />,
  }),
  CustomColumn({
    accessorKey: 'role',
    headerText: 'Role',
    cellRenderer: (value) => {
      const roleClass =
        value === 'guest'
          ? 'bg-blue-100 text-blue-500'
          : value === 'employee'
            ? 'bg-cyan-100 text-cyan-500'
            : value === 'admin'
              ? 'bg-orange-100 text-orange-500'
              : value === 'staff'
                ? 'bg-violet-100 text-violet-500'
                : 'bg-gray-100';

      return (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            roleClass
          )}
        >
          {value}
        </span>
      );
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
      return (
        <div className="text-center">
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
                  to={`/employees/employee/edit-employee/${row.original?.id}`}
                >
                  <Button
                    className="text-[13px] font-normal h-fit p-0 w-full pl-2"
                    variant="transparent"
                  >
                    Edit
                  </Button>
                </Link>
              </DropdownMenuItem>
              {/* --------------View drawer----------- */}
              <ViewEmployeeDetails details={row.original} />
              {/* Delete User Alert Dialog */}
              <DeleteEmployee id={row.original?.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

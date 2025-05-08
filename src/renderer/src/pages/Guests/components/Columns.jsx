import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import emptyAvatar from '../../../assets/empty-avatar.png';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteGuest from './DeleteGuest';
import DeleteAllGuest from './DeleteAllGuest';
import ViewGuestDetails from './ViewGuestDetails';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import CustomColumn from '@/components/Common/Columns/CustomColumn';

export const columns = [
  // {
  //   id: 'select',
  //   header: ({ table }) => {
  //     let userIds = [];
  //     const selectedIds = table.getSelectedRowModel().rows;
  //     for (const element of selectedIds) {
  //       userIds.push(element?.original?.id);
  //     }
  //     return (
  //       <div className="pl-4 relative flex items-center print-hidden">
  //         <Checkbox
  //           className="data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
  //           checked={table.getIsAllPageRowsSelected()}
  //           onCheckedChange={(value) =>
  //             table.toggleAllPageRowsSelected(!!value)
  //           }
  //           aria-label="Select all"
  //         />
  //         {(table.getIsAllPageRowsSelected() ||
  //           table.getIsSomeRowsSelected()) && (
  //           <div className="absolute left-full top-0 flex items-center">
  //             <DeleteAllGuest selectedIds={selectedIds} />
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="pl-4 print-hidden">
  //       <Checkbox
  //         className="data-[state=checked]:border-0 data-[state=checked]:text-primary-950"
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: 'profile_picture_url',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Profile</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const profileImage = row.getValue('profile_picture_url') || emptyAvatar;
  //     return (
  //       <div className="flex items-center gap-[6px]">
  //         <img
  //           src={profileImage}
  //           className="h-8 w-8 rounded-full"
  //           alt="profile"
  //         />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'first_name',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>First Name</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <span className="text-[13px] font-medium text-subHeading">
  //       {row.getValue('first_name')}
  //     </span>
  //   ),
  // },
  // {
  //   accessorKey: 'last_name',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Last Name</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <span className="text-[13px] font-medium text-subHeading">
  //       {row.getValue('last_name')}
  //     </span>
  //   ),
  // },

  // {
  //   accessorKey: 'email',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Email</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
  //       <Mail className="text-gray-500 w-3 h-3" />
  //       {row.getValue('email')}
  //     </div>
  //   ),
  // },

  // {
  //   accessorKey: 'date_of_birth',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Date Of Birth</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     // Get the date value from the row
  //     const dateOfBirth = row.getValue('date_of_birth');

  //     // Format the date (e.g., "MM/DD/YYYY")
  //     const formattedDate = new Date(dateOfBirth).toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //     });

  //     return (
  //       <span className="text-[13px] font-medium text-subHeading">
  //         {formattedDate}
  //       </span>
  //     );
  //   },
  // },

  // {
  //   accessorKey: 'phone',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Phone</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
  //       <Phone className="text-gray-500 w-3 h-3" />
  //       {row.getValue('phone')}
  //     </div>
  //   ),
  // },
  // Date of Birth Column

  // phone

  // {
  //   accessorKey: 'emergency_contact_phone',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Emergency contact</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const value = row.getValue('emergency_contact_phone');
  //     return (
  //       <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
  //         <Phone className="text-gray-500 w-3 h-3" />
  //         {value ? value : 'N/A'}
  //       </div>
  //     );
  //   },
  // },
  // Emergency Contact Column

  // {
  //   accessorKey: 'address',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Address</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const value = row.getValue('address');
  //     return (
  //       <div className="flex items-center gap-2 text-[13px] font-normal text-paragraph">
  //         <MapPin className="text-gray-500 w-3 h-3" />
  //         {value ? value : 'N/A'}
  //       </div>
  //     );
  //   },
  // },

  // {
  //   accessorKey: 'role',
  //   header: ({ table }) => {
  //     return (
  //       <>
  //         {!(
  //           table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
  //         ) && <p>Role</p>}
  //       </>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const role = row.getValue('role');
  //     const roleClass =
  //       role === 'guest'
  //         ? 'bg-blue-100 text-blue-500 capitalize'
  //         : role === 'employee'
  //           ? 'bg-cyan-100 text-cyan-500 capitalize'
  //           : role === 'admin'
  //             ? 'bg-orange-100 text-orange-500 capitalize'
  //             : role === 'staff'
  //               ? 'bg-violet-100 text-violet-500 capitalize'
  //               : 'bg-gray-100';

  //     return (
  //       <span
  //         className={cn(
  //           'px-2 py-1 rounded-full text-xs font-semibold',
  //           roleClass
  //         )}
  //       >
  //         {role}
  //       </span>
  //     );
  //   },
  // },
  // Role Column
  MultiSelectColumn(DeleteAllGuest), // Multi selection delete

  CustomColumn({
    accessorKey: 'profile_picture_url',
    headerText: 'Profile',
    cellRenderer: (value) => (
      <div className="flex items-center gap-[6px]">
        <img
          src={value || emptyAvatar}
          className="h-8 w-8 rounded-full"
          alt="profile"
        />
      </div>
    ),
  }),
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
    accessorKey: 'date_of_birth',
    headerText: 'Date Of Birth',
    formatDate: true, // Enable date formatting
    icon: <Calendar className="text-gray-500 w-3 h-3" />, // Add an icon
  }),
  CustomColumn({
    accessorKey: 'phone',
    headerText: 'Phone',
    icon: <Phone className="text-gray-500 w-3 h-3" />, // Add an icon
  }),
  CustomColumn({
    accessorKey: 'emergency_contact_phone',
    headerText: 'Emergency Contact',
    icon: <Phone className="text-gray-500 w-3 h-3" />, // Add an icon
  }),
  CustomColumn({
    accessorKey: 'address',
    headerText: 'Address',
    icon: <MapPin className="text-gray-500 w-3 h-3" />, // Add an icon
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
    enableHiding: false,
    accessorKey: 'id',
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
                to={`/guests/edit-guest/${row.original?.id}`}
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
            <ViewGuestDetails details={row.original} />
            {/* Delete User Alert Dialog */}
            <DeleteGuest id={id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // CustomActionColumn({
  //   renderChildren: ({ id, row }) => (
  //     <React.Fragment key={`dropdown-${id}`}>
  //       <DropdownMenuItem key={`edit-${id}`}>
  //         <Link
  //           className="w-full"
  //           to={`/guests/edit-guest/${row.original?.id}`}
  //         >
  //           <Button
  //             className="text-[13px] font-normal h-fit p-0 w-full pl-2"
  //             variant="transparent"
  //           >
  //             Edit
  //           </Button>
  //         </Link>
  //       </DropdownMenuItem>
  //       <ViewGuestDetails key={`view-${id}`} details={row.original} />
  //       <DeleteGuest key={`delete-${id}`} id={id} />
        
  //     </React.Fragment>
  //   ),
  // }),
];

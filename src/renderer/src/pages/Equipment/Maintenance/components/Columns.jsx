import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToast } from '@/utils/toastHelper';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const columns = [
  {
    id: 'select',
    header: ({ table }) => {
      let posMachinesIds = [];
      const selectedIds = table.getSelectedRowModel().rows;
      for (const element of selectedIds) {
        posMachinesIds.push(element?.original?.id);
      }
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
              {/* <DeleteAllEquipment
                selectedIds={selectedIds}
              /> */}
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
  },
  {
    accessorKey: 'equipmentName',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Equipment Name</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        {row.getValue('equipmentName')}
      </span>
    ),
  },
  {
    accessorKey: 'maintenanceDate',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Maintenance Date</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        {new Date(row.getValue('maintenanceDate')).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: 'technician',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Technician</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        {row.getValue('technician')}
      </span>
    ),
  },
  {
    accessorKey: 'nextMaintenanceDue',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Next Maintenance Due</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        {new Date(row.getValue('nextMaintenanceDue')).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: 'cost',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Cost</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        ${row.getValue('cost').toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'notes',
    header: ({ table }) => (
      <>
        {!(
          table.getIsAllPageRowsSelected() || table.getIsSomeRowsSelected()
        ) && <p>Notes</p>}
      </>
    ),
    cell: ({ row }) => (
      <span className="text-[13px] font-medium text-subHeading">
        {row.getValue('notes')}
      </span>
    ),
  },

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
      const [isActive, setIsActive] = React.useState(row.original.is_active);
      const navigate = useNavigate();

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
              {/* Edit Pos Machine */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} id={id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DialogTrigger asChild>
                    <Button
                      className="text-[13px] font-normal h-fit p-0 w-full pl-2"
                      variant="transparent"
                    >
                      <span>Edit</span>
                    </Button>
                  </DialogTrigger>
                </DropdownMenuItem>
                {/* Add form */}
                {/* <EditEquipment setIsModalOpen={setIsModalOpen} id={id} /> */}
              </Dialog>
              {/* Delete  Alert Dialog */}
              {/* <DeleteEquipment id={id}></DeleteEquipment> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

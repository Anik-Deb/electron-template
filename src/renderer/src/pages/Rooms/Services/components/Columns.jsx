import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import CustomColumn from '@/components/Common/Columns/CustomColumn';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
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
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showToast } from '@/utils/toastHelper';
import { useNavigate } from 'react-router-dom';
import EditServices from '../EditServices';
import DeleteAllServices from './DeleteAllServices';
import DeleteService from './DeleteService';

export const columns = [
  MultiSelectColumn(DeleteAllServices), // Multi selection delete
  CustomColumn({
    accessorKey: 'service_name',
    headerText: 'Service Name',
  }),
  CustomColumn({
    accessorKey: 'default_price',
    headerText: 'Default Price',
    cellRenderer: (value) => (
      <span className="text-[13px] font-medium text-subHeading">
        <span className="text-[20px] font-bold">&#2547;</span> {value}
      </span>
    ),
  }),
  CustomColumn({
    accessorKey: 'provider_rate',
    headerText: 'Provider Rate',
    cellRenderer: (value) => (
      <span className="text-[13px] font-medium text-subHeading">
        <span className="text-[20px] font-bold">&#2547;</span> {value}
      </span>
    ),
  }),
  CustomColumn({
    accessorKey: 'hotel_rate',
    headerText: 'Hotel Rate',
    cellRenderer: (value) => (
      <span className="text-[13px] font-medium text-subHeading">
        <span className="text-[20px] font-bold">&#2547;</span> {value}
      </span>
    ),
  }),
  CustomColumn({
    accessorKey: 'is_active',
    headerText: 'Is Active',
    cellRenderer: (value) => (
      <span
        className={`text-[13px] font-sm px-2 border rounded-full ${
          value
            ? 'text-primary border-teal-500'
            : 'text-rose-400 border-rose-400'
        }`}
      >
        {value ? 'Active' : 'Inactive'}
      </span>
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
          ) && (
            <p className="print-hidden flex ml-auto max-w-max justify-end pr-4 pl-4 lg:pl-8 text-[13px] font-medium text-gray-600">
              Actions
            </p>
          )}
        </>
      );
    },
    cell: ({ row }) => {
      const [isModalOpen, setIsModalOpen] = React.useState(false);
      const id = row.getValue('id');
      const [isActive, setIsActive] = React.useState(row.original.is_active);
      const navigate = useNavigate();

      const handleToggleActive = async () => {
        try {
          const updatedIsActive = !isActive;
          setIsActive(updatedIsActive);
          const updates = { is_active: updatedIsActive };
          await window.api.updateService({ id, updates });
          navigate(0);
          showToast(
            'success',
            `${row.original.service_name} service is now ${updatedIsActive ? 'Active' : 'Inactive'}!`
          );
        } catch (error) {
          console.error('Failed to update status', error);
          setIsActive(isActive);
          showToast('error', 'Failed to update service!');
        }
      };

      return (
        <div className="w-[91px] ml-auto pl-4 lg:pl-4 pr-4 text-end print-hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="stroke-gray-600 size-5 stroke-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Toggle Service Status */}
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="text-[13px] font-normal w-full p-0 flex items-center gap-2"
                      variant="transparent"
                    >
                      <span className="text-[13px] px-4 cursor-pointer bg-gray">
                        {isActive ? 'Inactive' : 'Active'}
                      </span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmation</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to
                        <span className="px-1">
                          {isActive ? 'InActive' : 'Activate'}
                        </span>
                        this room service?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleActive();
                        }}
                      >
                        <span className="text-white"> Yes</span>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {/* Edit service */}
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
                {/* Add services form */}
                <EditServices setIsModalOpen={setIsModalOpen} id={id} />
              </Dialog>
              {/* Delete service Alert Dialog */}
              <DeleteService id={id}></DeleteService>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

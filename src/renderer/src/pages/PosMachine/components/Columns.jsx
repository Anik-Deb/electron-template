import React from 'react';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
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
import DeleteAllPosMachineData from './DeleteAllPosMachineData';
import DeletePosMachineData from './DeletePosMachineData';
import EditPosMachine from '../EditPosMachine';
import { MapPin } from 'lucide-react';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import CustomColumn from '@/components/Common/Columns/CustomColumn';

export const columns = [
  MultiSelectColumn(DeleteAllPosMachineData),
  CustomColumn({
    accessorKey: 'name',
    headerText: 'Name',
  }),
  CustomColumn({
    accessorKey: 'location',
    headerText: 'Location',
    cellRenderer: (value) => {
      return (
        <span className="text-[13px] font-medium text-subHeading flex items-center gap-1">
          <MapPin
            className={`w-4 h-4 ${value ? 'text-gray-400' : 'text-gray-400'}`}
          />
          {value ? value : 'N/A'}
        </span>
      );
    },
  }),
  CustomColumn({
    accessorKey: 'is_active',
    headerText: 'Is Active',
    cellRenderer: (value) => (
      <span
        className={`text-[13px] font-sm px-2 border rounded-full ${
          value
            ? 'text-primary border-teal-500'
            : 'text-rose-400 border-rose-400 '
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
          ) && <p>Actions</p>}
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
          await window.api.updatePosMachine({ id, updates });
          navigate(0);
          showToast(
            'success',
            `${row.original.name} Pos Machine is now ${updatedIsActive ? 'Active' : 'Inactive'}!`
          );
        } catch (error) {
          console.error('Failed to update status', error);
          setIsActive(isActive);
          showToast('error', 'Failed to update Pos Machine!');
        }
      };

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
              {/* Toggle Pos Machine Status */}
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
                        this Pos Machine?
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
                {/* Add Pos Machine form */}
                <EditPosMachine setIsModalOpen={setIsModalOpen} id={id} />
              </Dialog>
              {/* Delete Pos Machine Alert Dialog */}
              <DeletePosMachineData id={id}></DeletePosMachineData>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

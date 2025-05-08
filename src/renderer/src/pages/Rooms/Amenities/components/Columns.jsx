import React from 'react';
import CustomColumn from '@/components/Common/Columns/CustomColumn';
import { MultiSelectColumn } from '@/components/Common/Columns/MultiSelectColumn';
import MoreHorizontalIcon from '@/components/Icons/MoreHorizontalIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditAmenities from '../EditAmenities';
import DeleteAllAmenities from './DeleteAllAmenities';
import DeleteAmenity from './DeleteAmenity';

export const columns = [
  MultiSelectColumn(DeleteAllAmenities), // Multi selection delete
  CustomColumn({
    accessorKey: 'amenity_name',
    headerText: 'Amenity Name',
  }),
  CustomColumn({
    accessorKey: 'description',
    headerText: 'Description',
    cellRenderer: (value) => (
      <div
        className="text-[13px] font-medium text-subHeading"
        dangerouslySetInnerHTML={{ __html: value }}
      />
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
                {/* Add amenity form */}
                <EditAmenities setIsModalOpen={setIsModalOpen} id={id} />
              </Dialog>
              {/* Delete Amenity Alert Dialog */}
              <DeleteAmenity id={id}></DeleteAmenity>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

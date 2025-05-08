/* eslint-disable react/prop-types */
import DangerIcon from '@/components/Icons/DangerIcon';
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
import { PenLine } from 'lucide-react';
import React from 'react';

const UpdateService = ({ handleEditService, service }) => {
  // Handle Update
  const handleUpdate = () => {
    handleEditService(service);
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-fit p-2 rounded bg-[#35b9e90d]">
        {/* <Button variant="ghost" size="sm" className="p-2 bg-rose-50/75 h-auto"> */}
        <PenLine className="w-[16px] h-[16px] text-[#2EA7D3]" />
        {/* </Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-slate-50">
        <AlertDialogHeader className="flex flex-col items-center gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-start">
          <p className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive-100">
            <DangerIcon className="size-[1.4rem] stroke-destructive stroke-[1.5]" />
          </p>
          <div>
            <AlertDialogTitle>
              <p className="text-base font-semibold">Update</p>
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-paragraph">
              Do You want to Update this service.
              {/* {description || 'Do you want to delete'} */}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-end">
          <AlertDialogCancel className="h-8 border">No</AlertDialogCancel>
          <AlertDialogAction className="h-8 text-white" onClick={handleUpdate}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateService;

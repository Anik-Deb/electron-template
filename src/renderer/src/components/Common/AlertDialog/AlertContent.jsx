import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';
import DangerIcon from '@/components/Icons/DangerIcon';

export const AlertContent = ({ title, description, ...props }) => {
  return (
    <AlertDialogContent className="border-none bg-slate-50">
      <AlertDialogHeader className="flex flex-col items-center gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-start">
        <p className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive-100">
          <DangerIcon className="size-[1.4rem] stroke-destructive stroke-[1.5]" />
        </p>
        <div>
          <AlertDialogTitle>
            <p className="text-base font-semibold">
              Delete
            </p>
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-2 text-paragraph">
            This action cannot be undone. Deleting the item will permanently
            remove all associated data.
            {/* {description || 'Do you want to delete'} */}
          </AlertDialogDescription>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex justify-center sm:justify-end">
        <AlertDialogCancel className="h-8 bg-rose-500 text-white">No</AlertDialogCancel>
        <AlertDialogAction className="h-8 text-white" {...props}>
          Yes
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

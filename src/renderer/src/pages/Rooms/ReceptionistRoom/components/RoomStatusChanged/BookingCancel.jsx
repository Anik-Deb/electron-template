import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
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
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/utils';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookingCancel({ className, room }) {
  const navigate = useNavigate();

  /**
   * Update booking status cancel
   * Set room status available
   *
   * */
  const handleCancel = async () => {
    try {
      const roomPromise = window.api.updateRoom({
        id: room?.id,
        updates: {
          status: 'available',
        },
      });
      const bookingPromise = window.api.updateBooking({
        id: room?.booking?.id,
        updates: { status: 'canceled' },
      });
      const result = await Promise.all([roomPromise, bookingPromise]);
      console.log('result:', result);
      navigate(0);
      //   showToast('success', 'Delete User successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          // variant={variant || 'transparent'}
          variant={'outline'}
          className={cn(
            'hover:border-gray-100 hover:bg-gray-100 flex-1',
            className
          )}
        >
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-slate-50">
        <AlertDialogHeader className="flex flex-col items-center gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-start">
          <p className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive-100">
            <DangerIcon className="size-[1.4rem] stroke-destructive stroke-[1.5]" />
          </p>
          <div>
            <AlertDialogTitle>
              <p className="text-base font-semibold">Cancel</p>
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-paragraph">
              This action cannot be undone. Cancel the item will permanently
              cancel this booking.
              {/* {description || 'Do you want to delete'} */}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-end">
          <AlertDialogCancel className="h-8 border text-gray-500">
            No
          </AlertDialogCancel>
          <AlertDialogAction className="h-8 text-white" onClick={handleCancel}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

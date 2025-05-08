import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import React from 'react';
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
import { cn } from '@/utils';
import { showToast } from '@/utils/toastHelper';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoomMaintenance({ className, room }) {
  const navigate = useNavigate();

  /**
   * Update booking status maintenance
   * */
  const handleMaintenance = async () => {
    try {
      const result = await window.api.updateRoom({
        id: room?.id,
        updates: {
          status: 'maintenance',
        },
      });
      console.log('result:', result);
      navigate(0);
      // showToast('success', 'Room Updated to Maintenance!');
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
          Maintenance
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-none bg-slate-50">
        <AlertDialogHeader className="flex flex-col items-center gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-start">
          <p className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
            <Check className="size-[1.4rem] stroke-green stroke-[1.5]" />
          </p>
          <div>
            <AlertDialogTitle>
              <p className="text-base font-semibold">Maintenance</p>
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-paragraph">
              This action cannot be undone.
              {/* {description || 'Do you want to delete'} */}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-end">
          <AlertDialogCancel className="h-8 border text-gray-500">
            No
          </AlertDialogCancel>
          <AlertDialogAction
            className="h-8 text-white"
            onClick={handleMaintenance}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

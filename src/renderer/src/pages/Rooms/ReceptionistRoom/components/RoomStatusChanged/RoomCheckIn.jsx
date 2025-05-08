import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoomCheckIn({ booking }) {
  const navigate = useNavigate();

  const handleCheckIn = async () => {
    try {
      // const roomPromise = window.api.updateBooking({id:booking?.roomId, status:'checked'});
      // const bookingPromise = window.api.updateBooking({id:booking?.id,status:'checked'})
      // const result = await Promise.all([roomPromise, bookingPromise])
      //   navigate(0);
      //   showToast('success', 'Delete User successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('error', 'Failed to delete user!');
    }
  };
  return (
    <AlertDialog>
      <AlertTrigger className="w-full">
        <Button
          className="text-[13px] font-normal h-fit p-0"
          variant="transparent"
        >
          Check In
        </Button>
      </AlertTrigger>
      <DropdownMenuItem className="py-0">
        <AlertContent
          title="Are you sure you want to Check in this booking?"
          description="This action cannot be undone."
          onClick={handleCheckIn}
        />
      </DropdownMenuItem>
    </AlertDialog>
  );
}

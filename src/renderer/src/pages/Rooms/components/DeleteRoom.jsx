/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';

const DeleteRoom = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      console.log('id:', id);
      const result = await window.api.deleteRoom(id);
      console.log('result:', result);
      navigate(0);
      showToast('success', 'Delete Room successfully!');
    } catch (error) {
      let error_message;
      if (
        error?.message?.includes(
          'Active bookings exist for this room'
        )
      ) {
        error_message = 'Active bookings exist for this room';
      }
      console.error('Error deleting room:', error);
      showToast('error', error_message || 'Failed to delete the rooms');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger className="w-full">
        <Button
          className="text-[13px] font-normal h-fit p-0"
          variant="transparent"
        >
          Delete
        </Button>
      </AlertTrigger>
      <DropdownMenuItem className="py-0">
        <AlertContent
          title="Are you sure you want to delete this room?"
          description="This action cannot be undone."
          onClick={handleDelete}
        />
      </DropdownMenuItem>
    </AlertDialog>
  );
};

export default DeleteRoom;

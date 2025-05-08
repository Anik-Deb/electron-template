/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const DeleteGuest = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Fetch the guest data
      const guest = await window.api.getGuest(id);

      // If the guest doesn't exist, exit early
      if (!guest) {
        console.error('Guest not found');
        return;
      }

      // Delete the guest and user concurrently
      await Promise.all([
        window.api.deleteGuest(guest?.id),
        window.api.deleteUser(guest?.user_id),
      ]);
      // Navigate only after successful deletion
      navigate(0);
    } catch (error) {
      console.error('Error deleting guest:', error);
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
          title="Are you sure you want to delete this user?"
          description="This action cannot be undone."
          onClick={handleDelete}
        />
      </DropdownMenuItem>
    </AlertDialog>
  );
};

export default DeleteGuest;

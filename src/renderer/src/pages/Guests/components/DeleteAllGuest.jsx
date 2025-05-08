/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllGuest = ({ selectedIds }) => {
  const navigate = useNavigate();
  // console.log(selectedIds);
  // const ids = selectedIds.map((item) => item?.original.id);
  // console.log(ids);
  const handleDelete = async () => {
    try {
      // Fetch all guests concurrently
      const guestPromises = selectedIds.map((id) => window.api.getGuest(id));
      const guests = await Promise.all(guestPromises);

      // Filter out invalid guests and create deletion promises
      const deletePromises = guests
        .filter((guest) => {
          if (!guest) {
            console.error(`Guest not found for one of the selected IDs`);
            return false;
          }
          return true;
        })
        .map((guest) =>
          Promise.all([
            window.api.deleteGuest(guest.id),
            window.api.deleteUser(guest.user_id),
          ]).catch((error) => {
            console.error(`Error deleting guest with ID ${guest.id}:`, error);
          })
        );

      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      navigate(0)
    } catch (error) {
      console.error('Error during the deletion process:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these guest?"
        description="This action cannot be undone. Deleting these guest will permanently remove all associated data."
        onClick={handleDelete}
      />
    </AlertDialog>
  );
};

export default DeleteAllGuest;

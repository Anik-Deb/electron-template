/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllRoom = ({ selectedIds }) => {
  const navigate = useNavigate();
  // const ids = selectedIds.map((item) => item?.original.id);

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllRoom(selectedIds);
      showToast('success', 'Delete All Amenities successfully!');
      navigate(0);
    } catch (error) {
      console.error('Error deleting rooms:', error);
      let error_message;
      if (error?.message?.includes('Cannot delete rooms with active bookings')) {
        error_message = 'Cannot delete rooms with active bookings';
      }
      console.error('Error deleting room:', error);
      showToast('error', error_message || 'Failed to delete the rooms');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these rooms?"
        description="This action cannot be undone. Deleting these rooms will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAllRoom;

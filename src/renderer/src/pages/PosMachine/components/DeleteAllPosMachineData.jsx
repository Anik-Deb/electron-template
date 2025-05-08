/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllPosMachineData = ({ selectedIds }) => {
  const navigate = useNavigate();
  // const ids = selectedIds.map((item) => item?.original.id);

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllPosMachine(selectedIds);
      showToast('success', 'Delete All pos machine successfully!');
      navigate(0);
    } catch (error) {
      console.error('Error deleting pos machine:', error);
      showToast('error', 'Failed to delete all pos machine!');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these pos machine?"
        description="This action cannot be undone. Deleting these pos machine will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAllPosMachineData;

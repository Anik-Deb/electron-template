/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllServices = ({ selectedIds }) => {
  const navigate = useNavigate();
  console.log('selected ids',selectedIds);
  // const ids = selectedIds.map((item) => item?.original.id);
  // console.log(ids);

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllService(selectedIds);
      showToast('success', 'Delete All room service successfully!');
      navigate(0);
    } catch (error) {
      console.error('Error deleting room service:', error);
      showToast('error', 'Failed to delete all room service!');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these room service?"
        description="This action cannot be undone. Deleting these room services will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAllServices;

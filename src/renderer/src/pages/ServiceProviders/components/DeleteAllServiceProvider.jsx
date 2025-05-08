/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllProviders = ({ selectedIds }) => {
  const navigate = useNavigate();
  // console.log(selectedIds);
  // const ids = selectedIds.map((item) => item?.original.id);
  // console.log(ids);

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllServiceProvider(selectedIds);
      showToast('success', 'Delete All providers successfully!');
      navigate(0);
      console.log('trigger handle delete all', selectedIds);
    } catch (error) {
      console.error('Error deleting providers:', error);
      showToast('error', 'Failed to delete all providers!');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these Providers?"
        description="This action cannot be undone. Deleting these Providers will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAllProviders;

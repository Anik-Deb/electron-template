/* eslint-disable react/prop-types */
import React from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import AlertTrigger from '../AlertDialog/AlertTrigger';
import { AlertContent } from '../AlertDialog/AlertContent';
import { useNavigate } from 'react-router-dom';

const DeleteAll = ({ selectedIds }) => {
  const navigate = useNavigate();
  // console.log(selectedIds);
  // const ids = selectedIds.map((item) => item?.original.id);
  // console.log(ids);

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllUser(selectedIds);
      navigate(0);
      console.log('trigger handle delete all');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these Users?"
        description="This action cannot be undone. Deleting these Users will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAll;

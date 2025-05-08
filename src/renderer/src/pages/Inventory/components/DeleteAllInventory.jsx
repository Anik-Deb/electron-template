import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function DeleteAllInventory({ selectedIds }) {
  const navigate = useNavigate();
  const deleteHandler = async () => {
    console.log('selected Ids:', selectedIds);
    try {
      await window.api.deleteAllInventory(selectedIds);
      navigate(0);
    } catch (error) {
      console.log('Error from deleting:', error);
    }
  };
  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete this Inventory items?"
        description="This action cannot be undone. Delete the Inventory items permanently."
        onClick={deleteHandler}
      />
    </AlertDialog>
  );
}
export default DeleteAllInventory;

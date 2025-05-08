/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';

const DeleteInventory = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      console.log('id:', id);
      const deleteData = await window.api.deleteInventory(id);
      showToast('success', 'Employee Added successfully!');
      navigate(0);
    } catch (error) {
      // console.log('Error deleting data:', error);
      let error_message = 'Failed to update employee!';
      if (error?.message?.includes('Inventory item not found')) {
        error_message = 'Inventory item not found!';
      }
      showToast('error', error_message);
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
export default DeleteInventory;

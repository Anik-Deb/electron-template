/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';

const DeleteUser = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await window.api.deleteUser(id);
      navigate(0);
      showToast('success', 'Delete User successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('error', 'Failed to delete user!');
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

export default DeleteUser;

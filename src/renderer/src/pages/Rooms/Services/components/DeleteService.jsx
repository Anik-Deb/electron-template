/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import { Trash } from 'lucide-react';

const DeleteService = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await window.api.deleteService(id);
      showToast('success', 'Delete room service successfully!');
      navigate(0);
    } catch (error) {
      console.error('Error deleting room service:', error);
      showToast('error', 'Failed to delete room service!');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger className="w-full">
        <Button
          className="text-[13px] font-normal h-fit p-0 flex items-center gap-2"
          variant="transparent"
        >
          <Trash className="size-4" />
          <span>Delete</span>
        </Button>
      </AlertTrigger>
      <DropdownMenuItem className="py-0">
        <AlertContent
          title="Are you sure you want to delete this room service?"
          description="This action cannot be undone."
          onClick={handleDelete}
        />
      </DropdownMenuItem>
    </AlertDialog>
  );
};

export default DeleteService;

/* eslint-disable react/prop-types */
import React from 'react';
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

const DeleteEmployee = ({ id }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Fetch the employee data
      const employee = await window.api.getEmployee(id);

      // If the employee doesn't exist, exit early
      if (!employee) {
        console.error('Employee not found');
        return;
      }

      // Delete the employee and user concurrently
      const result = await Promise.all([
        window.api.deleteEmployee(employee?.id),
        window.api.deleteUser(employee?.user_id),
      ]);
      // Navigate only after successful deletion
      navigate(0);
    } catch (error) {
      console.error('Error deleting employee:', error);
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

export default DeleteEmployee;

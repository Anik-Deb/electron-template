/* eslint-disable react/prop-types */
import React from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog';
import AlertTrigger from '../AlertDialog/AlertTrigger';
import { AlertContent } from '../AlertDialog/AlertContent';
import { useNavigate } from 'react-router-dom';

const DeleteAllEmployee = ({ selectedIds }) => {
  const navigate = useNavigate();
  // console.log(selectedIds);
  // const ids = selectedIds.map((item) => item?.original.id);
  // console.log(ids);
  const handleDelete = async () => {
    try {
      // Create an array of promises for deleting employees and users
      const deletePromises = selectedIds.map(async (id) => {
        const employee = await window.api.getEmployee(id);

        if (!employee) {
          console.error('Employee not found');
          return;
        }

        // Delete the employee and user concurrently
        await Promise.all([
          window.api.deleteEmployee(employee?.id),
          window.api.deleteUser(employee?.user_id),
        ]);
      });

      // Wait for all deletions to complete
      await Promise.all(deletePromises);

      // Navigate only after all deletions are successful
      navigate(0);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these Employees?"
        description="This action cannot be undone. Deleting these Employees will permanently remove all associated data."
        onClick={handleDelete}
      />
    </AlertDialog>
  );
};

export default DeleteAllEmployee;

/* eslint-disable react/prop-types */
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { showToast } from '@/utils/toastHelper';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteAllAmenities = ({ selectedIds }) => {
  const navigate = useNavigate();

  const handleDeleteAll = async () => {
    try {
      await window.api.deleteAllAmenity(selectedIds);
      showToast('success', 'Delete All Amenities successfully!');
      navigate(0);
      console.log('trigger handle delete all');
    } catch (error) {
      console.error('Error deleting amenity:', error);
      showToast('error', 'Failed to delete all amenities!');
    }
  };

  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these Amenities?"
        description="This action cannot be undone. Deleting these Amenities will permanently remove all associated data."
        onClick={handleDeleteAll}
      />
    </AlertDialog>
  );
};

export default DeleteAllAmenities;

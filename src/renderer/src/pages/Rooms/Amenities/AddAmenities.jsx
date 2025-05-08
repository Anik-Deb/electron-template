/* eslint-disable react/prop-types */
import React from 'react';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import AmenitiesFrom from './components/AmenitiesFrom';
import { showToast } from '@/utils/toastHelper';

export default function AddAmenities({ setIsModalOpen, setAmenities }) {
  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const amenities = await window.api.addAmenity(data);
      // Success toast
      showToast('success', 'Amenity added successfully!');
      setIsModalOpen(false);
      setAmenities((prev) => [...prev, amenities]);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error toast
      showToast('error', 'Failed to add amenity.');
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Create New Amenity">
      <div className="mt-2 px-2 rounded-lg">
        <AmenitiesFrom
          setAmenities={setAmenities}
          setIsModalOpen={setIsModalOpen}
          onSubmit={onSubmit}
        ></AmenitiesFrom>
      </div>
    </ModalContent>
  );
}

/* eslint-disable react/prop-types */
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { showToast } from '@/utils/toastHelper';
import ServicesFrom from './components/ServicesFrom';
import React from 'react';

export default function AddServices({ setIsModalOpen, setRoomServices }) {
  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const services = await window.api.addService(data);
      // Success toast
      showToast('success', 'Room Service added successfully!');
      setIsModalOpen(false);
      // navigate('/rooms/services')
      setRoomServices((prev) => [...prev, services]);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error toast
      showToast('error', 'Failed to add service.');
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Create New Service">
      <div className="mt-2 px-2 rounded-lg">
        <ServicesFrom setIsModalOpen={setIsModalOpen} onSubmit={onSubmit} />
      </div>
    </ModalContent>
  );
}

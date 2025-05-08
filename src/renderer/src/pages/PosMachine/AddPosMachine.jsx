/* eslint-disable react/prop-types */
import React from 'react';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { showToast } from '@/utils/toastHelper';
import PosMachineFrom from './components/PosMachineFrom';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function AddPosMachine({ setIsModalOpen, setPosMachines }) {
  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const posMachines = await window.api.addPosMachine(data);
      // Success toast
      showToast('success', 'Pos Machine added successfully!');
      setIsModalOpen(false);
      setPosMachines((prev) => [...prev, posMachines]);
    } catch (error) {
      console.error('Error submitting form:', error);
      const error_message = errorMessage(error);
      // Error toast
      showToast('error', error_message);
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Add New Pos Machine">
      <div className="mt-2 px-2 rounded-lg">
        <PosMachineFrom setIsModalOpen={setIsModalOpen} onSubmit={onSubmit} />
      </div>
    </ModalContent>
  );
}

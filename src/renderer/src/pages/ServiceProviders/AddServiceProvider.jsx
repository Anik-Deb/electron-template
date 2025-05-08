/* eslint-disable react/prop-types */
import React from 'react';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { showToast } from '@/utils/toastHelper';
import ServiceProviderForm from './components/ServiceProviderForm';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function AddServiceProvider({ setIsModalOpen, setProviders }) {
  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      console.log('Form submitted:', { ...data });
      const providers = await window.api.addServiceProvider(data);
      // // Success toast
      showToast('success', 'Provider added successfully!');
      setIsModalOpen(false);
      setProviders((prev) => [...prev, providers]);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error toast
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Create Service Provider">
      <div className="mt-2 px-2 rounded-lg">
        <ServiceProviderForm
          setProviders={setProviders}
          setIsModalOpen={setIsModalOpen}
          onSubmit={onSubmit}
        />
      </div>
    </ModalContent>
  );
}

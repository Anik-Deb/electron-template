import React from 'react';
import SMSConfigureForm from './components/SMSConfigureForm';
import Loading from '@/components/Common/Loading';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import { showToast } from '@/utils/toastHelper';

export default function AddSMSConfigure({ setData, setIsModalOpen }) {
  const onSubmit = async (data) => {
    try {
      const result = await window.api.addSMSConfiguration(data);
      if (setData) {
        setData((prevData) => [...prevData, result]);
      }
      setIsModalOpen(false);
      showToast('success', 'SMS Configuration Added successfully!');
    } catch (error) {
      const error_message = errorMessage(error);
      console.log('Error from email configure created Time', error);
      showToast('error', error_message);
    }
  };
  return <SMSConfigureForm onSubmit={onSubmit} />;
}

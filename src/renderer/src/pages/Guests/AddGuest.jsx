import React from 'react';
import GuestFrom from './components/GuestForm';
import PageTitle from '@/components/Common/PageTitle';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function AddGuest() {
  const navigate = useNavigate();
  const cancelURL = '/guests';
  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const user = await window.api.addUser(data);

      if (!user?.id) {
        throw new Error('User not created!');
      }

      await window.api.addGuest({
        user_id: user?.id,
        ...data,
      });
      navigate('/guests');
      showToast('success', 'Guest Added successfully!');
    } catch (error) {
      console.log('Error from add guest:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };

  return (
    <div>
      <PageTitle title={`Add Guest`} />
      <GuestFrom onSubmit={onSubmit} cancelURL={cancelURL}></GuestFrom>
    </div>
  );
}

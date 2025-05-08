import React from 'react';
import PageTitle from '@/components/Common/PageTitle';

import { useNavigate } from 'react-router-dom';
import RoomForm from './components/RoomForm';
import { showToast } from '@/utils/toastHelper';

const AddRoom = () => {
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });
      const result = await window.api.addRoom(data);
      // console.log('result from form', result);
      showToast('success', 'Room Added successfully!');
      navigate('/rooms');
    } catch (error) {
      console.error('Error from add room:', error);
      // Ensure the error message is always a string
      let error_message = 'Failed to add room!';
      if (error.message?.includes('already exists')) {
        error_message = 'Room number already exists';
      }
      showToast('error', error_message);
    }
  };
  return (
    <div>
      <PageTitle title={`Add Room`} />
      <RoomForm onSubmit={onSubmit}></RoomForm>
    </div>
  );
};

export default AddRoom;

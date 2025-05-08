import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/Common/PageTitle';

import { useNavigate, useParams } from 'react-router-dom';
import RoomForm from './components/RoomForm';
import { showToast } from '@/utils/toastHelper';

const EditRoom = () => {
  const { id } = useParams();
  const [prevData, setPrevData] = useState();
  const navigate = useNavigate();

  // Fetch previous user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const room = await window.api.getRoom(id); // Fetch user by ID
        // console.log("room details",room)
        setPrevData(room);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = async (updates) => {
    try {
      console.log('Form submitted:', { ...updates });
      await window.api.updateRoom({ id, updates });
      showToast('success', 'Room Updated successfully!');
      navigate('/rooms');
    } catch (error) {
      console.log('Error from add room:', error);
      showToast('error', 'Failed to update room!');
    }
  };
  return (
    <div>
      <PageTitle title={`Edit Room`} />
      <RoomForm prevData={prevData} onSubmit={onSubmit}></RoomForm>
    </div>
  );
};

export default EditRoom;

/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Common/Loading';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import PosMachineFrom from './components/PosMachineFrom';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function EditPosMachine({ setIsModalOpen, id }) {
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch previous data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const PosMachine = await window.api.getPosMachine(id); // Fetch data by ID
        setPrevData(PosMachine);
      } catch (error) {
        console.error('Error fetching Pos Machine data:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Submit function for the form
  const onSubmit = async ({ ...updates }) => {
    try {
      await window.api.updatePosMachine({ id, updates });
      navigate(0);
      showToast('success', 'Pos Machine update successfully!');
    } catch (error) {
      console.log('Error from update Pos Machine:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Edit Pos Machine">
      {!isLoading ? (
        <div className="mt-2 px-2 rounded-lg">
          <PosMachineFrom
            onSubmit={onSubmit}
            prevData={prevData}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      ) : (
        <Loading />
      )}
    </ModalContent>
  );
}

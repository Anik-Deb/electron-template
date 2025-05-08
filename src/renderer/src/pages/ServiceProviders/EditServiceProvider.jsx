/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Common/Loading';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import ServiceProviderForm from './components/ServiceProviderForm';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function EditServiceProvider({ setIsModalOpen, id }) {
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch previous data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = await window.api.getServiceProvider(id); // Fetch data by ID
        setPrevData(provider);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Submit function for the form
  const onSubmit = async ({ ...updates }) => {
    try {
      console.log('Form submitted:', { ...updates });
      await window.api.updateServiceProvider({ id, updates });
      navigate(0);
      showToast('success', 'providers update successfully!');
    } catch (error) {
      console.log('Error from update providers:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Edit providers">
      {!isLoading ? (
        <div className="mt-2 px-2 rounded-lg">
          <ServiceProviderForm
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

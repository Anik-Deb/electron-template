/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Common/Loading';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import ServicesFrom from './components/ServicesFrom';

export default function EditServices({ setIsModalOpen, id }) {
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch previous data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const service = await window.api.getService(id); // Fetch data by ID
        // console.log(service)
        setPrevData(service);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Submit function for the form
  const onSubmit = async ({ service_provider_name, ...updates }) => {
    try {
      // console.log("Data", {...updates})
      await window.api.updateService({ id, updates });
      navigate(0);
      showToast('success', 'Room Service update successfully!');
    } catch (error) {
      console.log('Error from update service:', error);
      showToast('error', 'Failed to update service!');
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Edit Service">
      {!isLoading ? (
        <div className="mt-2 px-2 rounded-lg">
          <ServicesFrom
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

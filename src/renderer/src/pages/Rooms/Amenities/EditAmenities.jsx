/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Common/Loading';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { useNavigate } from 'react-router-dom';
import AmenitiesFrom from './components/AmenitiesFrom';
import { showToast } from '@/utils/toastHelper';

export default function EditAmenities({ setIsModalOpen, id }) {
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch previous data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const amenity = await window.api.getAmenity(id); // Fetch data by ID
        setPrevData(amenity);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Submit function for the form
  const onSubmit = async ({ ...updates }) => {
    try {
      await window.api.updateAmenity({ id, updates });
      navigate(0);
      showToast('success', 'Amenity update successfully!');
    } catch (error) {
      console.log('Error from update amenities:', error);
      showToast('error', 'Failed to update amenity!');
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Edit Amenity">
      {!isLoading ? (
        <div className="mt-2 px-2 rounded-lg">
          <AmenitiesFrom
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

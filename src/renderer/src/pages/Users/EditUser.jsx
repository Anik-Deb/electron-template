/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import UserFrom from './components/UserFrom';
import Loading from '@/components/Common/Loading';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserSchema } from './userValidationSchema';

export default function EditUser({ setIsModalOpen, id }) {
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      emergency_contact_phone: '',
      role: 'guest',
      address: '',
      profile_picture_url: '',
    },
    mode: 'onChange',
  });

  // Fetch previous user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await window.api.getUser(id); // Fetch user by ID
        setPrevData(user);
        form.reset(user); // Update form with fetched data
      } catch (error) {
        console.error('Error fetching user:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id, form]); // Runs when ID changes

  // Submit function for the form
  const onSubmit = async ({ confirmPassword, ...updates }) => {
    try {
      await window.api.updateUser({ id, updates });
      showToast('success', 'Updated User successfully!');
      navigate(0);
    } catch (error) {
      // console.log('Error from update user:', error);
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Edit User">
      {!isLoading ? (
        <div className="mt-2 px-2 rounded-lg">
          <UserFrom
            onSubmit={onSubmit}
            prevData={prevData}
            setIsModalOpen={setIsModalOpen}
            form={form}
          />
        </div>
      ) : (
        <Loading />
      )}
    </ModalContent>
  );
}

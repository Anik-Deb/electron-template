/* eslint-disable react/prop-types */
import React from 'react';
import { ModalContent } from '@/components/Common/Modal/ModalContent';
import UserFrom from './components/UserFrom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from './userValidationSchema';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';

export default function AddUser({ setIsModalOpen, setUser }) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      emergency_contact_phone: '',
      password: '',
      confirmPassword: '',
      role: 'guest',
      address: '',
      profile_picture_url: '',
    },
    mode: 'onChange',
  });

  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      const user = await window.api.addUser(data);

      setIsModalOpen(false);
      setUser((prev) => [...prev, user]);
      showToast('success', 'User Added successfully!');
    } catch (error) {
      // console.log('Error submitting form:', error);
      const error_message = errorMessage(error);
      console.log('error message:', error_message);
      showToast('error', error_message);
    } finally {
      form.reset();
    }
  };
  return (
    <ModalContent className="max-w-xl" title="Create New User">
      <div className="mt-2 px-2 rounded-lg">
        <UserFrom
          setUser={setUser}
          setIsModalOpen={setIsModalOpen}
          onSubmit={onSubmit}
          form={form}
        ></UserFrom>
      </div>
    </ModalContent>
  );
}

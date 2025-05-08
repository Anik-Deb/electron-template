/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Loading from '@/components/Common/Loading';
import GuestFrom from './components/GuestForm';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '@/components/Common/PageTitle';
import { showToast } from '@/utils/toastHelper';

export default function EditGuest() {
  const { id } = useParams();
  const [prevData, setPrevData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // get prev data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await window.api.getGuest(id);
        // console.log('Guest UserData', user);
        setPrevData(user);
      } catch (error) {
        console.log('errror from get user:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Submit function for the form
  const onSubmit = async (data) => {
    try {
      // console.log('Form submitted:', { ...data });

      // Update user details
      const updates = {
        first_name: data?.first_name,
        last_name: data?.last_name,
        email: data?.email,
        phone: data?.phone,
        emergency_contact_phone: data?.emergency_contact_phone,
        role: data?.role,
        date_of_birth: data?.date_of_birth,
        address_1: data?.address_1,
        address_2: data?.address_2,
        profile_picture_url: data?.profile_picture_url,
      };
      const resultUser = await window.api.updateUser({
        id: prevData?.user_id,
        updates,
      });

      if (resultUser?.error) {
        return { error: 'User not updated!' };
      }

      // Update guest details
      const updateGuest = {
        user_id: prevData?.user_id, // Keep the same user_id
        passport_or_national_number: data?.passport_or_national_number, // Use new data or fallback to prevData
        nationality: data?.nationality,
        secondary_contact: data?.secondary_contact,
        relation: data?.relation,
        job_title: data?.job_title,
        company_name: data?.company_name,
      };
      await window.api.updateGuest({
        id,
        updates: updateGuest,
      });

      navigate('/guests');
      showToast('success', 'Updated guest successfully!');
    } catch (error) {
      console.log('error from update user:', error);
      showToast('error', 'Failed to update guest!');
    }
  };
  return (
    <div>
      <PageTitle title="Edit Guest" />
      {!isLoading ? (
        <GuestFrom onSubmit={onSubmit} prevData={prevData} />
      ) : (
        <Loading />
      )}
    </div>
  );
}

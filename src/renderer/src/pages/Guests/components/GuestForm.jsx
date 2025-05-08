/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import emptyAvatar from '../../../assets/empty-avatar.png';
import { guestSchema } from '../GuestValidationSchema';
import PersonalInfo from '@/pages/Rooms/ReceptionistRoom/components/BookingForm/PersonalInfo';
import OthersInfo from '@/pages/Rooms/ReceptionistRoom/components/BookingForm/OthersInfo';
import FormActions from '@/pages/Rooms/ReceptionistRoom/components/BookingForm/FormActions';
import inputEmpty from '../../../assets/input-empty.png';
import { useNavigate } from 'react-router-dom';

export default function GuestFrom({ onSubmit, prevData }) {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      first_name: prevData?.first_name || '',
      last_name: prevData?.last_name || '',
      email: prevData?.email || '',
      phone: prevData?.phone || '',
      emergency_contact_phone: prevData?.emergency_contact_phone || '',
      role: prevData?.role || 'guest',
      date_of_birth: prevData?.date_of_birth,
      address_1: prevData?.address_1 || '',
      address_2: prevData?.address_2 || '',
      profile_picture_url: prevData?.profile_picture_url || '',
      passport_or_national_number: prevData?.passport_or_national_number || '',
      nid: prevData?.nid || '',
      nationality: prevData?.nationality || '',
      secondary_contact: prevData?.secondary_contact || '',
      relation: prevData?.relation || '',
      job_title: prevData?.job_title || '',
      company_name: prevData?.company_name || '',
    },
    mode: 'onChange',
  });
  // console.log(form.formState.errors);

  const [profilePreview, setProfilePreview] = useState(
    prevData?.profile_picture_url || emptyAvatar
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        form.setValue('profile_picture_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="shadow-sm rounded max-w-2xl bg-white mt-6">
      {/* Form Stepper */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-5">
          {/* Personal information */}
          <PersonalInfo
            form={form}
            profilePreview={profilePreview}
            inputEmpty={inputEmpty}
            handleImageChange={handleImageChange}
          />
          {/* Others information */}
          <OthersInfo form={form} />
          {/* Form action */}
          <FormActions form={form} navigate={navigate} />
        </form>
      </Form>
    </div>
  );
}

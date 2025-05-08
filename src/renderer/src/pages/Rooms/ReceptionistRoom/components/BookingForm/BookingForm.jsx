/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import { DatePickerWithRange } from '@/components/Common/DatePickerWithRange/DatePickerWithRange';
import { Form } from '@/components/ui/form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import inputEmpty from '../../../../../assets/input-empty.png';
import FormActions from './FormActions';
import OthersInfo from './OthersInfo';
import PersonalInfo from './PersonalInfo';
import SearchUser from './SearchUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from './BookingValidationSchema.jsx';

export default function BookingForm({
  date,
  setDate,
  guests,
  isLoading,
  onSubmit,
  profilePreview,
  setProfilePreview,
  prevData,
  searchedGuest,
  setSearchedGuest,
}) {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [searchingNumber, setSearchingNumber] = React.useState('');

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      first_name: prevData?.first_name || '',
      last_name: prevData?.last_name || '',
      email: prevData?.email || '',
      profile_picture_url: prevData?.profile_picture_url || '',
      date_of_birth: prevData?.date_of_birth || '',
      phone: prevData?.phone || '',
      emergency_contact_phone: prevData?.emergency_contact_phone || '',
      passport_or_national_number: prevData?.passport_or_national_number || '',
      nationality: prevData?.nationality || '',
      address_1: prevData?.address_1 || '',
      address_2: prevData?.address_2 || '',
      role: prevData?.role || 'guest',
      secondary_contact: prevData?.secondary_contact || '',
      relation: prevData?.relation || '',
      job_title: prevData?.job_title || '',
      company_name: prevData?.company_name || '',
    },
    mode: 'onChange',
  });

  // handle image change
  const handleImageChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        form.setValue('profile_picture_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle User Search
  const handleSearch = () => {
    // console.log('clicked:');
    const guest = guests.find((guest) => guest.phone === searchingNumber);
    if (!guest) {
      setSearchedGuest(null);
    } else {
      setSearchedGuest(guest);
    }
  };
  /* Handle search visitor */
  const handleGuest = () => {
    console.log('searched guest:', searchedGuest);
    if (searchedGuest) {
      form.setValue('first_name', searchedGuest?.first_name);
      form.setValue('last_name', searchedGuest?.last_name);
      form.setValue('email', searchedGuest?.email);
      setProfilePreview(searchedGuest?.profile_picture_url | '');
      form.setValue('date_of_birth', searchedGuest?.date_of_birth || '');
      form.setValue('phone', searchedGuest?.phone);
      form.setValue(
        'emergency_contact_phone',
        searchedGuest?.emergency_contact_phone || ''
      );
      form.setValue(
        'passport_or_national_number',
        searchedGuest?.passport_or_national_number || ''
      );
      form.setValue('nationality', searchedGuest?.nationality || '');
      form.setValue('address_1', searchedGuest?.address_1 || '');
      form.setValue('address_2', searchedGuest?.address_2 || '');
      form.setValue('job_title', searchedGuest?.job_title || '');
      form.setValue('company_name', searchedGuest?.company_name || '');
      form.setValue(
        'secondary_contact',
        searchedGuest?.secondary_contact || ''
      );
      form.setValue('relation', searchedGuest?.relation || '');
    } else {
      form.setValue('first_name', '');
      form.setValue('last_name', '');
      form.setValue('email', '');
      setProfilePreview('');
      form.setValue('profile_picture_url', '');
      form.setValue('date_of_birth', '');
      form.setValue('phone', '');
      form.setValue('emergency_contact_phone', '');
      form.setValue('passport_or_national_number', '');
      form.setValue('nationality', '');
      form.setValue('address_1', '');
      form.setValue('address_2', '');
      form.setValue('job_title', '');
      form.setValue('company_name', '');
      form.setValue('secondary_contact', '');
      form.setValue('relation', '');
    }
    setPopoverOpen((prev) => !prev);
  };

  return (
    <div className="shadow-sm rounded max-w-2xl bg-white">
      {/* Search User */}
      <SearchUser
        searchedGuest={searchedGuest}
        isLoading={isLoading}
        handleSearch={handleSearch}
        setSearchingNumber={setSearchingNumber}
        setPopoverOpen={setPopoverOpen}
        handleGuest={handleGuest}
      />

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-5 space-y-5">
          <CommonFormField form={form} label="Booking Date" name="check_in">
            {(field) => (
              <DatePickerWithRange
                date={date}
                setDate={setDate}
                buttonClassName="w-auto h-9 border border-input"
                buttonVariant="transparent"
                popoverOpen={popoverOpen}
                setPopoverOpen={setPopoverOpen}
              />
            )}
          </CommonFormField>

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

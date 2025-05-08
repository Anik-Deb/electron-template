/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import PersonalDetails from '@/pages/Rooms/ReceptionistRoom/components/PersonalDetails';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import emptyAvatar from '../../../assets/empty-avatar.png';
import IdentityDetails from '@/pages/Rooms/ReceptionistRoom/components/IdentityDetails';
import EmploymentDetails from '@/pages/Rooms/ReceptionistRoom/components/EmploymentDetails';
import { StepperButton } from '@/pages/Employees/components/StepperButton';
import { guestSchema } from '../GuestValidationSchema';

export default function GuestFrom({ onSubmit, prevData }) {
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

  const [currentStep, setCurrentStep] = React.useState(1);

  const handleNext = async () => {
    let stepFields;

    // Define fields to validate based on the current step
    switch (currentStep) {
      case 1:
        stepFields = [
          'first_name',
          'last_name',
          'email',
          'phone',
          'secondary_contact',
        ];
        break;
      default:
        stepFields = [];
    }

    // Trigger validation for the current step's fields
    const isStepValid = await form.trigger(stepFields);

    // If the current step is valid, proceed to the next step
    if (isStepValid && currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  // Function to go to the previous step
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div>
      {/* Form Stepper */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 mt-4 bg-white shadow-sm rounded border p-4 max-w-2xl"
        >
          {/* Step: 1 user personal information */}
          {currentStep === 1 && (
            <PersonalDetails
              form={form}
              profilePreview={profilePreview}
              handleImageChange={handleImageChange}
              prevData={prevData}
            />
          )}
          {/* Step: 2 user indentification */}
          {currentStep === 2 && (
            <>
              <IdentityDetails form={form} prevData={prevData} />
              <div className="border-b pb-2"></div>
              <EmploymentDetails form={form} prevData={prevData} />
            </>
          )}
          <StepperButton
            form={form}
            currentStep={currentStep}
            totalSteps={2}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            onSubmit={onSubmit}
            cancelURL="/guests"
          />
        </form>
      </Form>
    </div>
  );
}

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import AdditionInfoForm from './AdditionInfoForm';
import GeneralInfoForm from './GeneralInfoForm';
import Certifications from './Certifications';
import FormSteper from './FormSteper';
import { StepperButton } from './StepperButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../Employee/employeeSchema';
// import { useNavigate } from 'react-router-dom';

const EmployeeForm = ({ onSubmit, prevData, cancelURL }) => {
  // const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: prevData?.first_name || '',
      last_name: prevData?.last_name || '',
      email: prevData?.email || '',
      phone: prevData?.phone || '',
      emergency_contact_phone: prevData?.emergency_contact_phone || '',
      role: prevData?.role || '',
      date_of_birth: prevData?.date_of_birth,
      address_1: prevData?.address_1 || '',
      address_2: prevData?.address_2 || '',
      profile_picture_url: prevData?.profile_picture_url || '',
      department: prevData?.department || '',
      position: prevData?.position || '',
      salary: prevData?.salary || '',
      hire_date: prevData?.hire_date,
      termination_date: prevData?.termination_date,
      nid: prevData?.nid || '',
      certifications: prevData?.certifications || [''],
    },
    mode: 'onChange',
  });
  // console.log(form.formState.errors);

  const [imageGalleries, setImageGalleries] = React.useState(
    prevData?.certifications || ['']
  );
  const [currentStep, setCurrentStep] = useState(1);

  // Function to go to the next step
  // const handleNext = () => {
  //   if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  // };
  const handleNext = async () => {
    let stepFields;

    // Define fields to validate based on the current step
    switch (currentStep) {
      case 1:
        stepFields = ['first_name', 'last_name', 'email', 'phone', 'role'];
        break;
      case 2:
        stepFields = ['department', 'position', 'salary', 'hire_date'];
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
  // console.log('error:', form.formState?.errors);
  return (
    <div className="mt-8">
      {/* Stepper */}
      <FormSteper currentStep={currentStep} totalSteps={3} />
      {/* Form Sections */}
      <div className="shadow-sm rounded border max-w-2xl bg-white">
        <Form {...form}>
          <div className="">
            {/* Step 1: General Info */}
            {currentStep === 1 && (
              <section>
                <GeneralInfoForm
                  form={form}
                  onSubmit={onSubmit}
                  prevData={prevData}
                />
              </section>
            )}

            {/* Step 2: Additional Info */}
            {currentStep === 2 && (
              <section>
                <AdditionInfoForm
                  form={form}
                  onSubmit={onSubmit}
                  prevData={prevData}
                />
              </section>
            )}

            {/* Step 3: Certifications */}
            {currentStep === 3 && (
              <section>
                <Certifications
                  imageGalleries={imageGalleries}
                  setImageGalleries={setImageGalleries}
                  form={form}
                  onSubmit={onSubmit}
                  prevData={prevData}
                />
              </section>
            )}
          </div>
          {/* Navigation Buttons */}
          <StepperButton
            form={form}
            currentStep={currentStep}
            totalSteps={3}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            onSubmit={onSubmit}
            cancelURL={cancelURL}
            cancelButton={
              <p className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70">
                Cancel
              </p>
            }
          />
        </Form>
      </div>
    </div>
  );
};

export default EmployeeForm;

/* eslint-disable react/prop-types */
import React from 'react';
import { Form } from '@/components/ui/form';
import AdditionInfoForm from './AdditionInfoForm';
import inputEmpty from '../../../assets/input-empty.png';
import Certifications from './Certifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../Employee/employeeSchema';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import GeneralInfoForm from './GeneralInfoForm';
// import { useNavigate } from 'react-router-dom';

const EmployeeForm = ({ onSubmit, prevData, cancelURL }) => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      first_name: prevData?.first_name || '',
      last_name: prevData?.last_name || '',
      email: prevData?.email || '',
      phone: prevData?.phone || '',
      emergency_contact_phone: prevData?.emergency_contact_phone || '',
      role: prevData?.role,
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

  const [profilePreview, setProfilePreview] = React.useState(
    prevData?.profile_picture_url || inputEmpty
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

  const [imageGalleries, setImageGalleries] = React.useState(
    prevData?.certifications || ['']
  );

  // console.log('error:', form.formState?.errors);
  return (
    <div className="mt-8">
      {/* Form Sections */}
      <div className="shadow-sm rounded border max-w-2xl bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4">
              <GeneralInfoForm
                form={form}
                profilePreview={profilePreview}
                inputEmpty={inputEmpty}
                handleImageChange={handleImageChange}
              />
            </div>
            <Certifications
              imageGalleries={imageGalleries}
              setImageGalleries={setImageGalleries}
              form={form}
              onSubmit={onSubmit}
              prevData={prevData}
            />
            <AdditionInfoForm
              form={form}
              onSubmit={onSubmit}
              prevData={prevData}
            />

            <div className="flex justify-end gap-2 pb-4 pr-4">
              <div
                onClick={() => {
                  form.reset();
                  navigate(cancelURL); // Close the modal
                }}
                className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
              >
                Cancel
              </div>
              <Button type="submit" className="text-white">
                {form.formState.isSubmitting && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeForm;

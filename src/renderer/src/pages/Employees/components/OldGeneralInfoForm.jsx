/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emptyAvatar from '../../../assets/empty-avatar.png';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import CommonFormField from '@/components/Common/CommonFormField';
import DatePicker from '@/components/Common/DatePicker/DatePicker';
import UploadImage from '@/components/Common/UploadImage/UploadIImage';
import inputEmpty from '../../../assets/input-empty.png';

const GeneralInfoForm = ({ form, onSubmit, prevData }) => {
  const [profilePreview, setProfilePreview] = useState(emptyAvatar);

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

  React.useEffect(() => {
    if (prevData) {
      // Set profilePreview if prevData.profile_picture_url exists
      if (prevData.profile_picture_url) {
        setProfilePreview(prevData.profile_picture_url);
      } else {
        setProfilePreview(emptyAvatar);
      }
    }
  }, [prevData]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl p-4"
      >
        <h1 className="capitalize font-semibold border-b pb-2">
          General Information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CommonFormField form={form} label="First Name" name="first_name">
            {(field) => <Input placeholder="Enter first name" {...field} />}
          </CommonFormField>

          <CommonFormField form={form} label="Last Name" name="last_name">
            {(field) => <Input placeholder="Enter last name" {...field} />}
          </CommonFormField>
        </div>
        <CommonFormField form={form} label="Email" name="email">
          {(field) => <Input placeholder="Enter your email" {...field} />}
        </CommonFormField>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CommonFormField form={form} label="Phone Number" name="phone">
            {(field) => <Input placeholder="Enter phone number" {...field} />}
          </CommonFormField>

          <CommonFormField
            form={form}
            label="Emergency Contact Phone"
            name="emergency_contact_phone"
          >
            {(field) => (
              <Input placeholder="Enter emergency contact phone" {...field} />
            )}
          </CommonFormField>
        </div>
        <div className="flex gap-6 items-center">
          <CommonFormField
            form={form}
            className="flex-1"
            label="Date of Birth"
            name="date_of_birth"
          >
            {(field) => (
              <DatePicker
                className="w-full"
                placeholder="Select date of birth"
                field={field}
                form={form}
              />
            )}
          </CommonFormField>
        </div>

        <CommonFormField form={form} label="Address 1" name="address_1">
          {(field) => <Input placeholder="Enter your address 1" {...field} />}
        </CommonFormField>
        <CommonFormField form={form} label="Address 2" name="address_2">
          {(field) => <Input placeholder="Enter your address 2" {...field} />}
        </CommonFormField>

        <div className="group mt-4">
          <div className="flex items-center gap-8 md:gap-12">
            <div className="w-24 h-24">
              {profilePreview ? (
                <img
                  className="rounded-full h-full w-full"
                  src={profilePreview}
                  alt="profile image"
                />
              ) : (
                <img
                  className="rounded-full h-full w-full"
                  src={emptyAvatar}
                  alt="profile image"
                />
              )}
            </div>
            <div>
              <CommonFormField
                form={form}
                label="Select a file to upload"
                name="profile_picture_url"
              >
                {(field) => (
                  <div className="bg-primary hover:bg-primary-600 relative flex justify-center items-center py-[6px] text-white rounded-full">
                    <TransparentInput
                      type="file"
                      className="h-full w-full absolute top-0 left-0 z-30 opacity-0"
                      placeholder="Profile_picture_url"
                      onChange={handleImageChange}
                    />
                    <Label className="text-xs flex items-center gap-1">
                      Choose an image
                      <ChevronDown className="size-3 stroke-white" />
                    </Label>
                  </div>
                )}
              </CommonFormField>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default GeneralInfoForm;

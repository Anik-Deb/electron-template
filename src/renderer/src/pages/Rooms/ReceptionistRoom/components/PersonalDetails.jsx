/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import DatePicker from '@/components/Common/DatePicker/DatePicker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import emptyAvatar from '../../../../assets/empty-avatar.png';

const PersonalDetails = ({ form, profilePreview, handleImageChange }) => {
  return (
    <>
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CommonFormField form={form} label="First Name*" name="first_name">
          {(field) => <Input placeholder="Enter First Name" {...field} />}
        </CommonFormField>
        <CommonFormField form={form} label="Last Name*" name="last_name">
          {(field) => <Input placeholder="Enter Last Name" {...field} />}
        </CommonFormField>
      </div>
      {/* Email */}
      <CommonFormField form={form} label="Email*" name="email" type="email">
        {(field) => <Input placeholder="Enter Email" {...field} />}
      </CommonFormField>
      {/* Phone */}
      <div className="flex items-center gap-4">
        <CommonFormField form={form} label="Phone*" name="phone">
          {(field) => <Input placeholder="Enter Phone" {...field} />}
        </CommonFormField>
        <CommonFormField
          form={form}
          label="Emergency Contact Phone"
          name="emergency_contact_phone"
        >
          {(field) => (
            <Input placeholder="Enter Emergency Contact Phone" {...field} />
          )}
        </CommonFormField>
      </div>
      <CommonFormField form={form} label="Date Of Birth" name="date_of_birth">
        {(field) => (
          <DatePicker placeholder="Birth Day" field={field} form={form} />
        )}
      </CommonFormField>
      {/* Address */}
      <CommonFormField form={form} label="Address 1" name="address_1">
        {(field) => <Input placeholder="Enter Address 1" {...field} />}
      </CommonFormField>
      <CommonFormField form={form} label="Address 2" name="address_2">
        {(field) => <Input placeholder="Enter Address 2" {...field} />}
      </CommonFormField>
      <div className="grid grid-cols-2 gap-4">
        {/* Secondary Address */}
        <CommonFormField
          form={form}
          label="Secondary Contact*"
          name="secondary_contact"
        >
          {(field) => (
            <Input placeholder="Enter Secondary Contact" {...field} />
          )}
        </CommonFormField>
        {/* relation */}
        <CommonFormField form={form} label="Relation" name="relation">
          {(field) => <Input placeholder="Enter relation" {...field} />}
        </CommonFormField>
      </div>
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
                  <Input
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
    </>
  );
};

export default PersonalDetails;

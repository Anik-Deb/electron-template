/* eslint-disable react/prop-types */
import { NationalityComboBox } from '@/components/Common/ComboBox/NationalityComboBox';
import CommonFormField from '@/components/Common/CommonFormField';
import DatePicker from '@/components/Common/DatePicker/DatePicker';
import UploadImage from '@/components/Common/UploadImage/UploadIImage';
import { Input } from '@/components/ui/input';
import { countryList } from '@/utils/countryList';
import React from 'react';

export default function PersonalInfo({
  form,
  profilePreview,
  inputEmpty,
  handleImageChange,
}) {
  return (
    <div>
      <h1 className="text-lg font-semibold text-primary-600 mb-2">
        Personal Info
      </h1>
      <div className="space-y-3">
        <div className="flex gap-4">
          <CommonFormField form={form} label="First Name*" name="first_name">
            {(field) => <Input placeholder="Enter First Name" {...field} />}
          </CommonFormField>
          <CommonFormField form={form} label="Last Name*" name="last_name">
            {(field) => <Input placeholder="Enter Last Name" {...field} />}
          </CommonFormField>
        </div>
        <CommonFormField form={form} label="Email*" name="email">
          {(field) => <Input placeholder="Enter Email" {...field} />}
        </CommonFormField>
        <div className="flex gap-4">
          <CommonFormField form={form} label="Phone*" name="phone">
            {(field) => (
              <Input
                placeholder="Enter phone number"
                type="number"
                {...field}
              />
            )}
          </CommonFormField>
          <CommonFormField
            form={form}
            label="Secondary Number"
            name="emergency_contact_phone"
          >
            {(field) => (
              <Input
                placeholder="Enter Secondary Number"
                type="number"
                {...field}
              />
            )}
          </CommonFormField>
        </div>
        <NationalityComboBox List={countryList} form={form} />
        <CommonFormField
          form={form}
          label="Passport/ National ID Number*"
          name="passport_or_national_number"
        >
          {(field) => <Input placeholder="Enter Passport Number" {...field} />}
        </CommonFormField>
        <CommonFormField form={form} label="Date Of Birth" name="date_of_birth">
          {(field) => (
            <DatePicker placeholder="Select Date" field={field} form={form} />
          )}
        </CommonFormField>
        <CommonFormField form={form} label="Address 1" name="address_1">
          {(field) => <Input placeholder="Enter Address 1" {...field} />}
        </CommonFormField>
        <CommonFormField form={form} label="Address 2" name="address_2">
          {(field) => <Input placeholder="Enter Address 2" {...field} />}
        </CommonFormField>
      </div>

      {/* Upload Image*/}
      <UploadImage
        preview={profilePreview}
        empty={inputEmpty}
        handleImageChange={handleImageChange}
      />
    </div>
  );
}

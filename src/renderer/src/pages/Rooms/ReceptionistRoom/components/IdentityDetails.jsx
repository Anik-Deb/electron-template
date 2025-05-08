/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import { Input } from '@/components/ui/input';
import NidAttachment from '@/pages/Employees/components/NidAttachment';
import React from 'react';

const IdentityDetails = ({ form, prevData }) => {
  return (
    <>
      <CommonFormField form={form} label="Passport / National ID number" name="passport_or_national_number">
        {(field) => <Input placeholder="Enter Passport or national ID Number" {...field} />}
      </CommonFormField>

      {/* Nationality */}
      <CommonFormField form={form} label="Nationality" name="nationality">
        {(field) => <Input placeholder="Enter Nationality" {...field} />}
      </CommonFormField>
       {/* <CommonFormField form={form} label="Nationality" name="nationality">
            {(field) => (
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            )}
          </CommonFormField> */}
      {/* Nid Upload */}
      <NidAttachment form={form} prevData={prevData} />
    </>
  );
};

export default IdentityDetails;

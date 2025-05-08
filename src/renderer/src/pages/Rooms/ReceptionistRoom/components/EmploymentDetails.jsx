/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import { Input } from '@/components/ui/input';
import React from 'react';

const EmploymentDetails = ({ form }) => {
  return (
    <>
      <CommonFormField form={form} label="Job Title" name="job_title">
        {(field) => <Input placeholder="Enter Job Title" {...field} />}
      </CommonFormField>
      <CommonFormField form={form} label="Company Name" name="company_name">
        {(field) => <Input placeholder="Enter Company Name" {...field} />}
      </CommonFormField>
    </>
  );
};

export default EmploymentDetails;

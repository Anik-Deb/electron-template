import CommonFormField from '@/components/Common/CommonFormField';
import { Input } from '@/components/ui/input';
import React from 'react';

export default function OthersInfo({ form }) {
  return (
    <div>
      <h1 className="text-lg font-semibold text-primary-600 mb-2">
        Others Info
      </h1>

      <div className="space-y-3">
        <div className="flex gap-4">
          <CommonFormField
            form={form}
            label="Emergency Contact Number*"
            name="secondary_contact"
          >
            {(field) => (
              <Input
                placeholder="Enter Secondary Contact"
                type="number"
                {...field}
              />
            )}
          </CommonFormField>
          <CommonFormField
            form={form}
            label="Emergency Contact Relationship"
            name="relation"
          >
            {(field) => (
              <Input
                placeholder="Enter Relationship (e.g., Parent, Spouse)"
                {...field}
              />
            )}
          </CommonFormField>
        </div>
        <div className="flex gap-4">
          <CommonFormField form={form} label="Job Title" name="job_title">
            {(field) => <Input placeholder="Enter Job Title" {...field} />}
          </CommonFormField>
          <CommonFormField form={form} label="Company Name" name="company_name">
            {(field) => <Input placeholder="Enter Company Name" {...field} />}
          </CommonFormField>
        </div>
      </div>
    </div>
  );
}

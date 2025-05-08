/* eslint-disable react/prop-types */
import React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CommonFormField from '@/components/Common/CommonFormField';
import DatePicker from '@/components/Common/DatePicker/DatePicker';

const AdditionInfoForm = ({ form }) => {
  return (
    <>
      <div className="max-w-2xl p-4 mt-2 space-y-3">
        <h1 className="text-lg font-semibold text-primary-600 mb-2">
          Company Info
        </h1>

        <CommonFormField form={form} label="Department" name="department">
          {(field) => (
            <Select
              value={field.value || ''}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="housekeeper">Housekeeper</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CommonFormField>
        <div className="flex flex-row gap-4 items-center">
          <CommonFormField form={form} label="Position" name="position">
            {(field) => (
              <Select
                value={field.value || ''}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                </SelectContent>
              </Select>
            )}
          </CommonFormField>
          <CommonFormField form={form} label="Salary" name="salary">
            {(field) => <Input placeholder="Enter salary" {...field} />}
          </CommonFormField>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <CommonFormField form={form} label="Hire Date" name="hire_date">
            {(field) => (
              <DatePicker
                className="w-full"
                placeholder="Select hire_date"
                field={field}
                form={form}
              />
            )}
          </CommonFormField>

          <CommonFormField
            form={form}
            label="Termination Date"
            name="termination_date"
          >
            {(field) => (
              <DatePicker
                className="w-full"
                placeholder="Select termination_date"
                field={field}
                form={form}
              />
            )}
          </CommonFormField>
        </div>
      </div>
    </>
  );
};

export default AdditionInfoForm;

/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import Description from '@/components/ui/Description/Description';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { roomSchema } from '../RoomValidationSchema';

const RoomForm = ({ onSubmit, prevData }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: prevData?.room_number || '',
      type_name: prevData?.type_name || 'standard',
      description: prevData?.description ?? '',
      status: prevData?.status || 'available',
      base_price: prevData?.base_price || '',
      capacity: prevData?.capacity ? parseInt(prevData.capacity) : '',
    },
  });

  return (
    <div className="mt-8 max-w-5xl">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-3 gap-4">
            {/*-------------- room info form--------------------*/}
            <div className="col-span-2 shadow-sm rounded border max-w-full p-4 bg-white">
              <h1 className="capitalize font-semibold border-b pb-2 mb-4">
                Room Information
              </h1>
              <div className="space-y-4">
                <CommonFormField
                  form={form}
                  label="Room Number*"
                  name="room_number"
                >
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Room Number"
                      {...field}
                    />
                  )}
                </CommonFormField>

                <CommonFormField
                  form={form}
                  label="Base Price*"
                  name="base_price"
                >
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Base Price"
                      {...field}
                    />
                  )}
                </CommonFormField>

                <CommonFormField form={form} label="Capacity*" name="capacity">
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Capacity"
                      {...field}
                      value={field.value ? field.value : ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value)
                          : '';
                        field.onChange(value);
                      }}
                    />
                  )}
                </CommonFormField>
                <CommonFormField
                  form={form}
                  label="Description"
                  name="description"
                >
                  {(field) => (
                    <Description
                      height={80}
                      placeholder="Enter Description"
                      field={field}
                    />
                  )}
                </CommonFormField>
              </div>
            </div>
          </div>
          {/* Submit form and cancel button */}
          <div className="flex gap-2 items-center justify-end mt-4">
            <div
              onClick={() => {
                form.reset();
                navigate('/rooms');
              }}
              className="py-1 px-4 leading-8 font-semibold rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
            >
              Cancel
            </div>
            <Button type="submit" className="text-white" disabled={isModalOpen}>
              {form.formState.isSubmitting && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoomForm;

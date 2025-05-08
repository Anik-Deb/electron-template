/* eslint-disable react/prop-types */
import React from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import Description from '@/components/ui/Description/Description';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { amenitySchema } from '../../RoomValidationSchema';

export default function AmenitiesFrom({ setIsModalOpen, onSubmit, prevData }) {
  const form = useForm({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      amenity_name: prevData?.amenity_name || '',
      description: prevData?.description || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <CommonFormField form={form} label="Amenity Name*" name="amenity_name">
          {(field) => <Input placeholder="Enter amenity name" {...field} />}
        </CommonFormField>
        <CommonFormField form={form} label="Description" name="description">
          {(field) => (
            <Description
              height={80}
              placeholder="Enter Description"
              field={field}
            />
          )}
        </CommonFormField>

        {/* Submit form and cancel modal button */}
        <div className="flex gap-2 items-center justify-end">
          <div
            onClick={() => {
              form.reset();
              setIsModalOpen(false); // Close the modal
            }}
            className="px-4 py-1 leading-8 font-semibold rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
          >
            Cancel
          </div>
          <Button type="submit" className="text-white">
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

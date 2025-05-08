/* eslint-disable react/prop-types */
import React from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { posMachineSchema } from '../PosValidationSchema';

export default function PosMachineFrom({ setIsModalOpen, onSubmit, prevData }) {
  const form = useForm({
    resolver: zodResolver(posMachineSchema),
    defaultValues: {
      name: prevData?.name || '',
      location: prevData?.location || '',
      is_active: prevData?.is_active !== undefined ? prevData.is_active : true, // Preserve existing value
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Service Name */}
        <CommonFormField form={form} label="Name*" name="name">
          {(field) => <Input placeholder="Enter name" {...field} />}
        </CommonFormField>

        {/* Location */}
        <CommonFormField form={form} label="Location" name="location">
          {(field) => <Textarea placeholder="Enter location" {...field} />}
        </CommonFormField>
        <p className='text-xs font-thin text-gray-400 mt-0'>Location must be where the POS machine is installed</p>

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

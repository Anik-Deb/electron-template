/* eslint-disable react/prop-types */
import React from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { providerSchema } from '../providersValidationSchema';

export default function ServiceProviderForm({
  setIsModalOpen,
  onSubmit,
  prevData,
}) {
  const form = useForm({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      service_provider_name: prevData?.service_provider_name || '',
      contact_person: prevData?.contact_person || '',
      contact_phone: prevData?.contact_phone || '',
      contact_email: prevData?.contact_email || '',
      address: prevData?.address || '',
      current_balance: prevData?.current_balance || '',
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <CommonFormField
          form={form}
          label="Provider Name*"
          name="service_provider_name"
        >
          {(field) => (
            <Input placeholder="Enter service provider name" {...field} />
          )}
        </CommonFormField>

        <CommonFormField form={form} label="Person Name" name="contact_person">
          {(field) => (
            <Input placeholder="Enter contact person name" {...field} />
          )}
        </CommonFormField>

        <CommonFormField form={form} label="Phone" name="contact_phone">
          {(field) => (
            <Input placeholder="Enter contact phone number" {...field} />
          )}
        </CommonFormField>

        <CommonFormField form={form} label="Email" name="contact_email">
          {(field) => <Input placeholder="Enter contact email" {...field} />}
        </CommonFormField>

        <CommonFormField form={form} label="Address" name="address">
          {(field) => <Input placeholder="Enter address" {...field} />}
        </CommonFormField>

        <CommonFormField form={form} label="Due Amount" name="current_balance">
          {(field) => (
            <Input type="number" placeholder="Enter balance" {...field} />
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

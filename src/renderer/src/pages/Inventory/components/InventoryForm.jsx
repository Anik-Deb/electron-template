import React from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const inventoryValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is Required!')
    .max(50, 'Name cannot exceed 50 characters'),
  type: z
    .string()
    .min(1, 'Type is Required!')
    .max(50, 'Type cannot exceed 50 characters'),
  quantity: z.string().min(1, 'Quantity is Required!'),
});

export default function InventoryForm({ onSubmit, prevData, setIsModalOpen }) {
  const form = useForm({
    resolver: zodResolver(inventoryValidationSchema),
    defaultValues: {
      name: prevData?.name || '',
      type: prevData?.type || '',
      quantity: prevData?.quantity.toString() || '',
    },
    mode: 'onChange',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <CommonFormField form={form} label="Name*" name="name">
          {(field) => <Input placeholder="Enter Name" {...field} />}
        </CommonFormField>

        <CommonFormField form={form} label="Type*" name="type">
          {(field) => (
            <Select
              value={field.value || ''}
              onValueChange={(value) => field.onChange(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily Gift">Daily Gift</SelectItem>
                <SelectItem value="Subscription Gift">
                  Subscription Gift
                </SelectItem>
                <SelectItem value="Event Gift">Event Gift</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CommonFormField>

        <CommonFormField form={form} label="Quantity*" name="quantity">
          {(field) => <Input placeholder="Enter item quantity" {...field} />}
        </CommonFormField>

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

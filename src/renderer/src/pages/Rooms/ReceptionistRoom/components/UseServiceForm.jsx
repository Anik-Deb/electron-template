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
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function UseServiceForm({ onSubmit, setOpen, services }) {
  const form = useForm({
    defaultValues: {
      service_name: '',
      service_price: '',
      quantity: 1,
    },
  });

  const handlePriceChange = (service_id, quantity) => {
    const selectedService = services?.find(
      (service) => service?.id === Number(service_id)
    );
    const calculatedPrice =
      Number(selectedService?.price) * Number(quantity || 1) || '';
    form.setValue('service_price', calculatedPrice);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3">
          <CommonFormField form={form} label="Service Name" name="service_name">
            {(field) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const quantity = form.watch('quantity');
                  handlePriceChange(value, quantity);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                {services.length > 0 ? (
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem
                        key={service.id}
                        className="px-2"
                        value={String(service.id)}
                      >
                        {service.service_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                ) : (
                  <p className="text-sm text-gray-500 p-2">No Services</p>
                )}
              </Select>
            )}
          </CommonFormField>
          <CommonFormField form={form} label="Service Quantity" name="quantity">
            {(field) => (
              <Input
                type="number"
                onChange={(e) => {
                  const newQuantity = e.target.value;
                  field.onChange(newQuantity);
                  const selectedServiceId = form.watch('service_name');
                  handlePriceChange(selectedServiceId, newQuantity);
                }}
                placeholder="Enter Service Quantity"
                // {...field}
              />
            )}
          </CommonFormField>
          {/* <Example form={form} /> */}
          <CommonFormField
            form={form}
            label="Service Price"
            name="service_price"
          >
            {(field) => (
              <Input
                // disabled={true}
                className="pointer-events-none cursor-not-allowed"
                placeholder="Enter Service Price"
                {...field}
              />
            )}
          </CommonFormField>
        </div>

        <div className="flex justify-end gap-2">
          <div
            onClick={() => {
              form.reset();
              setOpen(false); // Close the modal
            }}
            className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
          >
            Cancel
          </div>

          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="text-white"
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Add
          </Button>
        </div>
      </form>
    </Form>
  );
}

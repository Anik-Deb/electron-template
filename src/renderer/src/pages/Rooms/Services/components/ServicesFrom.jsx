/* eslint-disable react/prop-types */
import React from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomServiceSchema } from '../../RoomValidationSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Loading from '@/components/Common/Loading';

export default function ServicesForm({ setIsModalOpen, onSubmit, prevData }) {
  const [serviceProviders, setServiceProviders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [serviceProvider, setServiceProvider] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await window.api.getServiceProviders();
        setServiceProviders(res);
        if (prevData?.service_provider_id) {
          const provider = res.find(
            (i) => i.id === prevData.service_provider_id
          );
          setServiceProvider(provider);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [prevData]);

  const form = useForm({
    resolver: zodResolver(roomServiceSchema),
    defaultValues: {
      service_name: prevData?.service_name || '',
      service_provider_id: prevData?.service_provider_id ? String(prevData.service_provider_id) : null,
      service_provider_name: '',
      default_price: prevData?.default_price ?? '',
      provider_rate: prevData?.provider_rate || undefined,
      hotel_rate: prevData?.hotel_rate || undefined,
      is_active: prevData?.is_active !== undefined ? prevData.is_active : true, // Preserve existing value
    },
  });

  const selectedProvider = form.watch('service_provider_id');
  const handleClearSelection = () => {
    form.reset({
      service_provider_id: null,
      provider_rate: '0',
      hotel_rate: '0',
    });
  };

  // const handleServiceProviderChange = (id) => {
  //   const provider = serviceProviders.find((i) => i.id === id);
  //   setServiceProvider(provider);
  // };

  return !isLoading ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Service Name */}
        <CommonFormField form={form} label="Service Name*" name="service_name">
          {(field) => <Input placeholder="Enter service name" {...field} />}
        </CommonFormField>

        {/* Service Provider ID */}
        <CommonFormField
          form={form}
          label="Provider Name"
          name="service_provider_id"
        >
          {({ value, onChange }) => {
            const selectedProviderName = serviceProviders.find(
              (provider) => provider.id === Number(value)
            )?.service_provider_name;

            return (
              <div>
                <Select
                  value={value ? value.toString() : ''} // Handle null value
                  onValueChange={onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        selectedProviderName || 'Select Service Provider'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceProviders.map((provider) => (
                      <SelectItem
                        key={provider.id}
                        value={provider.id.toString()}
                      >
                        {provider.service_provider_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Clear button */}
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="mt-2 text-sm text-gray-500"
                >
                  Clear Selection
                </button>
              </div>
            );
          }}
        </CommonFormField>

        {/* Default Price */}
        <CommonFormField
          form={form}
          label="Default Price*"
          name="default_price"
        >
          {(field) => (
            <Input type="number" placeholder="0" min="0" {...field} />
          )}
        </CommonFormField>

        {/* Conditionally Render Provider Rate */}
        {selectedProvider && (
          <>
            <CommonFormField
              form={form}
              label="Provider Rate"
              name="provider_rate"
            >
              {(field) => (
                <Input type="number" placeholder="0" min="0" {...field} />
              )}
            </CommonFormField>

            <CommonFormField form={form} label="Hotel Rate" name="hotel_rate">
              {(field) => (
                <Input type="number" placeholder="0" min="0" {...field} />
              )}
            </CommonFormField>
          </>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-2 items-center justify-end">
          <div
            onClick={() => {
              form.reset();
              setIsModalOpen(false);
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
  ) : (
    <Loading />
  );
}

import { ModalContent } from '@/components/Common/Modal/ModalContent';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React from 'react';

import { LoaderCircle, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

export default function SMSConfigureForm({ onSubmit, prevData }) {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        senderid: z.string().min(1, 'Sender Id is required!').max(100, 'Sender Id cannot exceed 100 characters'),
        api_key: z.string().min(1, 'Api key is required!').max(50, 'Api Key cannot exceed 50 characters'),
      })
    ),
    defaultValues: {
      senderid: prevData?.senderid || '',
      api_key: prevData?.api_key || '',
    },
  });
  const {
    handleSubmit,
    formState: { errors },
  } = form;
  return (
    <ModalContent title="Create SMS Configure">
      <Form {...form}>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data);
            form.reset();
          })}
          className="space-y-3"
        >
          <FormField
            control={form.control}
            name="senderid"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <FormLabel className={`text-muted text-[13px] py-0`}>
                    Sender Id<span className="text-red-500 pl-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      placeholder="Enter Sender id"
                      className={`${errors.senderid && 'border-destructive-600'}`}
                      {...field}
                    />
                  </FormControl>
                  {errors.senderid ? (
                    <div className="flex items-center">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  ) : (
                    <div className="flex gap-0.5 items-center">
                      <span className="text-xs text-gray-600">
                        Please make sure the given information is correct
                      </span>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="api_key"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-1">
                  <FormLabel className={`text-muted text-[13px] py-0`}>
                    Api Key<span className="text-red-500 pl-0.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      placeholder="Enter API Key"
                      type="password"
                      className={`${errors.api_key && 'border-destructive-600'}`}
                      {...field}
                    />
                  </FormControl>
                  {errors.api_key ? (
                    <div className="flex items-center">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  ) : (
                    <div className="flex gap-0.5 items-center">
                      <span className="text-xs text-gray-600">
                        Please make sure the given information is correct
                      </span>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="mt-2 h-9 px-4 py-[6px] text-sm hover:bg-primary-600">
              {form.formState.isSubmitting && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </ModalContent>
  );
}

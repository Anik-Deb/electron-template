import { useForm } from 'react-hook-form';
import React from 'react'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'; // You may not need this import if not used
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { TriangleAlert } from 'lucide-react';
import { z } from 'zod';
// import { verifySMTPAccount } from 'src/main/db/services/ValidateSmtpService'

export const emailInfoSchema = z.object({
  email: z.string().min(1, 'Email address is required'),
  appPassword: z.string().min(1, 'App password is required'),
});

export default function ServerConfigurationView({ setIsEdit, prevValue }) {
  const form = useForm({
    // resolver: zodResolver(emailInfoSchema),
    defaultValues: {
      user: prevValue?.user || '',
      host: prevValue?.host || '',
      database: prevValue?.database || '',
      password: prevValue?.password || '',
      port: prevValue?.port || '',
    },
  });
  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    try {
      // console.log('Email configuration data:', data);
    } catch (error) {
      // console.log('error from the email configuration:', error);
    }
  };

  return (
    <div className="max-w-[400px]">
      <div className="border border-gray-200 p-5 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-600 text-[13px]">
                    User
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      className={`${errors.user && 'border-destructive-600'} bg-gray-50 border-gray-200 pointer-events-none cursor-not-allowed`}
                      placeholder="Enter user name"
                      type="user"
                      {...field}
                    />
                  </FormControl>
                  {errors.user && (
                    <div className="flex items-center mt-1">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-600 text-[13px]">
                    Host
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      className={`${errors.user && 'border-destructive-600'} bg-gray-50 border-gray-200 pointer-events-none cursor-not-allowed`}
                      placeholder="Enter host"
                      // Added type for password input
                      {...field}
                    />
                  </FormControl>
                  {errors.host && (
                    <div className="flex items-center mt-1">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-600 text-[13px]">
                    Database Name
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      className={`${errors.user && 'border-destructive-600'} bg-gray-50 border-gray-200 pointer-events-none cursor-not-allowed`}
                      placeholder="Enter database name "
                      // Added type for password input
                      {...field}
                    />
                  </FormControl>
                  {errors.database && (
                    <div className="flex items-center mt-1">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-600 text-[13px]">
                    Database Password
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      className={`${errors.user && 'border-destructive-600'} bg-gray-50 border-gray-200 pointer-events-none cursor-not-allowed`}
                      placeholder="Enter Password"
                      // Added type for password input
                      {...field}
                    />
                  </FormControl>
                  {errors.password && (
                    <div className="flex items-center mt-1">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-600 text-[13px]">
                    Port
                  </FormLabel>
                  <FormControl>
                    <TransparentInput
                      className={`${errors.user && 'border-destructive-600'} bg-gray-50 border-gray-200 pointer-events-none cursor-not-allowed`}
                      placeholder="Enter Port"
                      // Added type for password input
                      {...field}
                    />
                  </FormControl>
                  {errors.port && (
                    <div className="flex items-center mt-1">
                      <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                      <FormMessage className="text-xs font-normal" />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="flex justify-end">
        <div
          onClick={() => setIsEdit(true)}
          className="mt-4 h-9 flex items-center px-4 text-sm leading-8 font-normal rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70 bg-white"
        >
          Edit
        </div>
      </div>
    </div>
  );
}

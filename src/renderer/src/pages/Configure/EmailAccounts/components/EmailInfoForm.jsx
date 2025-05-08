import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // You may not need this import if not used
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { z } from 'zod';
import { TriangleAlert } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/utils/toastHelper';
import { errorMessage } from '@/components/Common/Errors_Messages/Error_Messages';
// import { verifySMTPAccount } from 'src/main/db/services/ValidateSmtpService'

export const emailInfoSchema = z.object({
  email: z.string().min(1, 'Email address is required'),
  appPassword: z.string().min(1, 'App password is required'),
});

export default function EmailInfoForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(emailInfoSchema),
    defaultValues: {
      email: '',
      appPassword: '',
    },
  });
  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    try {
      // console.log('adding..')
      const domain = data.email.split('@')[1];

      const smtp_server = 587; // Use number for port
      const smtp_post = `smtp.${domain}`;
      const imap_host = `imap.${domain}`;
      const imap_server = 993; // Use number for port

      const formData = {
        smtp_user_email: data.email,
        imap_user_email: data.email,
        smtp_password: data.appPassword,
        imap_password: data.appPassword,
        smtp_server,
        smtp_post,
        imap_host,
        imap_server,
      };

      const res = await window.api.addEmailConfiguration(formData);
      console.log('result:', res);
      toast({
        variant: 'default',
        description: 'Email account added successfully!',
      });
      // console.log('added!')
      navigate('/email-accounts');
      showToast('success', 'Email Account added successfully!');
    } catch (error) {
      // console.log('failed!')
      const error_message = errorMessage(error);
      showToast('error', error_message);
    }
  };

  return (
    <div className="mt-4 max-w-[400px] bg-white">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-600">
                  Email Address <span className="text-red-500 pl-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <TransparentInput
                    className={`${errors.email && 'border-destructive-600'}`}
                    placeholder="Enter email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                {errors.email && (
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
            name="appPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-gray-600">
                  App Password <span className="text-red-500 pl-0.5">*</span>
                </FormLabel>
                <FormControl>
                  <TransparentInput
                    className={`${errors.appPassword && 'border-destructive-600'}`}
                    placeholder="Enter password"
                    type="password" // Added type for password input
                    {...field}
                  />
                </FormControl>
                {errors.appPassword && (
                  <div className="flex items-center mt-1">
                    <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                    <FormMessage className="text-xs font-normal" />
                  </div>
                )}
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              variant="primary"
              className="hover:bg-primary"
            >
              {form.formState.isSubmitting && (
                <ReloadIcon className="mr-2 size-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

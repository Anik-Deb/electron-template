import React from 'react'
import {
  Form
} from '@/components/ui/form'; // You may not need this import if not used
import { useToast } from '@/components/ui/use-toast';
import UpdateServerConfigurationSubmit from '@/pages/UpdateServerConfiguration/Components/UpdateServerConfigurationSubmit';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import LocalDbConfig from './LocalDbConfig';
// import { configData } from '@/utils/configReader';
// import { verifySMTPAccount } from 'src/main/db/services/ValidateSmtpService'

export const emailInfoSchema = z.object({
  email: z.string().min(1, 'Email address is required'),
  appPassword: z.string().min(1, 'App password is required'),
});

const databaseOption = [
  { name: 'Local Database', step: 1 },
  { name: 'Cloud Database', step: 2 },
];

export default function ServerConfigurationForm() {
  const { toast } = useToast();

  const navigate = useNavigate();
  const form = useForm({
    // resolver: zodResolver(emailInfoSchema),
    defaultValues: {
      user: '',
      host: '',
      database: '',
      password: '',
      port: '',
      url: '',
      //   user: configData?.user || '',
      //   host: configData?.host || '',
      //   database: configData?.database || '',
      //   password: configData?.password || '',
      //   port: configData.port || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      // console.log('Email configuration data:', data);
      const result = await window.api.addServerConfig(data);
      console.log('result:', result);
      toast({
        description: result?.message || 'Something went wrong!',
      });
      //   navigate(0);
      if (result?.status === 200) {
        await window.api.appQuit();
      }
    } catch (error) {
      toast({
        title: 'Failed!',
        description: 'Something went wrong!',
      });
      console.log('added: error from the email configuration:', error);
    }
  };

  return (
    <div className="mt-6">
      <div className="border border-gray-200 p-5 rounded-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <LocalDbConfig form={form} />
            {/* <CloudDbConfig form={form} /> */}
          </form>
        </Form>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 ml-auto"
          >
            <UpdateServerConfigurationSubmit
              form={form}
              onSubmit={() => form.handleSubmit(onSubmit)()}
              actionType="add"
            />
          </form>
        </Form>
      </div>
    </div>
  );
}

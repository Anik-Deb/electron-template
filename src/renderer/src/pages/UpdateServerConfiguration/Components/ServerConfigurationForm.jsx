import { useForm } from 'react-hook-form';
import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // You may not need this import if not used
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { useToast } from '@/components/ui/use-toast';
import { TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import UpdateServerConfigurationSubmit from './UpdateServerConfigurationSubmit';
// import { configData } from '@/utils/configReader';
// import { verifySMTPAccount } from 'src/main/db/services/ValidateSmtpService'

export const emailInfoSchema = z.object({
  email: z.string().min(1, 'Email address is required'),
  appPassword: z.string().min(1, 'App password is required'),
});

export default function ServerConfigurationForm({
  setIsEdit,
  prevValue,
  allConfigs,
}) {
  const { toast } = useToast();

  const navigate = useNavigate();
  const form = useForm({
    // resolver: zodResolver(emailInfoSchema),
    defaultValues: {
      user: prevValue?.user || '',
      host: prevValue?.host || '',
      database: prevValue?.database || '',
      password: prevValue?.password || '',
      port: prevValue?.port || '',
      //   user: configData?.user || '',
      //   host: configData?.host || '',
      //   database: configData?.database || '',
      //   password: configData?.password || '',
      //   port: configData.port || '',
    },
  });
  const {
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    try {
      // console.log('Email configuration data:', data);
      const result = await window.api.updateServerConfig(data);
      console.log('from updated result:', result);
      toast({
        description: result?.message || 'Something went wrong!',
      });
      setIsEdit(false);
      //   navigate(0);
      if (result?.status) {
        await window.api.appQuit();
      }
    } catch (error) {
      toast({
        title: 'Failed!',
        description: 'Something went wrong!',
      });
      console.log('updated: error from the email configuration:', error);
    }
  };

  const deleteHandler = async () => {
    const Delete = await window.api.deleteServerConfig();
    // console.log('delete:', Delete);
  };
  // console.log('prev value:', prevValue);
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
                      className={`${errors.user && 'border-destructive-600'}`}
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
                      className={`${errors.host && 'border-destructive-600'}`}
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
                      className={`${errors.database && 'border-destructive-600'}`}
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
                      className={`${errors.password && 'border-destructive-600'}`}
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
                      className={`${errors.port && 'border-destructive-600'}`}
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

      <div className="flex justify-between items-center mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 ml-auto"
          >
            <div
              onClick={() => setIsEdit(false)}
              className="h-9 flex items-center px-4 text-sm leading-8 font-normal rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70 bg-white"
            >
              Cancel
            </div>
            <UpdateServerConfigurationSubmit
              form={form}
              onSubmit={() => form.handleSubmit(onSubmit)()}
            />
            {/* <Button
              type="submit"
              className="hover:bg-primary h-9"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <ReloadIcon className="mr-2 size-4 animate-spin" />
              )}
              Update
            </Button> */}
          </form>
        </Form>
      </div>
    </div>
  );
}

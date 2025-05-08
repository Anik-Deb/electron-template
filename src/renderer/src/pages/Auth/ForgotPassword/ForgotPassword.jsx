import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { ArrowLeft, Lock, Mail, Phone, LoaderCircle, TriangleAlert, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function ForgotPassword() {
  const [isPasswordShow, setIsPasswordShow] = React.useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
      })
    ),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    // // console.log('Login Information:', data);
    /*TODO: those information from database*/ 
    const result = await window.api.resetEmailSend(
      {
        emailFrom: 'mokhles.xponent@gmail.com', // dynamic emailFrom
        emailPass: 'gkughsjtagzszlwl', // dynamically pass the password
      },
      data.email,
      'Reset password',
      'This is the link'
    );
    // // console.log('result:', result);
    if (result.success) {
      navigate(`/verify/${data.email}`);
    }
    // // console.log('send email:', result);
  };
  return (
    <div className="bg-white p-6 rounded-md drop-shadow w-96">
      {/* <div className="flex justify-end">
          <button className="text-gray-400 hover:text-gray-600">
            <X className="size-4 absolute left-3 top-2.5 text-gray-400" />
          </button>
        </div> */}
      <h2 className="text-2xl mb-1 font-bold leading-9 tracking-tight text-gray-900">
        Forgot Password?
      </h2>
      <p className="text-[13px] text-gray-500 mb-4">
        Enter the email address associated with your account and we'll send you
        a OTP to reset your password
      </p>
      {/* Sign up Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="block relative">
                  <Mail className="size-4 absolute left-3 top-2.5 text-gray-400" />
                  <TransparentInput
                    {...field}
                    type="email"
                    errors={form.formState.errors.email}
                    placeholder="Email address"
                    className="pl-10"
                  />
                </FormLabel>
                {form.formState.errors.email && (
                  <div className="flex items-center">
                    <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                    <FormMessage className="text-xs font-normal" />
                  </div>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-white hover:bg-primary-600"
            disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.watch('email'))}
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Send me OTP
          </Button>
        </form>
      </Form>
      {/* Send reset link  */}
      <div className="flex gap-1 justify-center item-center text-gray-500 mt-4 text-[13px]">
        <ArrowLeft className="size-4 mt-0.5" />{' '}
        <p>
          Back to
          <Link to="/signin" className="text-blue-500 ml-0.5">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
}

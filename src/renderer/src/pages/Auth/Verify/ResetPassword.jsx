import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Lock, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

export default function ResetPassword({ setIsOtpValid, userId }) {
  const navigate = useNavigate();
  const [isPasswordShow, setIsPasswordShow] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(
      z
        .object({
          password: z.string().min(6, 'Min 6 digit long.'),
          confirmPassword: z.string().min(6, 'Min 6 digit long.'),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: 'Passwords do not match.',
          path: ['confirmPassword'], // Error will show on confirmPassword field
        })
    ),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    if (!userId) {
      setIsOtpValid(false);
      return;
    }
    // // console.log('password', data);
    const newData = {
      _id: userId,
      password: data.password,
    };
    const user = await window.api.updateUser(newData);
    navigate('/signin');
    // // console.log('password reset true:', user);
  };
  return (
    <div className="bg-white p-6 rounded-md drop-shadow w-96">
      {/* <div className="flex justify-end">
          <button className="text-gray-400 hover:text-gray-600">
            <X className="size-4 absolute left-3 top-2.5 text-gray-400" />
          </button>
        </div> */}
      <h2 className="text-2xl mb-3 font-bold leading-9 tracking-tight text-gray-900">
        Reset Password
      </h2>
      {/* Sign up Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="block relative">
                  <Lock className="size-4 absolute left-3 top-2.5 text-gray-400" />
                  <TransparentInput
                    {...field}
                    errors={form.formState.errors.email}
                    placeholder="Password"
                    className="pl-10"
                  />
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="block relative">
                  <Lock className="size-4 absolute left-3 top-2.5 text-gray-400" />
                  <TransparentInput
                    {...field}
                    errors={form.formState.errors.email}
                    placeholder="Confirm Password"
                    className="pl-10"
                  />
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-white hover:bg-primary-600"
            disabled={!form.formState.errors}
          >
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Confirm
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

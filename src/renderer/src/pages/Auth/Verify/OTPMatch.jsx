import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';

export default function OTPMatch({ setIsOtpValid, setUserId }) {
  const { email } = useParams();
  const [isPasswordShow, setIsPasswordShow] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        pin: z.string().min(6, 'Min 6 digit long.'),
      })
    ),
    defaultValues: {
      pin: '',
    },
  });

  const onSubmit = async (data) => {
    // // console.log('Otp', data);
    // // console.log('email:', email);
    const users = await window.api.getUsers();
    const user = users.find(
      (user) => user.email === email && user.otpCode === data.pin
    );
    if (user) {
      setUserId(user.id);
      setIsOtpValid(true);
    } else {
      setUserId(null);
      setIsOtpValid(false);
    }
    // // console.log('user:', user);

    // // console.log('send email:', result);
  };
  return (
    <div className="bg-white p-6 rounded-md drop-shadow w-[315px]">
      {/* <div className="flex justify-end">
          <button className="text-gray-400 hover:text-gray-600">
            <X className="size-4 absolute left-3 top-2.5 text-gray-400" />
          </button>
        </div> */}
      <h2 className="text-2xl mb-1 font-bold leading-9 tracking-tight text-gray-900">
        Verify
      </h2>
      <p className="text-[13px] text-gray-500 mb-4">Check your email address</p>
      {/* Sign up Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              // <FormItem className="space-y-1">
              //   <FormLabel className="block relative">
              //     <Mail className="size-4 absolute left-3 top-2.5 text-gray-400" />
              //     <TransparentInput
              //       {...field}
              //       type="email"
              //       errors={form.formState.errors.email}
              //       placeholder="Email address"
              //       className="pl-10"
              //     />
              //   </FormLabel>
              //   {form.formState.errors.email && (
              //     <div className="flex items-center">
              //       <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
              //       <FormMessage className="text-xs font-normal" />
              //     </div>
              //   )}
              // </FormItem>
              <FormItem>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex gap-2.5 rounded-none">
                      <InputOTPSlot className="rounded-md" index={0} />
                      <InputOTPSlot className="rounded-md border" index={1} />
                      <InputOTPSlot className="rounded-md border" index={2} />
                      <InputOTPSlot className="rounded-md border" index={3} />
                      <InputOTPSlot className="rounded-md border" index={4} />
                      <InputOTPSlot className="rounded-md border" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                {/* <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription> */}
                <FormMessage />
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
            Verify
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

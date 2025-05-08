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
import { Lock, Mail, LoaderCircle, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeClosedIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/Context/AuthProvider';
import { useToast } from '@/components/ui/use-toast';

export default function Signin() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPasswordShow, setIsPasswordShow] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().optional(),
      })
    ),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (data) => {
    const response = await login({
      email: data.email,
      password: data.password,
    });
    // console.log('response:', response);
    if (response) {
      navigate(response?.redirectURL || '/dashboard');
      toast({
        description: 'Login Successful!',
      });
    } else {
      toast({
        description: 'Login credential are wrong!',
      });
    }
  };
  const sendResetLink = async (data) => {
    /*TODO: reset email link */
    // navigate('/reset-password');
    // // console.log('Data', data);
  };
  return (
    <>
      <div className="flex flex-col gap-8">
        {/* <img
          className="mx-auto h-auto w-[160px]"
          src={blackLogo}
          alt="Your Company"
        /> */}
        <div className='text-2xl font-semibold text-center'>Logo</div>
        <div className="bg-white px-8 py-8 rounded-md w-96 border border-gray-100 shadow-sm">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="text-center text-xl font-bold tracking-tight text-primary-950 mb-6">
              Log in to your account
            </h2>
          </div>
          {/* <p className="text-center text-gray-500 mt-1 mb-4 text-[13px]">
        New user?{' '}
        <Link to="/signup" className="text-blue-500">
          Create an account
        </Link>
      </p> */}
          {/* Login Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="block relative">
                      <Lock className="size-4 absolute left-3 top-2.5 text-gray-400" />
                      <span
                        onClick={() => setIsPasswordShow((prev) => !prev)}
                        className="absolute right-3 top-2.5 "
                      >
                        <EyeClosedIcon className="size-4 cursor-pointer text-gray-400" />
                      </span>
                      <TransparentInput
                        type={!isPasswordShow ? 'password' : 'text'}
                        {...field}
                        errors={form.formState.errors.password}
                        placeholder="Password"
                        className="pl-10"
                      />
                    </FormLabel>{' '}
                    {form.formState.errors.password && (
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
                className="w-full"
                disabled={!form.watch('email') || !form.watch('password')}
              >
                {form.formState.isSubmitting && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Sign in
              </Button>
            </form>
          </Form>
          {/* Send reset link  */}

          {/* <div className="mt-px">
        <Link
          to="/forgot-password"
          className="text-center text-gray-500 text-[13px]"
        >
          Forgot your password?{' '}
          <Button
            variant="transparent"
            className="text-blue-500 p-0 size-fit font-normal"
          >
            reset now
          </Button>
        </Link>
      </div> */}
        </div>
      </div>
    </>
  );
}

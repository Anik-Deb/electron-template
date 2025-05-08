/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderCircle, Eye, EyeClosed } from 'lucide-react';

export default function UserFrom({ setIsModalOpen, onSubmit, form, prevData }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name Field */}
          <CommonFormField form={form} label="First Name*" name="first_name">
            {(field) => <Input placeholder="Enter first name" {...field} />}
          </CommonFormField>

          {/* Last Name Field */}
          <CommonFormField form={form} label="Last Name*" name="last_name">
            {(field) => <Input placeholder="Enter last name" {...field} />}
          </CommonFormField>
        </div>
        {/* email */}
        <CommonFormField form={form} label="Email*" name="email">
          {(field) => <Input placeholder="Enter email" {...field} />}
        </CommonFormField>

        {/* Phone Number Field */}
        <CommonFormField form={form} label="Phone Number*" name="phone">
          {(field) => <Input placeholder="Enter phone number" {...field} />}
        </CommonFormField>

        {/* Role Field */}
        <CommonFormField form={form} label="Role*" name="role">
          {(field) => (
            <Select
              onValueChange={(value) => field.onChange(value)}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CommonFormField>
        {/* Password Field */}

        {!prevData && (
          <>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeClosed className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeClosed className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {/* Submit form and cancel modal button */}
        <div className="flex gap-2 items-center justify-end">
          <div
            onClick={() => {
              form.reset();
              setIsModalOpen(false); // Close the modal
            }}
            className="h-9 px-4 leading-8 font-semibold rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
          >
            Cancel
          </div>
          <Button type="submit" className="text-white">
            {form.formState.isSubmitting && (
              <LoaderCircle className="mr-2 size-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

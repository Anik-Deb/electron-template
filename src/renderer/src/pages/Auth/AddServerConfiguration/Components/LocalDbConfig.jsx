import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { TriangleAlert } from 'lucide-react';
import React from 'react';

export default function LocalDbConfig({ form }) {
  return (
    <>
      <FormField
        control={form.control}
        name="user"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-gray-600 text-[13px]">User</FormLabel>
            <FormControl>
              <TransparentInput
                className={`${form?.formState?.errors.user && 'border-destructive-600'}`}
                placeholder="Enter user name"
                type="user"
                {...field}
              />
            </FormControl>
            {form?.formState?.errors.user && (
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
            <FormLabel className="text-gray-600 text-[13px]">Host</FormLabel>
            <FormControl>
              <TransparentInput
                className={`${form?.formState?.errors.host && 'border-destructive-600'}`}
                placeholder="Enter host"
                // Added type for password input
                {...field}
              />
            </FormControl>
            {form?.formState?.errors.host && (
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
                className={`${form?.formState?.errors.database && 'border-destructive-600'}`}
                placeholder="Enter database name "
                // Added type for password input
                {...field}
              />
            </FormControl>
            {form?.formState?.errors.database && (
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
                className={`${form?.formState?.errors.password && 'border-destructive-600'}`}
                placeholder="Enter Password"
                // Added type for password input
                {...field}
              />
            </FormControl>
            {form?.formState?.errors.password && (
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
            <FormLabel className="text-gray-600 text-[13px]">Port</FormLabel>
            <FormControl>
              <TransparentInput
                className={`${form?.formState?.errors.port && 'border-destructive-600'}`}
                placeholder="Enter Port"
                // Added type for password input
                {...field}
              />
            </FormControl>
            {form?.formState?.errors.port && (
              <div className="flex items-center mt-1">
                <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                <FormMessage className="text-xs font-normal" />
              </div>
            )}
          </FormItem>
        )}
      />
    </>
  );
}

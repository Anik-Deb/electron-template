import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { cn } from '@/utils';
export default function CommonFormField({
  form,
  className,
  label,
  name,
  children,
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn('flex-1 space-y-0.5 flex flex-col gap-0', className)}
        >
          {label ? (
            <FormLabel className="text-gray-700 font-medium text-[14px]">
              {label}
            </FormLabel>
          ) : (
            ''
          )}
          <FormControl>
            {/* Render the input component via children */}
            {children(field)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

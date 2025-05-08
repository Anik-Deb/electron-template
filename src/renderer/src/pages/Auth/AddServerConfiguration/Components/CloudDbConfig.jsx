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

export default function CloudDbConfig({ form }) {
  return (
    <>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-gray-600 text-[13px]">
              Database url
            </FormLabel>
            <FormControl>
              <TransparentInput
                className={`${form?.formState?.errors.user && 'border-destructive-600'}`}
                placeholder="Enter database url"
                type="url"
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
    </>
  );
}

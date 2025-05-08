import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
export default function FormActions({ form, navigate }) {
  return (
    <div className="flex justify-end gap-2 mt-8 pb-4">
      <div
        onClick={() => {
          form.reset();
          navigate('/rooms'); // Close the modal
        }}
        className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
      >
        Cancel
      </div>
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="text-white bg-primary"
      >
        {form.formState.isSubmitting && (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        )}
        Save
      </Button>
    </div>
  );
}

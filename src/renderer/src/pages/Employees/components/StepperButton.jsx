/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StepperButton = ({
  form,
  currentStep,
  totalSteps,
  handlePrevious,
  handleNext,
  onSubmit,
  cancelURL,
  className,
}) => {
  const navigate = useNavigate();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={cn('flex justify-end gap-2 mt-8 pb-4 pr-4', className)}>
      {/* Cancel Button - Only visible on the first step */}
      {isFirstStep && (
        <div
          onClick={() => {
            form.reset();
            navigate(cancelURL); // Close the modal
          }}
          className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
        >
          Cancel
        </div>
      )}

      {/* {/ Back Button - Only visible after the first step /} */}
      {!isFirstStep && (
        <Button
          type="button"
          onClick={handlePrevious}
          variant="secondary"
          className="text-gray-700 bg-white border hover:opacity-70"
        >
          Back
        </Button>
      )}

      {/* {/ Continue Button - Only visible on steps before the last step /} */}
      {!isLastStep && (
        <Button type="button" onClick={handleNext} variant="primary">
          Next
        </Button>
      )}

      {/* {/ Submit Button - Only visible on the last step /} */}
      {isLastStep && (
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="text-white"
        >
          {form.formState.isSubmitting && (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          )}
          Submit
        </Button>
      )}
    </div>
  );
};

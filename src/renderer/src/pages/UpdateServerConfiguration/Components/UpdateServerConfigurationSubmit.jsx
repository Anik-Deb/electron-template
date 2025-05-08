import React from 'react'
import DangerIcon from '@/components/Icons/DangerIcon';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
export default function UpdateServerConfigurationSubmit({
  form,
  onSubmit,
  actionType,
}) {
  return (
    <AlertDialog>
      {form.formState.isDirty ? (
        <AlertDialogTrigger
          asChild
          className={`h-9 cursor-pointer px-4 flex items-center`}
        >
          <Button
            // type="submit"
            // className="hover:bg-primary h-9"
            disabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <ReloadIcon className="mr-2 size-4 animate-spin" />
            )}
            {actionType ? 'Add' : 'Update'}
          </Button>
        </AlertDialogTrigger>
      ) : (
        <Button
          className="hover:bg-primary h-9"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <ReloadIcon className="mr-2 size-4 animate-spin" />
          )}
          {actionType ? 'Add' : 'Update'}
        </Button>
      )}
      <AlertDialogContent className="border-none">
        <AlertDialogHeader className="flex flex-col items-center gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-start">
          <p className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive-100">
            <DangerIcon className="size-[1.4rem] stroke-destructive stroke-[1.5]" />
          </p>
          <div>
            <AlertDialogTitle>
              <p className="text-base font-semibold capitalize">
                {actionType || 'Update'} Server configuration
              </p>
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-2 text-paragraph">
              Do you want save this configuration?
              {/* {description || 'Do you want to delete'} */}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center sm:justify-end">
          <AlertDialogCancel className="h-8">No</AlertDialogCancel>
          <AlertDialogAction className="h-8" onClick={onSubmit}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

      {/* <AlertContent
        title={`Are you sure to ${actionType || 'update'} server configuration?`}
        description="This action cannot be undone!"
        onClick={onSubmit}
      /> */}
    </AlertDialog>
  );
}

import { AlertContent } from '@/components/Common/AlertDialog/AlertContent';
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React from 'react';
import { useNavigate } from 'react-router-dom';
function DeleteSMSConfigure({ id }) {
  const navigate = useNavigate();
  const deleteHandler = async () => {
    try {
      const deleteData = await window.api.deleteSMSConfiguration(id);
      console.log('delete the data', deleteData);
      navigate(0);
    } catch (error) {
      console.log('Error from deleting:', error);
    }
  };
  return (
    <AlertDialog>
      <AlertTrigger
        className="h-7 px-2 font-normal cursor-pointer text-[13px] w-full flex justify-start bg-transparent hover:bg-accent hover:text-accent-foreground"
        type="button"
      />
      <DropdownMenuItem className="py-0">
        <AlertContent
          title="Are you sure you want to delete this Staff?"
          description="This action cannot be undone. Deleting the Staff will permanently remove all associated data."
          onClick={deleteHandler}
        />
      </DropdownMenuItem>
    </AlertDialog>
  );
}

function DeleteAllSMSConfigure({ SMSConfigs }) {
  const navigate = useNavigate();
  const deleteHandler = async () => {
    try {
      const deletePromises = SMSConfigs.map((id) =>
        window.api.deleteSMSConfiguration(id)
      );
      await Promise.all(deletePromises);
      navigate(0);
    } catch (error) {
      console.log('Error from deleting:', error);
    }
  };
  return (
    <AlertDialog>
      <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete these Staff?"
        description="This action cannot be undone. Deleting these Staff will permanently remove all associated data."
        onClick={deleteHandler}
      />
    </AlertDialog>
  );
}

export { DeleteAllSMSConfigure, DeleteSMSConfigure };

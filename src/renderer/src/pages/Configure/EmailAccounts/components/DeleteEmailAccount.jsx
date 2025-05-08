import React from 'react'
import { AlertContent } from '@/components/Common/AlertDialog/AlertContent'
import AlertTrigger from '@/components/Common/AlertDialog/AlertTrigger'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'

function DeleteEmailAccount({ id }) {
  const navigate = useNavigate()
  const deleteHandler = async () => {
    try {
      await window.api.deleteEmailConfiguration(id)
      // // console.log('delete the data', deleteData)
     navigate(0)
    } catch (error) {
      console.log('Error from deleting:', error)
    }
  }
  return (
    <AlertDialog>
      <AlertTrigger
        className="h-7 px-2 font-normal cursor-pointer text-[13px] w-full flex justify-start bg-transparent hover:bg-accent hover:text-accent-foreground"
        type="button"
      />
      <DropdownMenuItem className="py-0">
        <AlertContent
          title="Are you sure you want to delete this account?"
          description="This action cannot be undone. Delete the account permanently."
          onClick={deleteHandler}
        />
      </DropdownMenuItem>
    </AlertDialog>
  )
}

function DeleteAllEmailAccount({ Ids }) {
  const navigate = useNavigate()
  const deleteHandler = async () => {
    try {
      await window.api.deleteAllEmailConfiguration(Ids)
      // // console.log('Delete features', result)
      navigate(0)
    } catch (error) {
      console.log('Error from deleting:', error)
    }
  }
  return (
    <AlertDialog>
       <AlertTrigger type="icon" className="stroke-gray-400" />
      <AlertContent
        title="Are you sure you want to delete this accounts?"
        description="This action cannot be undone. Delete the accounts permanently."
        onClick={deleteHandler}
      />
    </AlertDialog>
  )
}

export { DeleteAllEmailAccount, DeleteEmailAccount }

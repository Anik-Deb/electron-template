import React, { useEffect, useState } from 'react'
import EmailAccountsTable from './components/EmailAccountsTable'
import { columns } from './components/columns'


export default function EmailAccounts() {
  const [emailLists, setEmailLists] = useState([])

  useEffect(() => {
    const getData = async () => {
      const emailLists = await window.api.getEmailConfigurations()

      setEmailLists(emailLists)
    }
    getData()
  }, [])
  return (
    <div>
      <EmailAccountsTable columns={columns} data={emailLists} setEmailLists={setEmailLists} />
    </div>
  )
}

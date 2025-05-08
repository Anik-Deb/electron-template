import React from 'react'
import EmptyState from '@/components/Common/EmptyState'

const emptyContent = {
  title: 'Aww! There is nothing here!',
  description: 'Currently no SMS Configure available. Add a new sms configure!',
  createNew: {
    cta: '',
    url: '#'
  }
  // icon: EmptyContentIcon
}

export default function SMSConfigureEmpty() {
  return (
    <>
      <EmptyState emptyContent={emptyContent}></EmptyState>
    </>
  )
}

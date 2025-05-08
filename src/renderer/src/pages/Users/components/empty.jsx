/* eslint-disable react/prop-types */
import React from 'react';
import EmptyState from '@/components/Common/EmptyState';
// import EmptyContactIcon from '@/icons/EmptyContactIcon';

export default function EmptyComponent({
  title,
  description,
  ctaText,
  ctaUrl,
  setIsModalOpen,
  modalButtonText,
}) {
  const emptyContent = {
    title: title || 'Aww! There is nothing here!',
    description: description || 'Currently no data available. Add a new entry!',
    createNew: ctaText && ctaUrl ? { cta: ctaText, url: ctaUrl } : null, // Only add if valid
    setIsModalOpen,
    modalButtonText,
    // icon: EmptyContentIcon
  };

  return (
    <EmptyState
      emptyContent={emptyContent}
      setIsModalOpen={setIsModalOpen}
      modalButtonText={modalButtonText}
    />
  );
}

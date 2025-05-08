/* eslint-disable react/prop-types */
import EmptyStateIcon from '@/components/Icons/EmptyStateIcon';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

const EmptyState = ({ emptyContent, children }) => {
  const { title, description, createNew, setIsModalOpen, modalButtonText } =
    emptyContent || {}; // Ensure no crashes

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center items-center">
      {/* Icon */}
      {emptyContent.icon ? (
        <div>
          <emptyContent.icon className="size-40 stroke-teal-500" />
        </div>
      ) : (
        <div className="rounded-full flex items-center justify-center">
          <EmptyStateIcon className="h-24 w-fit stroke-none" />
        </div>
      )}

      {/* Title & Description */}
      <p className="text-center text-base mt-3 font-semibold text-subHeading">
        {title}
      </p>
      <p className="mt-1 px-10 text-center text-[13px] text-muted-foreground md:px-20">
        {description}
      </p>

      {/* Additional children (e.g., Modals) */}
      <div>{children}</div>
      {/* Show button only if `createNew` exists */}
      {createNew?.cta && createNew?.url ? (
        // Link button for navigating to a different page (e.g., Add Provider page)
        <Link to={createNew.url} className="mt-2">
          <Button
            variant="primary"
            className="gap-1 font-medium text-xs"
            size="xs"
          >
            <Plus className="size-3 stroke-gray-50" />
            {createNew.cta}
          </Button>
        </Link>
      ) : (
        // Modal button to open the modal if `setIsModalOpen` is provided
        <Button
          onClick={() => setIsModalOpen(true)} // Open the modal
          variant="primary"
          className="gap-1 font-medium text-xs mt-2"
          size="xs"
        >
          <Plus className="size-3 stroke-gray-50" />
          {modalButtonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

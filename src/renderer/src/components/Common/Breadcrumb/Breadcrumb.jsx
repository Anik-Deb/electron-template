import React from 'react';
import { Link } from 'react-router-dom';

// Helper function to map path segments to labels
const getLabel = (segment) => {
  // Replace hyphens with spaces and capitalize each word
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Breadcrumb({ pathArray }) {
  return (
    <div className="mt-2 text-[13px] capitalize text-muted-foreground">
      {/* Always show Dashboard as the first link */}
      <Link className="text-primary-700" to="/">
        Dashboard
      </Link>{' '}
      {/* Map through the path segments and create breadcrumb links */}
      {pathArray.map((segment, index) => {
        // Skip numeric segments (e.g., IDs in URLs like /edit-room/:id)
        if (!isNaN(Number(segment))) return null;

        const path = `/${pathArray.slice(0, index + 1).join('/')}`;
        const label = getLabel(segment);

        return (
          <span key={index}>
            {' / '}
            {index === pathArray.length - 1 ? (
              <span>{label}</span> // Last segment is not a link
            ) : (
              <Link className="text-primary-700" to={path}>
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
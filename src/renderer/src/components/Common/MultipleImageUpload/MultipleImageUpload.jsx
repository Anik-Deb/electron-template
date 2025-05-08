/* eslint-disable react/prop-types */
// import { Plus, X } from 'lucide-react';
import React from 'react';
import FileAttachment from './FileAttachment';

export default function MultipleImageUpload({
  imageGallery,
  setImageGalleries,
  index,
}) {
  const [error, setError] = React.useState(null);
  return (
    <div className="gap-1.5">
      <div className="space-y-1 flex-1">
        {/* File */}
        <FileAttachment
          error={error}
          setError={setError}
          index={index}
          prevData={imageGallery || ''}
          setImageGalleries={setImageGalleries}
          className="h-14"
        />
      </div>
    </div>
  );
}

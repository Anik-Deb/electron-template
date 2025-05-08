/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form } from '@/components/ui/form';

import React from 'react';
// import NidAttachment from './NidAttachment';
import { Label } from '@/components/ui/label';
import MultipleImageUpload from '@/components/Common/MultipleImageUpload/MultipleImageUpload';
import { useEffect } from 'react';

const Certifications = ({
  form,
  onSubmit,
  imageGalleries,
  setImageGalleries,
  prevData,
}) => {
  useEffect(() => {
    form.setValue('certifications', imageGalleries); // Ensure certifications are part of the form data
  }, [imageGalleries]);

  return (
    <>
      <div onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl px-4">
        {/* <h1 className="capitalize font-semibold border-b pb-2">
          Certifications
        </h1> */}
        {/* <NidAttachment form={form} prevData={prevData} /> */}
        <div>
          <Label className="text-gray-600 text-[13px]">
            Upload Certificates
          </Label>
          {imageGalleries?.map((imageGallery, index) => (
            <MultipleImageUpload
              form={form}
              key={index}
              index={index}
              imageGallery={imageGallery}
              setImageGalleries={setImageGalleries}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Certifications;

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function UploadImage({ preview, empty, handleImageChange }) {
  return (
    <div className="group mt-4 flex items-center gap-3 border rounded p-4">
      <div className="w-16 h-16">
        <img
          className="rounded-full h-full w-full"
          src={preview || empty}
          alt="profile image"
        />
      </div>
      <div className="flex flex-1 justify-between items-center">
        <div className="flex-1 flex flex-col">
          <Label className="font-semibold text-base">Upload a image</Label>
          <span className="flex-1 text-gray-400 text-sm">
            SVG,PNG,JPG or GIF (max. 300*300px)
          </span>
        </div>
        <div className="border relative w-32 h-10 mx-auto flex justify-center items-center rounded">
          <Input
            type="file"
            // className="absolute inset-0 opacity-0 w-full h-full"
            className="w-28 h-10 absolute inset-0 opacity-0"
            onChange={handleImageChange}
          />
          <div className="font-semibold text-gray-600 text-sm">
            {'Choose Image'}
          </div>
        </div>
      </div>
    </div>
  );
}

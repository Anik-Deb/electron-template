/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { cn } from '@/utils';
import { ArrowLeft, LucideLink, TriangleAlert, Upload } from 'lucide-react';
import React from 'react';

export default function NidAttachment({ form, prevData }) {
  // Get existing NID data
  const nidData = prevData?.nid || form.watch('nid');
  // console.log('nid data:', nidData);
  /*State*/
  const [chooseNidUploadedOption, setChooseNidUploadedOption] = React.useState(
    nidData ? (nidData?.startsWith('https://') ? 'drive_link' : true) : false
  );
  const [nidPreview, setNidPreview] = React.useState(
    nidData && !nidData.startsWith('https://') ? nidData : ''
  );
  const [error, setError] = React.useState(null);
  const [nidUpload, setNidUpload] = React.useState(
    nidData && !nidData.startsWith('https://') ? nidData : false
  );
  const [imageDetails, setImageDetails] = React.useState(
    nidData && !nidData.startsWith('https://') ? { name: 'Nid' } : ''
  );

  /* Handle Change */
  const handleNidChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes >= 1e9) return (sizeInBytes / 1e9).toFixed(2) + ' GB';
        if (sizeInBytes >= 1e6) return (sizeInBytes / 1e6).toFixed(2) + ' MB';
        if (sizeInBytes >= 1e3) return (sizeInBytes / 1e3).toFixed(2) + ' KB';
        return sizeInBytes + ' Bytes';
      };

      setImageDetails({
        name: file?.name,
        size: formatFileSize(file?.size),
      });

      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG and PNG images are allowed.');
        return;
      }
      setError(null);
      setNidUpload(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setNidPreview(reader.result);
        form.setValue('nid', reader.result); // ✅ Ensure form value is set
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormField
      control={form.control}
      name="nid"
      defaultValue={nidData} // ✅ Ensure defaultValue is set
      render={({ field }) => (
        <FormItem className="flex flex-col gap-0 space-y-3">
          <FormLabel className="text-gray-700">Upload NID</FormLabel>
          {chooseNidUploadedOption !== 'drive_link' ? (
            <div
              className={cn(
                'mt-2 border rounded flex items-center justify-center',
                `${!nidUpload ? 'h-20' : 'h-fit'}`
              )}
            >
              {!nidUpload ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="mt-2 text-gray-500 bg-white hover:bg-transparent size-fit p-0 border-0 px-4 py-2">
                      <Upload className="size-4 stroke-400 mr-1.5 " /> Attach
                      Nid
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                      value={chooseNidUploadedOption}
                      onValueChange={setChooseNidUploadedOption}
                    >
                      <div className="pl-2 py-1.5 rounded hover:bg-accent hover:text-accent-foreground relative flex items-center">
                        <TransparentInput
                          type="file"
                          className="h-full w-full p-0 absolute top-0 left-0 z-30 opacity-0 "
                          placeholder="Image"
                          onChange={handleNidChange}
                        />
                        <span className="flex items-center gap-1 text-[14px]">
                          <Upload className="size-3.5 text-gray-500 mr-1" />{' '}
                          Upload from System
                        </span>
                      </div>
                      <DropdownMenuRadioItem
                        className="px-2"
                        value="drive_link"
                      >
                        <LucideLink className="size-3.5 text-gray-500 mr-1" />{' '}
                        Drive Link
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center flex-1 p-3 gap-2.5 truncate">
                  <img
                    className="rounded-full size-8"
                    src={nidPreview}
                    alt="profile image"
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-medium text-gray-600 capitalize leading-none truncate">
                      {imageDetails?.name}{' '}
                    </span>
                    <span className="text-xs text-gray-500">
                      {imageDetails?.size}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <FormLabel
                onClick={() => setChooseNidUploadedOption('')}
                className="text-gray-600 text-[13px] flex items-center gap-[3px] cursor-pointer"
              >
                <ArrowLeft className="size-3.5 relative top-px stroke-primary-950 " />{' '}
                <span>Paste Your Drive Link</span>
              </FormLabel>
              <FormControl>
                <TransparentInput
                  className={`${form.formState?.errors?.nid && 'border-destructive-600'}`}
                  placeholder="https://"
                  defaultValue={nidData?.startsWith('https://') ? nidData : ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    form.setValue('nid', e.target.value); // ✅ Ensure React Hook Form updates the value
                  }}
                />
              </FormControl>
            </div>
          )}
          <div className="flex items-start justify-between text-gray-500">
            {error ? (
              <div className="flex items-center gap-1">
                <TriangleAlert className="size-4 stroke-white fill-destructive-600" />
                <span className="text-xs flex items-center text-destructive-500">
                  Upload only JPG, PNG images.
                </span>
              </div>
            ) : (
              <span className="text-xs flex items-center">
                Upload only JPG, PNG images.
              </span>
            )}
            {nidUpload && (
              <span
                onClick={() => {
                  setChooseNidUploadedOption('');
                  setNidUpload(false);
                  form.setValue('nid', ''); // ✅ Reset form value on change
                }}
                className="h-7 text-xs cursor-pointer"
              >
                Change NID
              </span>
            )}
          </div>
        </FormItem>
      )}
    />
  );
}

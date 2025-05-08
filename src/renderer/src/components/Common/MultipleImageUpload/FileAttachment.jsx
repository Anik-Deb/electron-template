/* eslint-disable react/prop-types */
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import TransparentInput from '@/components/ui/TransparentInput/TransparentInput';
import { cn } from '@/utils';
import { ArrowLeft, LucideLink, TriangleAlert, Upload, X } from 'lucide-react';
import React from 'react';

export default function FileAttachment({
  prevData,
  index,
  label,
  className,
  setImageGalleries,
  error,
  setError,
}) {
  /*State*/
  const [chooseFileUploadedOption, setChooseFileUploadedOption] =
    React.useState(
      prevData ? (prevData?.startsWith('https://') ? 'link' : true) : false
    );
  const [filePreview, setFilePreview] = React.useState(
    !prevData?.startsWith('https://') ? prevData : ''
  );
  // const [error, setError] = React.useState(null);
  const [fileUpload, setFileUpload] = React.useState(
    prevData && !prevData?.startsWith('https://') ? prevData : ''
  );
  /*TODO: change nid name*/
  const [imageDetails, setImageDetails] = React.useState(
    prevData && !prevData?.startsWith('https://') ? { name: 'File' } : ''
  );

  /* Handle Change */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Format file size
      const formatFileSize = (sizeInBytes) => {
        if (sizeInBytes >= 1e9) {
          return (sizeInBytes / 1e9).toFixed(2) + ' GB';
        } else if (sizeInBytes >= 1e6) {
          return (sizeInBytes / 1e6).toFixed(2) + ' MB';
        } else if (sizeInBytes >= 1e3) {
          return (sizeInBytes / 1e3).toFixed(2) + ' KB';
        } else {
          return sizeInBytes + ' Bytes';
        }
      };

      // Set image label with formatted size
      setImageDetails({
        name: file?.name,
        size: formatFileSize(file?.size),
      });

      // Check if the file is a valid image type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setError('Only JPG and PNG image are allowed.');
        return;
      }
      setError(null);
      setFileUpload(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
        setImageGalleries((prev) =>
          prev.map((item, i) => (i === index ? reader?.result : item))
        );
        // form.setValue(fileName, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  //   console.log('file preview', filePreview);
  return (
    <div className={cn('flex flex-col gap-0')}>
      {chooseFileUploadedOption !== 'link' ? (
        <div
          className={cn(
            ' mt-2 py-8 border rounded flex items-center justify-center',
            `${!fileUpload ? 'h-20' : 'h-fit'}`,
            className
          )}
        >
          {/* Choose Option */}
          {!fileUpload ? (
            <div className="flex items-center justify-between w-full px-4 h-full">
              <div className="flex-1 flex flex-col">
                <Label className="font-semibold text-base">
                  Upload a image
                </Label>
                <span className="flex-1 text-gray-400 text-sm">
                  SVG, PNG, JPG or GIF (max. 1200*900px)
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-gray-600 font-medium size-fit rounded-sm border  p-2 px-6"
                    variant="cancel"
                  >
                    {/* <Upload className="size-4 stroke-400 mr-1" />{' '} */}
                    {label || 'Choose File'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={chooseFileUploadedOption}
                    onValueChange={setChooseFileUploadedOption}
                  >
                    {/* Upload from System */}
                    <div className="pl-2 py-1.5 rounded hover:bg-accent hover:text-accent-foreground relative flex items-center">
                      <TransparentInput
                        type="file"
                        className={`h-full w-full p-0 absolute top-0 left-0 z-30 opacity-0 `}
                        placeholder="Image"
                        onChange={handleFileChange}
                      />
                      <span className="flex items-center gap-1 text-[14px]">
                        <Upload className="size-3.5 text-gray-500 mr-1" />{' '}
                        Upload from System
                      </span>
                    </div>
                    {/* File Link */}
                    <DropdownMenuRadioItem className="px-2" value="link">
                      <LucideLink className="size-3.5 text-gray-500 mr-1" />{' '}
                      File Link
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center flex-1 p-3 gap-2.5 truncate">
              <img
                className="rounded size-10"
                src={filePreview}
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
          {/* Change option */}
          {fileUpload && (
            <Button
              onClick={() => {
                setChooseFileUploadedOption(false);
                setFileUpload(false);
                setFilePreview('');
                setImageDetails({ name: 'File' });
              }}
              className="text-gray-600 font-medium size-fit rounded-sm border mr-4 p-2 px-6"
              variant="cancel"
            >
              Change File
            </Button>
          )}
        </div>
      ) : (
        /* Drive Link*/
        <div className="space-y-1">
          <Label
            onClick={() => setChooseFileUploadedOption('')}
            className="text-gray-600 text-[13px] flex items-center gap-[3px] cursor-pointer"
          >
            <ArrowLeft className="size-3.5 relative top-px stroke-primary-950 " />{' '}
            <span>Paste Your File Link</span>
          </Label>
          {/* <FormControl> */}
          <TransparentInput
            placeholder="https://"
            defaultValue={prevData?.startsWith('https://') ? prevData : ''}
            onChange={(e) =>
              setImageGalleries((prev) =>
                prev.map((item, i) => (i === index ? e.target?.value : item))
              )
            }
          />
          {/* </FormControl> */}
        </div>
      )}
      <div className="flex items-center justify-between w-full text-gray-500">
        {error ? (
          <div className="flex items-center gap-1">
            <TriangleAlert className="size-4 stroke-rose-500 fill-destructive-600" />
            <span className="text-xs flex items-center text-rose-500">
              Upload only JPG, PNG image.
            </span>
          </div>
        ) : (
          <span className="text-xs flex items-center">
            Upload only JPG, PNG image.
          </span>
        )}

        <div className="flex items-center justify-between gap-2.5 mt-2">
          <div
            onClick={() => {
              setImageGalleries((prev) =>
                prev?.length > 1 ? prev.filter((_, i) => i !== index) : prev
              );
            }}
          >
            <span className="text-xs cursor-pointer text-gray-500">
              <X className='size-4 stroke-gray-500 mt-1'/>
            </span>
          </div>
          <div
            onClick={() => {
              setImageGalleries((prev) => {
                return [...prev, ''];
              });
            }}
          >
            <span className="text-xs cursor-pointer bg-primary text-white px-2 py-1 rounded-sm text-center">
              Add
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

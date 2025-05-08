/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import DatePicker from '@/components/Common/DatePicker/DatePicker';
import { DatePickerWithRange } from '@/components/Common/DatePickerWithRange/DatePickerWithRange';
import Loading from '@/components/Common/Loading';
import UploadImage from '@/components/Common/UploadImage/UploadIImage';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils';
import { LoaderCircle, Plus, Search } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import inputEmpty from '../../../../../assets/input-empty.png';

export default function BookingForm({
  date,
  setDate,
  guests,
  isLoading,
  onSubmit,
  profilePreview,
  setProfilePreview,
  prevData,
  searchedGuest,
  setSearchedGuest,
}) {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [searchingNumber, setSearchingNumber] = React.useState('');

  const form = useForm({
    // resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: prevData?.first_name || '',
      last_name: prevData?.last_name || '',
      email: prevData?.email || '',
      profile_picture_url: prevData?.profile_picture_url || '',
      date_of_birth: prevData?.date_of_birth || '',
      phone: prevData?.phone || '',
      emergency_contact_phone: prevData?.emergency_contact_phone || '',
      passportId: prevData?.passportid || '',
      nid: prevData?.nid || '',
      nationality: prevData?.nationality || '',
      address: prevData?.address || '',
      secondary_address: prevData?.secondary_address || '',
      job_title: prevData?.job_title || '',
      company_name: prevData?.company_name || '',
      role: prevData?.role || 'guest',
    },
  });

  // handle image change
  const handleImageChange = (e) => {
    const file = e.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
        form.setValue('profile_picture_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle User Search
  const handleSearch = () => {
    // console.log('clicked:');
    const guest = guests.find((guest) => guest.phone === searchingNumber);
    if (!guest) {
      setSearchedGuest(null);
    } else {
      setSearchedGuest(guest);
    }
  };
  /* Handle search visitor */
  const handleGuest = () => {
    console.log('searched guest:', searchedGuest);
    if (searchedGuest) {
      form.setValue('first_name', searchedGuest?.first_name);
      form.setValue('last_name', searchedGuest?.last_name);
      form.setValue('email', searchedGuest?.email);
      setProfilePreview(searchedGuest?.profile_picture_url);
      form.setValue('date_of_birth', searchedGuest?.date_of_birth);
      form.setValue('phone', searchedGuest?.phone);
      form.setValue(
        'emergency_contact_phone',
        searchedGuest?.emergency_contact_phone
      );
      form.setValue('passportId', searchedGuest?.passportid);
      form.setValue('nid', searchedGuest?.nid);
      form.setValue('nationality', searchedGuest?.nationality);
      form.setValue('address', searchedGuest?.address);
      form.setValue('secondary_address', searchedGuest?.secondary_address);
      form.setValue('job_title', searchedGuest?.job_title);
      form.setValue('company_name', searchedGuest?.company_name);
    } else {
      form.setValue('first_name', '');
      form.setValue('last_name', '');
      form.setValue('email', '');
      setProfilePreview('');
      form.setValue('profile_picture_url', '');
      form.setValue('date_of_birth', '');
      form.setValue('phone', '');
      form.setValue('emergency_contact_phone', '');
      form.setValue('passportId', '');
      form.setValue('nid', '');
      form.setValue('nationality', '');
      form.setValue('address', '');
      form.setValue('secondary_address', '');
      form.setValue('job_title', '');
      form.setValue('company_name', '');
      //   setImagePreview('');
    }
    setPopoverOpen((prev) => !prev);
  };

  return (
    <>
      <div className="shadow-sm rounded max-w-2xl bg-white">


        {/* Search user */}
        {!prevData?.id ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <div className="flex-1 flex p-4 border-b">
              <div className="flex-1 flex flex-col gap-0">
                <Input
                  onChange={(e) => setSearchingNumber(e.target.value)}
                  type="number"
                  className={cn(
                    !searchedGuest && 'border-destructive-600',
                    'h-9 block bg-transparent text-xs font-normal text-gray-600 hover:border-paragraph focus:border-primary focus-visible:border-dark-900 focus-visible:ring-0 focus-visible:ring-offset-0',
                    'w-full placeholder:text-placeholder rounded-r-none '
                  )}
                  placeholder="Search a User with number"
                />
              </div>
              {/* Search bar */}
              <PopoverTrigger asChild>
                <div
                  onClick={handleSearch}
                  className="h-9 px-3 cursor-pointer bg-primary hover:bg-primary-600 flex items-center justify-center rounded-l-none rounded-r"
                >
                  <Search className="w-4 h-4 stroke-gray-300" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className={cn(searchedGuest ? 'w-80' : 'w-fit', 'bg-white p-4')}
              >
                {!isLoading ? (
                  <>
                    <h4 className="font-medium leading-none">
                      Staff information
                    </h4>
                    <Separator className={searchedGuest ? 'mt-4' : 'mt-2'} />
                    {!searchedGuest ? (
                      <p className="mt-2 text-paragraph font-normal text-sm text-center">
                        There is no Staff with this number
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center gap-8">
                          <p className="w-8 text-[13px] text-subHeading">
                            Staff
                          </p>

                          <div className="flex-1 border rounded px-2 py-1">
                            <span className="text-[13px] text-paragraph">
                              {searchedGuest?.first_name}
                            </span>
                            <span className="text-[13px] ml-1 text-paragraph">
                              {searchedGuest?.last_name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <p className="w-8 text-[13px] text-subHeading">
                            Email
                          </p>

                          <div className="flex-1 border rounded px-2 py-1">
                            <p className="text-[13px] text-paragraph">
                              {searchedGuest?.email}
                            </p>
                          </div>
                        </div>
                        {/* <Separator className="mt-2" /> */}
                        <div className="flex justify-end gap-3">
                          <Button
                            onClick={() => setPopoverOpen(false)}
                            variant="cancel"
                            className="h-9"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleGuest}
                            variant="default"
                            className="h-9 hover:bg-primary-600"
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Loading />
                )}
              </PopoverContent>
              <div className="sm:w-[40px] ml-2">
                <Link to="/guests/add-guest">
                  <div className="h-9 px-3 flex items-center justify-center bg-primary-500 hover:bg-primary-600 rounded text-white">
                    <Plus className="size-4 stroke-gray hover:stroke-gray-600" />
                  </div>
                </Link>
              </div>
            </div>
          </Popover>
        ) : (
          ''
        )}

        {/* Form Stepper */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-5 space-y-5"
          >
            {/* Check-in & Check-out */}
            <div className="grid grid-cols-2 gap-4">
              <CommonFormField form={form} label="Booking Date" name="check_in">
                {(field) => (
                  <DatePickerWithRange
                    date={date}
                    setDate={setDate}
                    buttonClassName="w-auto h-9 border border-input"
                    buttonVariant="transparent"
                  />
                )}
              </CommonFormField>
            </div>

            {/* Personal Info */}
            <div>
              <h1 className="text-lg font-semibold text-primary-600 mb-2">
                Personal Info
              </h1>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <CommonFormField
                    form={form}
                    label="First Name*"
                    name="first_name"
                  >
                    {(field) => (
                      <Input placeholder="Enter First Name" {...field} />
                    )}
                  </CommonFormField>
                  <CommonFormField
                    form={form}
                    label="Last Name*"
                    name="last_name"
                  >
                    {(field) => (
                      <Input placeholder="Enter Last Name" {...field} />
                    )}
                  </CommonFormField>
                </div>
                <CommonFormField
                  form={form}
                  label="Nationality"
                  name="nationality"
                >
                  {(field) => (
                    <Input placeholder="Enter Nationality" {...field} />
                  )}
                </CommonFormField>
                <CommonFormField
                  form={form}
                  label="Passport/ National ID Number*"
                  name="passport_or_national_number"
                >
                  {(field) => (
                    <Input placeholder="Enter Passport Number" {...field} />
                  )}
                </CommonFormField>
                <CommonFormField
                  form={form}
                  label="Date Of Birth"
                  name="date_of_birth"
                >
                  {(field) => (
                    <DatePicker
                      placeholder="Select Date"
                      field={field}
                      form={form}
                    />
                  )}
                </CommonFormField>
                <CommonFormField form={form} label="Address 1" name="address_1">
                  {(field) => (
                    <Input placeholder="Enter Address 1" {...field} />
                  )}
                </CommonFormField>
                <CommonFormField form={form} label="Address 2" name="address_2">
                  {(field) => (
                    <Input placeholder="Enter Address 2" {...field} />
                  )}
                </CommonFormField>
              </div>

              {/* Upload Image*/}
              <UploadImage
                preview={profilePreview}
                empty={inputEmpty}
                handleImageChange={handleImageChange}
              />
            </div>

            {/* Others Information */}
            <div>
              <h1 className="text-lg font-semibold text-primary-600 mb-2">
                Others Info
              </h1>

              <div className="space-y-3">
                <div className="flex gap-4">
                  <CommonFormField
                    form={form}
                    label="Emergency Contact Number*"
                    name="emergency_contact_number"
                  >
                    {(field) => (
                      <Input
                        placeholder="Enter Emergency Contact Number"
                        {...field}
                      />
                    )}
                  </CommonFormField>
                  <CommonFormField
                    form={form}
                    label="Emergency Contact Relationship*"
                    name="emergency_contact_relationship"
                  >
                    {(field) => (
                      <Input
                        placeholder="Enter Relationship (e.g., Parent, Spouse)"
                        {...field}
                      />
                    )}
                  </CommonFormField>
                </div>
                <div className="flex gap-4">
                  <CommonFormField
                    form={form}
                    label="Job Title"
                    name="job_title"
                  >
                    {(field) => (
                      <Input placeholder="Enter Job Title" {...field} />
                    )}
                  </CommonFormField>
                  <CommonFormField
                    form={form}
                    label="Company Name"
                    name="company_name"
                  >
                    {(field) => (
                      <Input placeholder="Enter Company Name" {...field} />
                    )}
                  </CommonFormField>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 mt-8 pb-4">
              <div
                onClick={() => {
                  form.reset();
                  navigate('/rooms'); // Close the modal
                }}
                className="h-10 px-4 leading-8 font-semibold flex justify-center items-center rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
              >
                Cancel
              </div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="text-white bg-primary"
              >
                {form.formState.isSubmitting && (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

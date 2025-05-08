/* eslint-disable react/prop-types */
import { DatePickerWithRange } from '@/components/Common/DatePickerWithRange/DatePickerWithRange';
import Loading from '@/components/Common/Loading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { StepperButton } from '@/pages/Employees/components/StepperButton';
import { cn } from '@/utils';
import { Plus, Search } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import EmploymentDetails from './EmploymentDetails';
import IdentityDetails from './IdentityDetails';
import PersonalDetails from './PersonalDetails';

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
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [searchingNumber, setSearchingNumber] = React.useState('');

  const [currentStep, setCurrentStep] = React.useState(1);

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

  // Function to go to the next step
  const handleNext = () => {
    if (currentStep < 2) setCurrentStep((prev) => prev + 1);
  };
  // Function to go to the previous step
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };
  // handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      {/* Stepper */}
      {/* <FormSteper currentStep={currentStep} totalSteps={2} className="mb-6" /> */}
      <div className="shadow-sm rounded border max-w-2xl bg-white p-5">
        {/* Search user */}
        {!prevData?.id ? (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <div className="flex-1 flex mt-4">
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
                className={cn(searchedGuest ? 'w-80' : 'w-fit', 'bg-white')}
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
            className="space-y-5 mt-4"
          >
            {/* Step: 1 user personal information */}
            {currentStep === 1 && (
              <PersonalDetails
                form={form}
                profilePreview={profilePreview}
                handleImageChange={handleImageChange}
              />
            )}
            {/* Step: 2 user indentification */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label className="text-gray-700 text-[14px]">
                    Booking Dates
                  </Label>
                  <DatePickerWithRange
                    date={date}
                    setDate={setDate}
                    buttonClassName="w-full flex justify-start border-input text-placeholder"
                    buttonVariant="outline"
                  />
                </div>
                <IdentityDetails form={form} prevData={prevData} />
                <Separator />
                <EmploymentDetails form={form} />
              </>
            )}

            <StepperButton
              form={form}
              currentStep={currentStep}
              totalSteps={2}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              onSubmit={onSubmit}
              cancelURL="/rooms"
            />
          </form>
        </Form>
      </div>
    </>
  );
}

/* eslint-disable react/prop-types */
import CommonFormField from '@/components/Common/CommonFormField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import AddAmenities from '../Amenities/AddAmenities';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema } from '../RoomValidationSchema';
import Description from '@/components/ui/Description/Description';

const RoomForm = ({ onSubmit, prevData }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amenities, setAmenities] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const amenities = await window.api.getAmenitys();

        setAmenities(amenities);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };
    fetchData();
  }, []);


  const form = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      room_number: prevData?.room_number || '',
      type_name: prevData?.type_name || 'standard',
      description: prevData?.description ?? '',
      status: prevData?.status || 'available',
      base_price: prevData?.base_price || '',
      capacity: prevData?.capacity ? parseInt(prevData.capacity) : '',
      amenities: prevData?.amenities || [],
    },
  });
  // set prevdata
  useEffect(() => {
    if (prevData) {
      // Extract amenity IDs from objects
      const amenityIds = prevData.amenities?.map((a) => a.amenity_id) || [];
      form.reset({
        ...prevData,
        amenities: amenityIds,
      });
    }
  }, [prevData]);

  // Handle main form submission
  const handleMainFormSubmit = async (data) => {
    if (isModalOpen) {
      // If the modal is open, do not proceed with the main form submission
      return;
    }
    // Call the provided onSubmit function
    await onSubmit(data);
  };

  return (
    <div className="mt-8 max-w-5xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleMainFormSubmit)}>
          <div className="grid grid-cols-3 gap-4">
            {/*-------------- room info form--------------------*/}
            <div className="col-span-2 shadow-sm rounded border max-w-full p-4 bg-white">
              <h1 className="capitalize font-semibold border-b pb-2 mb-4">
                Room Information
              </h1>
              <div className="space-y-4">
                <CommonFormField
                  form={form}
                  label="Room Number*"
                  name="room_number"
                >
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Room Number"
                      {...field}
                    />
                  )}
                </CommonFormField>

                {/* <CommonFormField
                    form={form}
                    label="Room Type"
                    name="type_name"
                  >
                    {(field) => (
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Room Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </CommonFormField> */}

                {/* <CommonFormField form={form} label="Status" name="status">
                    {(field) => (
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="checked">checked</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </CommonFormField> */}

                <CommonFormField
                  form={form}
                  label="Base Price*"
                  name="base_price"
                >
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Base Price"
                      {...field}
                    />
                  )}
                </CommonFormField>

                <CommonFormField form={form} label="Capacity*" name="capacity">
                  {(field) => (
                    <Input
                      type="number"
                      placeholder="Enter Capacity"
                      {...field}
                      value={field.value ? field.value : ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value)
                          : '';
                        field.onChange(value);
                      }}
                    />
                  )}
                </CommonFormField>
                <CommonFormField
                  form={form}
                  label="Description"
                  name="description"
                >
                  {(field) => (
                    <Description
                      height={80}
                      placeholder="Enter Description"
                      field={field}
                    />
                  )}
                </CommonFormField>
              </div>
            </div>
            {/* --------------amenities list------------------- */}
            <div className="shadow-sm rounded border max-w-2xl p-4 h-auto bg-white">
              <h1 className="capitalize font-semibold border-b pb-2">
                Room Amenities
              </h1>
              <div className="flex items-center justify-between mt-4 mb-3">
                <Label className="text-gray-600 text-[13px]">Amenities* </Label>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger
                    className="text-[13px] flex flex-row items-center gap-[2px] text-gray-600 font-semibold"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="stroke-gray-600 w-3 h-3 mt-1" />
                    <span>Create</span>
                  </DialogTrigger>
                  {/* add amenities modal */}
                  <AddAmenities
                    setAmenities={(newAmenities) => {
                      setAmenities(newAmenities); // Update the amenities list
                      setIsModalOpen(false); // Close modal after adding an amenity
                    }}
                    setIsModalOpen={setIsModalOpen}
                  />
                </Dialog>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-[500px] pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {amenities.length === 0 ? (
                  <div className="text-center text-xs text-gray-500 py-4 bg-gray-50 rounded-md">
                    No amenities available!
                  </div>
                ) : (
                  amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2 border rounded-lg p-2"
                    >
                      <Checkbox
                        checked={form.watch('amenities')?.includes(amenity.id)}
                        onCheckedChange={(checked) => {
                          const currentAmenities =
                            form.getValues('amenities') || [];
                          if (checked) {
                            form.setValue('amenities', [
                              ...currentAmenities,
                              amenity.id,
                            ]);
                          } else {
                            form.setValue(
                              'amenities',
                              currentAmenities.filter(
                                (item) => item !== amenity.id
                              )
                            );
                          }
                        }}
                      />
                      <label className="text-[13px]">
                        {amenity.amenity_name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* Submit form and cancel button */}
          <div className="flex gap-2 items-center justify-end mt-4">
            <div
              onClick={() => {
                form.reset();
                navigate('/rooms');
              }}
              className="py-1 px-4 leading-8 font-semibold rounded-md cursor-pointer text-gray-700 border text-[13px] hover:opacity-70"
            >
              Cancel
            </div>
            <Button type="submit" className="text-white" disabled={isModalOpen}>
              {form.formState.isSubmitting && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RoomForm;

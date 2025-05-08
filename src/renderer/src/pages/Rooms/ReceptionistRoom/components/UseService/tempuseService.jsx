/* eslint-disable react/prop-types */
import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Drawer } from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import calculateVAT from '@/utils/calculateVAT';
import fetchInvoice from '@/utils/fetchInvoice';
import { showToast } from '@/utils/toastHelper';
import { Check, PenLine, Plus, Trash2, X } from 'lucide-react';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import DeleteService from './DeleteService';
import UpdateService from './UpdateService';

export default function UseService({ room }) {
  // console.log('room:', room);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [invoice, setInvoice] = React.useState({});
  const [services, setServices] = React.useState([]);
  const [tempArraylist, setTempArraylist] = React.useState([]);
  const [editingServiceId, setEditingServiceId] = React.useState(null);
  const [serviceSelections, setServiceSelections] = React.useState([]);
  // console.log('service selections:', serviceSelections);
  React.useEffect(() => {
    // Fetches all available services when the component mounts
    const fetchData = async () => {
      try {
        const allServices = await window.api.getServices();
        const invoice = await fetchInvoice({ booking_id: room?.booking?.id });
        setServices(allServices);
        setInvoice(invoice);
        setServiceSelections([...(invoice?.invoiceItems || [])]);
      } catch (error) {
        console.log('Error fetching services:', error);
      }
    };
    fetchData();
  }, []);

  const form = useForm({});

  /**
   *
   * This is Responsible for
   * 1. Add new Item inventory item
   * 2. Update the inventory total_amount
   *
   */
  
  const handleAddService = async (id) => {
    // Finds the selected service for the given ID
    const selection = serviceSelections.find((item) => item.id === id);
    console.log('selected section:', selection);

    if (selection?.selectedService) {
      setTempArraylist((prev) => [...prev, selection.selectedService]);
      /**
       * Add Invoice Item
       *
       * */

      const service = selection?.selectedService;
      console.log('selected service:', service);
      const service_price =
        Number(service?.hotel_rate) > 0 || service?.default_price;

      const invoiceItemData = {
        invoice_id: invoice.id,
        service_type: 'service',
        service_id: service?.id,
        quantity: 1,
        unit_price: service_price,
        total_price: service_price,
      };

      const invoiceItem = window.api.addInvoiceItem(invoiceItemData);

      const updateInvoice = window.api.updateInvoice({
        id: invoice?.id,
        updates: { total_amount: service_price },
      });
      const result = await Promise.all([invoiceItem, updateInvoice]);

      // Removes the selection from the list
      // handleRemoveSelection(id);

      showToast('success', 'Service added successfully!');
    } else {
      showToast('error', 'No service selected.');
    }
  };

  /**
   *
   * This is function responsible for update inventory item.
   *
   */
  const handleUpdateService = async (id, value) => {
    // Finds the updated service based on the provided value
    const selected = services.find((item) => item.service_name === value);

    console.log('selected item:');

    if (selected) {
      /**
       * Here inventory item updated.
       *
       */
      const service = selected;
      console.log('service:', service);
      const service_price =
        Number(service?.hotel_rate) != '0.00'
          ? Number(service?.hotel_rate)
          : Number(service?.default_price) || 0.0; // Ensure a valid number, defaulting to 0

      const invoiceItemData = {
        invoice_id: invoice.id,
        service_type: 'service',
        service_id: service?.id,
        quantity: 1,
        unit_price: service_price,
        total_price: service_price,
      };

      /* This is invoice item added function */
      /* Later on it's will be convert update function */
      const invoiceItemPromise = window.api.addInvoiceItem(invoiceItemData);
      const updateInvoicePromise = window.api.updateInvoice({
        id: invoice?.id,
        updates: { total_amount: service_price },
      });

      /**
       * This is invoice update function
       */
      const [invoiceItem, invoiceResult] = await Promise.all([
        invoiceItemPromise,
        updateInvoicePromise,
      ]);
      console.log('result:', invoiceItem);
      // Updates the service details in the temporary list
      setServiceSelections(
        (prev) =>
          prev?.map((item) =>
            item?.selectedService === null ? { ...invoiceItem, service } : item
          )
        // prev.forEach((item, index) => {
        //   if (item?.selectedService === null) {
        //     prev[index] = { ...invoiceItem, service };
        //   } else if (prev[index + 1] === -1) {
        //     prev[index + 1] = invoiceItem;
        //   }
        // })
      );

      // Exits editing mode
      setEditingServiceId(null);

      showToast('success', 'Service updated successfully!');
    }
  };

  const handleAddNewSelection = () => {
    console.log('new service:');
    // Adds a new empty selection with a unique ID
    setServiceSelections((prev) => [
      ...prev,
      { id: Date.now(), selectedService: null },
    ]);
  };

  /**
   *
   * */
  const handleEditService = (service) => {
    console.log(' handle edit service:', service);
    // Sets the service ID for editing mode
    setEditingServiceId(service.id);
  };

  /**
   *
   * Delete the inventory item
   *
   */
  const handleRemoveService = (id) => {
    // Removes the service from the temporary list
    setServiceSelections((prev) => prev.filter((item) => item.id !== id));
    showToast('info', 'Service removed successfully.');
  };

  // console.log('added new item:', serviceSelections);

  // const handleRemoveSelection = (id) => {
  //   // Removes a selection from the list of service selections
  //   setServiceSelections((prev) => prev.filter((item) => item.id !== id));
  // };

  // //
  // const handleServiceSelect = (id, value) => {
  //   // Finds the selected service based on the service name
  //   const service = services.find((item) => item.service_name === value);

  //   // Updates the selected service for the given ID
  //   setServiceSelections((prev) =>
  //     prev.map((item) =>
  //       item.id === id ? { ...item, selectedService: service } : item
  //     )
  //   );
  // };
  // console.log('service selection:', serviceSelections);
  return (
    <Drawer direction="right">
      <TriggerDrawer
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        variant="outline"
        className="border text-center border-gray-100 hover:bg-gray-100 h-9"
      >
        Add Service
      </TriggerDrawer>
      {isDrawerOpen && (
        <>
          <DrawerBody
            onClick={(e) => e.stopPropagation()}
            title={
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-lg font-semibold text-gray-700">
                  Add Service (Room {room?.room_number})
                </div>
              </div>
            }
          >
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* -------------------- Room Info ------------------------- */}
              <Card className="border-0 shadow-none">
                <CardHeader className="p-0 pb-2">
                  <p className="text-lg font-semibold">Room Info</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        Room Number
                      </span>
                      <span className="text-sm text-gray-500">
                        {room?.room_number}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        Status
                      </span>
                      <span className="text-sm text-gray-500">
                        {room?.status}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        Booking Name
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {room?.booking?.user?.first_name}{' '}
                        {room?.booking?.user?.last_name}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-gray-900">
                        Phone
                      </span>
                      <span className="text-sm text-gray-500">
                        {room?.booking?.user?.phone}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* -------------------- Services Section ---------------------- */}
              <div className="flex flex-col items-start gap-2 bg-white rounded-lg">
                <Card className="w-full border-0 shadow-none">
                  <CardHeader className="p-0 pb-2">
                    <p className="text-lg font-semibold">Service</p>
                  </CardHeader>
                  {/* -------------------- Edit Service Section ---------------------- */}
                  {/* {console.log('service selection:', serviceSelections)} */}
                  {serviceSelections?.length > 0 && (
                    <CardContent className="p-0 border rounded-md">
                      {serviceSelections?.map((service, index) => {
                        const isEditing = editingServiceId === service.id;
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b pl-3 last:border-none border-[#e6e6e8] h-9"
                          >
                            <div className="flex items-center flex-1">
                              {isEditing ? (
                                <Controller
                                  name={`service-${service.id}`}
                                  control={form.control}
                                  defaultValue={service.service_name}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        handleUpdateService(service.id, value);
                                      }}
                                    >
                                      <SelectTrigger className="w-fit px-0 h-9 border-none bg-transparent">
                                        <SelectValue placeholder="Select Service" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {services.map((s) => (
                                          <SelectItem
                                            key={s.id}
                                            value={s.service_name}
                                          >
                                            {s.service_name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              ) : (
                                <span className="text-sm text-gray-700">
                                  {index + 1}. {service.service_name}{' '}
                                  {service?.service_type === 'room'
                                    ? 'Room Rent'
                                    : service.service?.service_name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-end gap-2 p-2 w-[120px]">
                              {isEditing ? (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="w-7 h-7 border-[#21b259] rounded"
                                  onClick={() => setEditingServiceId(null)}
                                >
                                  <Check className="w-5 h-5 text-[#21b259]" />
                                </Button>
                              ) : (
                                service?.service_type !== 'room' && (
                                  <>
                                    {/* Update Dialog Will be added */}
                                    <UpdateService
                                      handleEditService={handleEditService}
                                      service={service}
                                    />

                                    {/* Delete Dialog */}
                                    <DeleteService
                                      id={service?.id}
                                      handleRemoveService={handleRemoveService}
                                    />
                                  </>
                                )
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>

                <Button
                  variant="ghost"
                  className="p-0.5 text-[#3287f7] hover:bg-transparent hover:text-[#3287f7]"
                  onClick={handleAddNewSelection}
                >
                  <Plus className="w-[18px] h-[18px]" />
                  <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-sm">
                    New Service
                  </span>
                </Button>
              </div>
            </div>
          </DrawerBody>
        </>
      )}
    </Drawer>
  );
}

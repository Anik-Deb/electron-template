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

export default function UseService({ room }) {
  // console.log('room:', room);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [invoice, setInvoice] = React.useState({});
  const [services, setServices] = React.useState([]);
  const [tempArraylist, setTempArraylist] = React.useState([]);
  const [editingServiceId, setEditingServiceId] = React.useState(null);
  const [serviceSelections, setServiceSelections] = React.useState([
    { id: Date.now(), selectedService: null },
  ]);

  React.useEffect(() => {
    // Fetches all available services when the component mounts
    const fetchData = async () => {
      try {
        const allServices = await window.api.getServices();
        const invoice = await fetchInvoice({ booking_id: room?.booking?.id });
        setServices(allServices);
        setInvoice(invoice);
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
      const service_price = service?.hotel_rate || service?.base_price;

      const invoiceItemData = {
        invoice_id: invoice.id,
        service_type: 'service',
        service_id: service?.id,
        quantity: 1,
        unit_price: Number(service_price) + calculateVAT(service_price),
        total_price: service_price,
      };

      // const invoiceItem = await window.api.addInvoiceItem(invoiceItemData);

      console.log('invoice item:', invoiceItemData);

      // Removes the selection from the list
      // handleRemoveSelection(id);

      showToast('success', 'Service added successfully!');
      // } else {
      //   showToast('info', 'You already added this service!');
      // }
    } else {
      showToast('error', 'No service selected.');
    }
  };

  /**
   *
   * This is function responsible for update inventory item.
   *
   */
  const handleUpdateService = (id, value) => {
    // Finds the updated service based on the provided value
    const selected = services.find((item) => item.service_name === value);

    if (selected) {
      /**
       * Here inventory item updated.
       *
       */

      // Updates the service details in the temporary list
      setTempArraylist((prev) =>
        prev.map((service) =>
          service.id === id ? { ...service, ...selected } : service
        )
      );

      // Exits editing mode
      // setEditingServiceId(null);

      showToast('success', 'Service updated successfully!');
    }
  };

  const handleAddNewSelection = () => {
    // Adds a new empty selection with a unique ID
    setServiceSelections((prev) => [
      ...prev,
      { id: Date.now(), selectedService: null },
    ]);
  };

  const handleEditService = (service) => {
    // Sets the service ID for editing mode
    setEditingServiceId(service.id);
    console.log(' handle edit service:', service);
  };

  const handleServiceSelect = (id, value) => {
    // Finds the selected service based on the service name
    const service = services.find((item) => item.service_name === value);

    // Updates the selected service for the given ID
    setServiceSelections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedService: service } : item
      )
    );
  };

  const handleRemoveService = (id) => {
    // Removes the service from the temporary list
    setTempArraylist((prev) => prev.filter((item) => item.id !== id));
    showToast('info', 'Service removed successfully.');
  };

  const handleRemoveSelection = (id) => {
    // Removes a selection from the list of service selections
    setServiceSelections((prev) => prev.filter((item) => item.id !== id));
  };

  console.log('added new item:', serviceSelections);

  return (
    <Drawer direction="right">
      <TriggerDrawer
        onClick={() => {
          setIsDrawerOpen(true);
        }}
        variant="outline"
        className="border border-gray-100 hover:bg-gray-100 pl-4 h-9"
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
                  {invoice?.invoiceItems?.length > 0 && (
                    <CardContent className="p-0 border rounded-md">
                      {invoice?.invoiceItems?.map((service, index) => {
                        const isEditing = editingServiceId === service.id;
                        return (
                          <div
                            key={service.id}
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
                                      <SelectTrigger className="w-fit px-0 h-9 border-none bg-white">
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
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 bg-[#35b9e90d] h-auto"
                                    onClick={() => handleEditService(service)}
                                  >
                                    <PenLine className="w-[16px] h-[16px] text-[#2EA7D3]" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 bg-rose-50/75 h-auto"
                                    onClick={() =>
                                      handleRemoveService(service.id)
                                    }
                                  >
                                    <Trash2 className="w-[16px] h-[16px] text-rose-400" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  )}
                </Card>

                {/* -------------- New service selection fields ------------------- */}
                {serviceSelections.map((selection) => (
                  <div
                    key={selection.id}
                    className="flex items-center gap-2 w-full"
                  >
                    <Controller
                      name={`new-service-${selection.id}`}
                      control={form.control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleServiceSelect(selection.id, value);
                          }}
                        >
                          <SelectTrigger className="w-full bg-white border-gray-100">
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service.id}
                                value={service.service_name}
                              >
                                {service.service_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 border-gray-100 rounded"
                      onClick={() => handleRemoveSelection(selection.id)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-7 h-7 border-[#21b259] rounded"
                      onClick={() => handleAddService(selection.id)}
                    >
                      <Check className="w-5 h-5 text-[#21b259]" />
                    </Button>
                  </div>
                ))}

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

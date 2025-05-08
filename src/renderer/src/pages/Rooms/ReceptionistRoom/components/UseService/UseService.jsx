/* eslint-disable react/prop-types */

import React from 'react';
import DrawerBody from '@/components/Common/Drawer/DrawerBody';
import TriggerDrawer from '@/components/Common/Drawer/TriggerDrawer';
import { Drawer } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import fetchInvoice from '@/utils/fetchInvoice';
import { showToast } from '@/utils/toastHelper';
import RoomInfoCard from './RoomInfoCard';
import ServiceList from './ServiceList';

export default function UseService({ room }) {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [invoice, setInvoice] = React.useState({});
  const [services, setServices] = React.useState([]);
  const [serviceSelections, setServiceSelections] = React.useState([]);
  const [editingServiceId, setEditingServiceId] = React.useState(null);

  React.useEffect(() => {
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
  }, [room?.booking?.id]);

  const handleAddNewSelection = async (selectedService) => {
    try {
      const service_price =
        Number(selectedService?.hotel_rate) ||
        Number(selectedService?.default_price) ||
        0.0;

      const invoiceItemData = {
        invoice_id: invoice.id,
        service_type: 'service',
        service_id: selectedService?.id,
        quantity: 1,
        unit_price: service_price,
        total_price: service_price,
      };

      // Save the new service to the backend
      const newInvoiceItem = await window.api.addInvoiceItem(invoiceItemData);

      // Update the local state with the new service
      setServiceSelections((prev) => [
        ...prev,
        { ...newInvoiceItem, service: selectedService },
      ]);

      showToast('success', 'Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      showToast('error', 'Failed to add service.');
    }
  };
  const handleUpdateService = async (id, value) => {
    try {
      console.log('id and value', id, value);
      // const selected = services.find((item) => item.service_name === value);
      // if (selected) {
      //   const service_price =
      //     Number(selected?.hotel_rate) ||
      //     Number(selected?.default_price) ||
      //     0.0;

      //   const invoiceItemData = {
      //     invoice_id: invoice.id,
      //     service_type: 'service',
      //     service_id: selected?.id,
      //     quantity: 1,
      //     unit_price: service_price,
      //     total_price: service_price,
      //   };

      //   // Update the existing invoice item
      //   const updatedInvoiceItem = await window.api.updateInvoiceItem(
      //     id,
      //     invoiceItemData
      //   );

      //   // Update the local state with the updated service
      //   setServiceSelections((prev) =>
      //     prev.map((item) =>
      //       item.id === id ? { ...updatedInvoiceItem, service: selected } : item
      //     )
      //   );

      //   setEditingServiceId(null);
      //   showToast('success', 'Service updated successfully!');
      // }
    } catch (error) {
      console.error('Error updating service:', error);
      showToast('error', 'Failed to update service.');
    }
  };
  const handleRemoveService = async (id) => {
    try {
      // Remove the service from the backend
      await window.api.deleteInvoiceItem(id);
      // Update the local state by removing the service
      setServiceSelections((prev) => prev.filter((item) => item.id !== id));

      showToast('info', 'Service removed successfully.');
    } catch (error) {
      console.error('Error removing service:', error);
      showToast('error', 'Failed to remove service.');
    }
  };

  return (
    <Drawer direction="right">
      <TriggerDrawer
        onClick={() => setIsDrawerOpen(true)}
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
            <div className="flex flex-col gap-6">
              <RoomInfoCard room={room} />
              <Separator />
              <ServiceList
                serviceSelections={serviceSelections}
                services={services}
                editingServiceId={editingServiceId}
                setEditingServiceId={setEditingServiceId}
                handleUpdateService={handleUpdateService}
                handleRemoveService={handleRemoveService}
                handleAddNewSelection={handleAddNewSelection}
              />
            </div>
          </DrawerBody>
        </>
      )}
    </Drawer>
  );
}

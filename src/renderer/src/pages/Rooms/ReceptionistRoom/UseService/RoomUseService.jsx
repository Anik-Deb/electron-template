import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { showToast } from '@/utils/toastHelper';

const RoomUseService = () => {
  const { roomId } = useParams();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [addedServices, setAddedServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await window.api.getServices();
        setServices(allServices);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!selectedService || quantity <= 0 || unitPrice <= 0) {
      showToast('error', 'Please fill all fields correctly.');
      return;
    }

    const service = services.find((s) => s.id === selectedService);
    const totalPrice = quantity * unitPrice;

    const newService = {
      service_id: service.id,
      service_name: service.service_name,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      date,
    };

    try {
      // Save the service to the backend
      await window.api.addInvoiceItem({
        invoice_id: roomId, // Assuming roomId is used as invoice_id for simplicity
        service_type: 'service',
        service_id: service.id,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        date,
      });

      setAddedServices([...addedServices, newService]);
      showToast('success', 'Service added successfully!');
    } catch (error) {
      console.error('Error adding service:', error);
      showToast('error', 'Failed to add service.');
    }
  };

  const handleRemoveService = async (index) => {
    const serviceToRemove = addedServices[index];
    try {
      await window.api.deleteInvoiceItem(serviceToRemove.service_id);
      setAddedServices(addedServices.filter((_, i) => i !== index));
      showToast('info', 'Service removed successfully.');
    } catch (error) {
      console.error('Error removing service:', error);
      showToast('error', 'Failed to remove service.');
    }
  };

  const totalAmount = addedServices.reduce(
    (sum, service) => sum + service.total_price,
    0
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Service to Room {roomId}</h1>
      <div className="space-y-4">
        <Select onValueChange={setSelectedService}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.id}>
                {service.service_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder="Unit Price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
        />
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={handleAddService} className="w-full">
          Add Service
        </Button>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        {addedServices.map((service, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 border rounded"
          >
            <div>
              <p>{service.service_name}</p>
              <p>
                Qty: {service.quantity}, Price: ${service.unit_price}, Total: $
                {service.total_price}
              </p>
              <p>Date: {service.date}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleRemoveService(index)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="text-right">
        <p className="text-lg font-bold">Total Amount: ${totalAmount}</p>
      </div>
    </div>
  );
};

export default RoomUseService;

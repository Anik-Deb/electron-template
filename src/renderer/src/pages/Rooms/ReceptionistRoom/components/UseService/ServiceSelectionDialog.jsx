/* eslint-disable react/prop-types */
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function ServiceSelectionDialog({
  isOpen,
  onClose,
  services,
  onSelectService,
  defaultValue, // Expects a service_name string
}) {
  const [selectedService, setSelectedService] = React.useState(
    defaultValue || ''
  );

  // Reset the selected service when the dialog is closed
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedService(defaultValue || '');
    }
  }, [isOpen, defaultValue]);

  const handleSelect = () => {
    if (selectedService) {
      onSelectService(selectedService); // Pass the selected service_name
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValue ? 'Edit Service' : 'Select a Service'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        <Select
          onValueChange={setSelectedService}
          value={selectedService} // Pre-select the service_name
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.id} value={service.service_name}>
                {service.service_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSelect} className="mt-4">
          {defaultValue ? 'Update Service' : 'Add Service'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

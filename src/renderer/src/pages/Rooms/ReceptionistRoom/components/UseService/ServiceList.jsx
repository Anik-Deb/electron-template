/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ServiceItem from './ServiceItem';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ServiceSelectionDialog from './ServiceSelectionDialog';

export default function ServiceList({
  serviceSelections,
  services,
  editingServiceId,
  setEditingServiceId,
  handleUpdateService,
  handleRemoveService,
  handleAddNewSelection,
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleAddService = (serviceName) => {
    const selectedService = services.find(
      (s) => s.service_name === serviceName
    );
    if (selectedService) {
      handleAddNewSelection(selectedService);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="p-0 pb-2">
        <p className="text-lg font-semibold">Service</p>
      </CardHeader>
      {serviceSelections?.length > 0 && (
        <CardContent className="p-0 border rounded-md overflow-y-auto max-h-[400px] custom-scrollbar">
          {serviceSelections?.map((service, index) => (
            <ServiceItem
              key={index}
              service={service}
              services={services}
              isEditing={editingServiceId === service.id}
              setEditingServiceId={setEditingServiceId}
              handleUpdateService={handleUpdateService}
              handleRemoveService={handleRemoveService}
              index={index}
            />
          ))}
        </CardContent>
      )}
      <>
        <Button
          variant="ghost"
          className="p-0.5 text-[#3287f7] hover:bg-transparent hover:text-[#3287f7]"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-[18px] h-[18px]" />
          <span className="[font-family:'Inter-Medium',Helvetica] font-medium text-sm">
            New Service
          </span>
        </Button>
        <ServiceSelectionDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          services={services}
          onSelectService={handleAddService}
        />
      </>
    </Card>
  );
}

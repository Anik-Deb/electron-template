/* eslint-disable react/prop-types */

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, PenLine, Trash2 } from 'lucide-react';
import ServiceSelectionDialog from './ServiceSelectionDialog';

// export default function ServiceItem({
//   service,
//   services,
//   isEditing,
//   setEditingServiceId,
//   handleUpdateService,
//   handleRemoveService,
//   index,
// }) {
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);

//   const handleEditService = (selectedServiceName) => {
//     handleUpdateService(service.id, selectedServiceName);
//     setIsDialogOpen(false);
//   };
//   const form = useForm({});
//   return (
//     <div className="flex items-center justify-between border-b pl-3 last:border-none border-[#e6e6e8] h-9">
//       <div className="flex items-center flex-1">
//         {isEditing ? (
//           <Controller
//             name={`service-${service.id}`}
//             control={form.control}
//             defaultValue={service.service_name}
//             render={({ field }) => (
//               <Select
//                 onValueChange={(value) => {
//                   field.onChange(value);
//                   handleUpdateService(service.id, value);
//                 }}
//                 value={field.value}
//               >
//                 <SelectTrigger className="w-fit px-0 h-9 border-none bg-transparent">
//                   <SelectValue placeholder="Select Service" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {services.map((s) => (
//                     <SelectItem key={s.id} value={s.service_name}>
//                       {s.service_name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//         ) : (
//           <span className="text-sm text-gray-700">
//             {index + 1}. {service.service_name}{' '}
//             {service?.service_type === 'room'
//               ? 'Room Rent'
//               : service.service?.service_name}
//           </span>
//         )}
//       </div>
//       <div className="flex items-center justify-end gap-2 p-2 w-[120px]">
//         {isEditing ? (
//           <Button
//             variant="outline"
//             size="icon"
//             className="w-7 h-7 border-[#21b259] rounded"
//             onClick={() => setEditingServiceId(null)}
//           >
//             <Check className="w-5 h-5 text-[#21b259]" />
//           </Button>
//         ) : (
//           service?.service_type !== 'room' && (
//             <>
//               <Button
//                 onClick={() => setIsDialogOpen(true)} // Open the dialog for editing
//                 variant="ghost"
//                 size="sm"
//                 className="p-2 bg-rose-50/75 h-auto"
//               >
//                 <PenLine className="w-[16px] h-[16px] text-[#2EA7D3]" />
//               </Button>
//               <Button
//                 onClick={() => handleRemoveService(service.id)}
//                 variant="ghost"
//                 size="sm"
//                 className="p-2 bg-rose-50/75 h-auto"
//               >
//                 <Trash2 className="w-[16px] h-[16px] text-rose-400" />
//               </Button>
//             </>
//           )
//         )}
//       </div>

//       {/* Dialog for editing */}
//       <ServiceSelectionDialog
//         isOpen={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         services={services}
//         onSelectService={handleEditService}
//         defaultValue={service.service_name} // Pre-select the current service
//       />
//     </div>
//   );
// }
export default function ServiceItem({
  service,
  services,
  isEditing,
  setEditingServiceId,
  handleUpdateService,
  handleRemoveService,
  index,
}) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleEditService = (selectedServiceName) => {
    handleUpdateService(service.id, selectedServiceName);
    setIsDialogOpen(false);
  };

  const form = useForm({});

  return (
    <div className="flex items-center justify-between border-b pl-3 last:border-none border-[#e6e6e8] h-9">
      <div className="flex items-center flex-1">
        {isEditing ? (
          <Controller
            name={`service-${service.id}`}
            control={form.control}
            defaultValue={service.service_name}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleUpdateService(service.id, value);
                }}
                value={field.value}
              >
                <SelectTrigger className="w-fit px-0 h-9 border-none bg-transparent">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.service_name}>
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
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="ghost"
                size="sm"
                className="p-2 bg-rose-50/75 h-auto"
              >
                <PenLine className="w-[16px] h-[16px] text-[#2EA7D3]" />
              </Button>
              <Button
                onClick={() => handleRemoveService(service.id)}
                variant="ghost"
                size="sm"
                className="p-2 bg-rose-50/75 h-auto"
              >
                <Trash2 className="w-[16px] h-[16px] text-rose-400" />
              </Button>
            </>
          )
        )}
      </div>

      {/* Dialog for editing */}
      <ServiceSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        services={services}
        onSelectService={handleEditService}
        defaultValue={service?.service?.service_name}
      />
    </div>
  );
}

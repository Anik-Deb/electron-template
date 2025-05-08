import CustomSelectTrigger from '@/components/ui/CustomSelectTrigger/CustomSelectTrigger';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { FilterIcon } from 'lucide-react';
import React from 'react';

const room_type = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Booked', value: 'booked' },
  { label: 'checked', value: 'checked' },
  { label: 'Maintenance', value: 'maintenance' },
];
export default function FilterRooms({ data, setFilterData }) {
  const [filterValue, setFilterValue] = React.useState(room_type[0]);

  const handleApplyFilters = (value) => {
    setFilterValue(room_type.find((r) => r.value === value));
    if (value !== 'all') {
      setFilterData(
        data?.filter((i) => i?.status.toLowerCase() === value.toLowerCase())
      );
    } else {
      setFilterData(data);
    }
  };
  // console.log('data:', filterValue);
  return (
    <Select onValueChange={handleApplyFilters}>
      <CustomSelectTrigger className="h-8 w-fit rounded-md border border-border focus:outline-none focus:border-border">
        <div className="rounded-md flex items-center gap-2 px-2 text-[13px]">
          <FilterIcon className="stroke-gray-500 size-4" />
          <p className="text-gray-500">
            {filterValue?.label !== 'all' ? filterValue?.label : 'Filters'}
          </p>
        </div>
      </CustomSelectTrigger>
      <SelectContent>
        {room_type?.map((room, index) => (
          <SelectItem key={index} className="px-2" value={room?.value}>
            {room?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// import CustomSelectTrigger from '@/components/ui/CustomSelectTrigger/CustomSelectTrigger';
// import { Select, SelectContent, SelectItem } from '@/components/ui/select';
// import { FilterIcon } from 'lucide-react';
// import React from 'react';

// export default function FilterItems({
//   setColumnFilters,
//   filterOptions = [], // Accept filter options as a prop
//   columnId, // Accept the column key for filtering
//   placeholder = 'Filters', // Optional placeholder text
// }) {
//   const [filterValue, setFilterValue] = React.useState('all');

//   console.log('columnId', columnId);

//   // Apply filters function
//   const handleApplyFilters = (value) => {
//     console.log("value ",value)
//     setFilterValue(value);
//     /* Start Filtering */
//     if (value !== 'all') {
//       setColumnFilters([{ id: columnId, value }]); // Filter based on the columnId
//     } else {
//       setColumnFilters([]); // Clear filters if 'all' is selected
//     }
//   };

//   return (
//     <Select onValueChange={(value) => handleApplyFilters(value)}>
//       <CustomSelectTrigger className="bg-gray-100 h-8 w-fit border-none focus:outline-none">
//         <div className="rounded-md flex items-center gap-2 px-2 text-[13px]">
//           <FilterIcon className="stroke-gray-500 size-4" />
//           <p className="text-gray-500">
//             {filterValue !== 'all' ? filterValue : placeholder}
//           </p>
//         </div>
//       </CustomSelectTrigger>
//       <SelectContent>
//         <SelectItem className="px-2" value={'all'}>
//           All
//         </SelectItem>
//         {filterOptions.map((option) => (
//           <SelectItem className="px-2" key={option.value} value={option.value}>
//             {option.label}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

/* --------------------------------------------------------
Filter modify to reuse to filter any value or boolean value
----------------------------------------------------------*/
/* eslint-disable react/prop-types */
import CustomSelectTrigger from '@/components/ui/CustomSelectTrigger/CustomSelectTrigger';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { FilterIcon } from 'lucide-react';
import React from 'react';

export default function FilterItems({
  setColumnFilters,
  filterOptions = [],
  columnId, // Accept the column key for filtering
  placeholder = 'Filters',
  isBooleanFilter = false,
}) {
  const [filterValue, setFilterValue] = React.useState('all');

  const handleApplyFilters = (value) => {
    setFilterValue(value);

    // For boolean filters, treat 'true' as Active and 'false' as Inactive
    if (value !== 'all') {
      const filterValue = isBooleanFilter
        ? value === 'true' // For boolean, 'true' will be treated as true, 'false' as false
        : value;
      setColumnFilters([{ id: columnId, value: filterValue }]); // Filter based on the columnId
    } else {
      setColumnFilters([]);
    }
  };

  return (
    <Select onValueChange={(value) => handleApplyFilters(value)}>
      <CustomSelectTrigger className="bg-gray-100 h-8 w-fit border-none focus:outline-none">
        <div className="rounded-md flex items-center gap-2 px-2 text-[13px]">
          <FilterIcon className="stroke-gray-500 size-4" />
          <p className="text-gray-500">
            {filterValue !== 'all'
              ? isBooleanFilter
                ? filterValue === 'true'
                  ? filterOptions.find((option) => option.value === 'true')
                      ?.label || 'Active'
                  : filterOptions.find((option) => option.value === 'false')
                      ?.label || 'Inactive'
                : filterValue
              : placeholder}
          </p>
        </div>
      </CustomSelectTrigger>
      <SelectContent>
        <SelectItem className="px-2" value={'all'}>
          All
        </SelectItem>
        {/* Handle Boolean Filters */}
        {isBooleanFilter ? (
          filterOptions.length > 0 ? (
            filterOptions.map((option) => (
              <SelectItem
                className="px-2"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))
          ) : (
            <>
              <SelectItem className="px-2" value={'true'}>
                Active
              </SelectItem>
              <SelectItem className="px-2" value={'false'}>
                Inactive
              </SelectItem>
            </>
          )
        ) : (
          // Handle Custom Filters
          filterOptions.map((option) => (
            <SelectItem
              className="px-2"
              key={option.value}
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

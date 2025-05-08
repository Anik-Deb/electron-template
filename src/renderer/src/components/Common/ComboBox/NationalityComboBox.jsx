/* eslint-disable react/prop-types */
import { Check, ChevronsUpDown, Search } from 'lucide-react'; // Import Search icon
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk';
import { cn } from '@/utils';

export function NationalityComboBox({ List, form }) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  return (
    <FormField
      control={form?.control}
      name="nationality"
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel>Nationality</FormLabel>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-full justify-between border-gray-200 text-gray-950',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value
                    ? List?.find((country) => country.value === field.value)
                        ?.label
                    : 'Select nationality'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] bg-white max-h-[500px] overflow-y-scroll"
              align="start" // Align popover content to the left
              sideOffset={5} // Add some offset from the trigger
            >
              <Command>
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                  <CommandInput
                    placeholder="Search nationality..."
                    className="h-9 w-full placeholder:text-sm border px-2 rounded-md mb-3 focus:ring-0 focus:outline-none pl-8"
                  />
                </div>
                <CommandList>
                  <CommandEmpty className="text-sm text-center">
                    No Country found.
                  </CommandEmpty>
                  <CommandGroup>
                    {List?.map((country) => (
                      <CommandItem
                        value={country.value}
                        key={country.value}
                        onSelect={() => {
                          field.onChange(country.value);
                          setIsPopoverOpen(false);
                        }}
                        className="cursor-pointer text-sm flex flex-row py-1 px-2 hover:bg-gray-50 mb-2 rounded items-center transition-colors" // Hover effect
                      >
                        {country.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            country.value === field.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

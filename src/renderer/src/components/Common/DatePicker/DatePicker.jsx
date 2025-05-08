import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils';
import { format } from 'date-fns';
import React from 'react';

export default function DatePicker({
  field,
  className,
  isDateDisabled,
  ...props
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant={'outline'}
          className={cn(
            'justify-start text-[13px] h-9 px-3 text-left font-normal text-gray-600 hover:border-paragraph border border-input focus:border-primary bg-transparent hover:bg-transparent',
            !field.value && 'text-muted-foreground',
            className
          )}
        >
          {field.value ? (
            format(field.value, 'PP')
          ) : (
            <span className="text-gray-400 font-normal">Choose Date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto bg-white p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={(value) => {
            field.onChange(value);
            setIsOpen(false); // Close the calendar only when a date is selected
          }}
          initialFocus
          disabled={isDateDisabled}
          captionLayout="dropdown-buttons"
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}

/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils';

export function DatePickerWithRange({
  date,
  setDate,
  className,
  triggerButton,
  onDateChange,
  buttonClassName,
  buttonVariant = 'outline', // Default variant is 'outline'
  popoverOpen,
  setPopoverOpen,
}) {
  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
    setPopoverOpen(false);
  };
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          {triggerButton ? (
            triggerButton
          ) : (
            <Button
              id="date"
              variant={buttonVariant}
              className={cn(
                'w-[300px] hover:border-gray-400 hover:bg-transparent',
                !date && 'text-muted-foreground',
                buttonClassName // Apply the custom class passed from the parent
              )}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, yy')} -{' '}
                    {format(date.to, 'LLL dd, yy')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-1 size-3" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// import { DayPicker } from 'react-day-picker'
import React from 'react'
import { cn } from '@/utils'
import { Calendar } from '@/components/ui/calendar'
export function CalenderComponent({ className, disabled, date, setDate }) {
  const formatters = {
    formatWeekdayName: (weekday, options) => {
      // Use 'short' to get three-letter abbreviations
      return weekday.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      formatters={formatters}
      className={cn(className, 'p-0')}
      disabled={disabled}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-2 text-paragraph',
        caption: 'flex relative items-center',
        caption_label: 'text-[14px] text-paragraph font-semibold',
        nav: 'flex items-center',
        nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        nav_button_previous: 'absolute right-7',
        nav_button_next: 'absolute text-primary -right-2',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex gap-1 uppercase mt-2',
        head_cell: 'font-normal text-start text-paragraph rounded-md w-9 text-[13px]',
        row: 'flex gap-1 w-full mt-1',
        cell: 'h-9 w-9 rounded-full text-center text-[11px] p-0 relative [&:has([aria-selected].day-range-end)]:rounded-full [&:has([aria-selected].day-outside)]:bg-primary-100 [&:has([aria-selected])]:bg-primary-100 first:[&:has([aria-selected])]:rounded-full last:[&:has([aria-selected])]:rounded-full focus-within:relative focus-within:z-20',
        day: 'h-9 w-9 border border-primary-50 p-0 font-semibold rounded-full text-primary-950 font-semibold aria-selected:opacity-100',
        day_range_end: 'day-range-end',
        day_selected:
          'rounded-full hover:bg-primary hover:text-primary-950 focus:bg-primary focus:text-primary-950',
        day_today: 'rounded-full',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible'
      }}
    />
  )
}

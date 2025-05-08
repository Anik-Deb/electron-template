/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function ShowHideColumn({ table }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="transparent"
          size="sm"
          className="ml-auto text-gray-500 text-sm font-normal px-2 h-8 border hover:cursor-pointer hover:bg-gray-100"
        >
          Columns
          {isOpen ? (
            <ChevronUpIcon className="ml-2 flex size-4 stroke-gray-400" />
          ) : (
            <ChevronDownIcon className="ml-2 flex size-4 stroke-gray-400" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-medium text-colorVariant-heading">
          Show Columns
        </DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <div key={column.id} className="">
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="flex items-center justify-between gap-2 pl-2 capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id.split('_').join(' ')}
                  <Switch
                    className="h-3 w-5 data-[state=unchecked]:bg-gray-300"
                    thumbClassName="h-2 w-2 data-[state=checked]:translate-x-2"
                    checked={column.getIsVisible()}
                  />
                </DropdownMenuCheckboxItem>
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

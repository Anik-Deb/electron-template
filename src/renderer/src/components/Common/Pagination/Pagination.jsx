/* eslint-disable react/prop-types */
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export function Pagination({ table }) {
  return (
    <div className="flex text-[13px] justify-between  text-paragraph flex-wrap items-center gap-2 py-3 pl-4 pr-8">
      <div className="flex flex-wrap items-center gap-1 space-x-2">
        <p className="text-[14px] font-normal text-paragraph">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-6 w-fit border-none py-1 bg-transparent text-[13px] focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent className="text-[13px] text-paragraph" side="top">
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center ml-4 space-x-2">
        <div className="text-[14px] font-normal text-paragraph">
          Page{' '}
          {table.getPageCount() ? table.getState().pagination.pageIndex + 1 : 0}{' '}
          of {table.getPageCount()}
        </div>
        {/* <div className="flex items-center space-x-2"> */}
        <Button
          variant="secondary"
          size="xs"
          className="size-fit min-w-min bg-transparent"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className={`stroke-paragraph size-5`} />
        </Button>
        <Button
          variant="secondary"
          size="xs"
          className="size-fit min-w-min bg-transparent"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className={`stroke-paragraph size-5`} />
        </Button>
        <Button
          variant="secondary"
          size="xs"
          className="size-fit min-w-min bg-transparent"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className={`stroke-paragraph size-5`} />
        </Button>
        <Button
          variant="secondary"
          size="xs"
          className="size-fit min-w-min bg-transparent"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className={`stroke-paragraph size-5`} />
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import PageTitle from '@/components/Common/PageTitle';
import { Pagination } from '@/components/Common/Pagination/Pagination';
import ShowHideColumn from '@/components/Common/ShowHideColumn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PrintButton from '@/components/Common/PrintScreen/PrintButton';
import PrintContent from '@/components/Common/PrintScreen/PrintContent';
import EmptyComponent from '@/pages/Users/components/empty';

const StaffList = ({ data, columns }) => {
  const componentRef = React.useRef();
  const [sorting, setSorting] = React.useState([{ id: 'id', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <>
      <div className="w-full">
        <div className={`flex justify-between items-end`}>
          <PageTitle title="All Staffs" />
          <div className="flex items-center gap-4">
            {/* Add Receptionists */}
            <div>
              <Link to="/employees/employee/add-staff">
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> New Staff
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white rounded">
          <div className="flex justify-between p-4 items-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-md h-8 px-2">
                <>
                  <Search className="w-4 h-4 stroke-gray-300" />
                  <Input
                    placeholder="Find by email..."
                    onChange={(event) =>
                      table
                        .getColumn('email') //search by email
                        ?.setFilterValue(event.target.value)
                    }
                    className="max-w-[320px] placeholder:text-placeholder bg-transparent border-0 py-0 pl-2 shadow-none focus-visible:ring-0 focus:ring-0
                                    focus-visible:ring-offset-0 h-8 text-xs text-paragraph"
                  />
                </>
              </div>
            </div>
            {/* Show hide columns */}
            <div className="flex items-center gap-3">
              <PrintButton componentRef={componentRef} />
              <ShowHideColumn table={table} />
            </div>
          </div>
          {/* table */}
          <Table className="mt-0.5">
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-0">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="data-[state=selected]:bg-gray-50"
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-0 py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="h-[calc(100vh-53vh)]"
                    colSpan={columns.length}
                  >
                    <EmptyComponent
                      title="No Staff Found!"
                      description="Add new staff to get started."
                      ctaText="New Staff"
                      ctaUrl="/employees/employee/add-staff"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Printable Users */}
          <PrintContent componentRef={componentRef}>
            <div className="print-show text-lg text-center font-semibold py-2 mt-6 border border-b-0 rounded-t">
              Users
            </div>
            <div className="print-show border rounded-b p-px">
              <Table className="text-black mt-0.5">
                <TableHeader className="bg-gray-100 pl-2">
                  {table.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers?.map((header) => {
                        return (
                          <TableHead key={header.id} className="px-0">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="pl-2 border-0">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows?.map((row) => (
                      <TableRow
                        className="data-[state=selected]:bg-gray-50 border-b"
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
                        {row.getVisibleCells()?.map((cell) => (
                          <TableCell key={cell.id} className="p-0 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="h-[calc(100vh-53vh)]"
                        colSpan={columns.length}
                      >
                        <EmptyComponent
                          title="No Staff Found!"
                          description="Add new staff to get started."
                          ctaText="New Staff"
                          ctaUrl="/employees/employee/add-staff"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </PrintContent>
          {/* pagination */}
          <Pagination table={table} />
        </div>
      </div>
    </>
  );
};

export default StaffList;

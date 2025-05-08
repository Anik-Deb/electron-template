import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import ModalTrigger from '@/components/Common/Modal/ModalTrigger';
import PageTitle from '@/components/Common/PageTitle';
import { Pagination } from '@/components/Common/Pagination/Pagination';
import PrintContent from '@/components/Common/PrintScreen/PrintContent';
import ShowHideColumn from '@/components/Common/ShowHideColumn';
import { Dialog } from '@/components/ui/dialog';
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
import AddSMSConfigure from '../AddSMSConfigure';
import StaffEmpty from '../empty/page';

export default function SMSConfigureList({ data, setData, columns }) {
  const componentRef = React.useRef();
  const [sorting, setSorting] = React.useState([{ id: 'id', desc: true }]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
          <PageTitle title="SMSConfigure" />
          <div className="flex items-center gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger className="text-sm">
                <Plus className="stroke-white size-4" /> Add SMS Configure
              </ModalTrigger>
              <AddSMSConfigure
                setIsModalOpen={setIsModalOpen}
                setData={setData}
              />
            </Dialog>
          </div>
        </div>
        <div className="mt-6 bg-white rounded">
          <div className="flex justify-between p-4 items-center">
            <div className="flex items-center border border-border rounded h-8 px-2">
              <Search className="w-4 h-4 stroke-gray-300" />
              <Input
                placeholder="Find with number..."
                onChange={(event) =>
                  table.getColumn('number')?.setFilterValue(event.target.value)
                }
                className="max-w-[320px] placeholder:text-placeholder bg-transparent border-0 py-0 pl-2 shadow-none focus-visible:ring-0 focus:ring-0
                focus-visible:ring-offset-0 h-8 text-xs text-paragraph"
              />
            </div>
            {/* Show hide columns */}
            {/* Show hide columns */}
            <div className="flex items-center gap-3">
              {/* <PrintButton componentRef={componentRef} /> */}
              <ShowHideColumn table={table} />
            </div>
          </div>
          {/* table */}
          <Table className="mt-0.5 rounded">
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
                    <StaffEmpty />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Printable area */}
          <PrintContent componentRef={componentRef}>
            <div className="print-show text-lg text-center font-semibold py-2 mt-6 border border-b-0 rounded-t">
              Staff&apos;s
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
                        <StaffEmpty role={columnFilters[0]} />
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
}

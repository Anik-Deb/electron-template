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
import PrintButton from '@/components/Common/PrintScreen/PrintButton';
import { Dialog } from '@/components/ui/dialog';
import ModalTrigger from '@/components/Common/Modal/ModalTrigger';
import EmptyComponent from '@/pages/Users/components/empty';
import FilterItems from '@/components/Common/FilterItems';

export default function MaintenanceList({ data, columns, setEquipmentData }) {
  const componentRef = React.useRef();
  const [sorting, setSorting] = React.useState([{ id: 'id', desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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

  const filterOptions = [
    { value: 'true', label: 'Active' }, // Represents active (true)
    { value: 'false', label: 'Inactive' }, // Represents inactive (false)
  ];

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-end">
          <PageTitle title="All Equipments" />
          <div className="flex items-center gap-4">
            {/* Add User modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <ModalTrigger>
                <Plus className="w-4 h-4" /> New Item
              </ModalTrigger>
              {/* add form */}
              {/* <AddEquipment
                    setEquipmentData={setEquipmentData}
                    setIsModalOpen={setIsModalOpen}
                  /> */}
            </Dialog>
          </div>
        </div>
        <div className="mt-6 bg-white rounded">
          <div className="flex justify-between p-4 items-center">
            <div className="flex flex-row gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-border rounded-md h-8 px-2">
                  <>
                    <Search className="w-4 h-4 stroke-gray-300" />
                    <Input
                      placeholder="Find by name..."
                      onChange={(event) =>
                        table
                          .getColumn('name')
                          ?.setFilterValue(event.target.value)
                      }
                      className="max-w-[320px] placeholder:text-placeholder bg-transparent border-0 py-0 pl-2 shadow-none focus-visible:ring-0 focus:ring-0
                          focus-visible:ring-offset-0 h-8 text-xs text-paragraph"
                    />
                  </>
                </div>
              </div>
              {/* Filter by Status */}
              <FilterItems
                setColumnFilters={setColumnFilters}
                filterOptions={filterOptions}
                isBooleanFilter={true}
                columnId="is_active" // Filtering by is_active column
                placeholder="Filter"
              />
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
                      title="No Maintainence Items Found!"
                      description="Add new Item to get started."
                      modalButtonText="New Item"
                      setIsModalOpen={setIsModalOpen}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* pagination */}
          <Pagination table={table} />
        </div>
      </div>
    </>
  );
}

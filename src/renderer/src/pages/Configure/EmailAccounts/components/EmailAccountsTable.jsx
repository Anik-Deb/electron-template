import EmptyState from '@/components/Common/EmptyState';
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
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const emptyContent = {
  title: 'Aww! There is nothing here!',
  description:
    'Currently no account available. Add new account to get started!',
  createNew: {
    cta: 'New Account',
    url: '/email-accounts/add-email-accounts',
  },
  icon: '',
};

export default function EmailAccountsTable({ data, columns, setEmailLists }) {
  const [sorting, setSorting] = React.useState([{ id: 'id', desc: true}]);
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
    <div className="w-full">
      <div className={`flex justify-between items-end`}>

        <PageTitle title="Email Accounts" />
        <div className="flex items-center gap-2">
          {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}> */}
          {/* <ModalTrigger> */}
          <Link to="/email-accounts/add-email-accounts">
            <Button variant='primary' className="px-3 text-white font-semibold">
              <Plus className="stroke-white size-4" />
              Add Email Account
            </Button>
          </Link>
          {/* </ModalTrigger> */}
          {/* <CreateEmailAccount /> */}
          {/* </Dialog> */}
        </div>
      </div>
      <div className="mt-6 bg-white rounded">
        <div className="flex justify-between p-4 items-center">
          <div className="flex items-center border border-border rounded h-8 px-2">
          <Search className="w-4 h-4 stroke-gray-300" />
            <Input
              placeholder="Search email list..."
              onChange={(event) =>
                table
                  .getColumn('smtpUserEmail')
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-[320px] placeholder:text-placeholder bg-transparent border-0 py-0 pl-2 shadow-none focus-visible:ring-0 focus:ring-0
          focus-visible:ring-offset-0 h-8 text-xs text-paragraph"
            />
          </div>
          {/* Show hide columns */}
          <div>
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
                  <EmptyState emptyContent={emptyContent} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* pagination */}
        <Pagination table={table} />
      </div>
    </div>
  );
}

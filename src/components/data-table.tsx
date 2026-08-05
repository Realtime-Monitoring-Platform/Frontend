import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  /** When true, pagination is handled server-side */
  manualPagination?: boolean;
  /** Total number of pages (from server) */
  pageCount?: number;
  /** Current pagination state (for server-side) */
  pagination?: { pageIndex: number; pageSize: number };
  /** Callback when pagination changes (for server-side) */
  onPaginationChange?: (updater: any) => void;
  /** Total number of elements (for display) */
  totalElements?: number;
  /** Page size options for the selector */
  pageSizeOptions?: number[];
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  manualPagination = false,
  pageCount,
  pagination,
  onPaginationChange,
  totalElements,
  pageSizeOptions,
  onPageSizeChange,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(manualPagination && pagination ? { pagination } : {}),
    },
    ...(manualPagination
      ? {
          manualPagination: true,
          pageCount,
          onPaginationChange,
        }
      : {}),
  });

  const renderCell = (cell: any) => {
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  };

  const renderHeader = (header: any) => {
    if (header.isPlaceholder) return null;
    return flexRender(header.column.columnDef.header, header.getContext());
  };

  const currentPageSize = pagination?.pageSize ?? table.getState().pagination.pageSize;
  const currentPageIndex = pagination?.pageIndex ?? table.getState().pagination.pageIndex;
  const totalPages = pageCount ?? table.getPageCount();

  const startElement = totalElements
    ? currentPageIndex * currentPageSize + 1
    : 0;
  const endElement = totalElements
    ? Math.min((currentPageIndex + 1) * currentPageSize, totalElements)
    : 0;

  return (
    <div className="w-full">
      {searchKey && (
        <div className="flex items-center py-4">
          <Input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>{renderHeader(header)}</TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{renderCell(cell)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          {totalElements !== undefined && (
            <div className="text-sm text-muted-foreground">
              Showing {startElement}-{endElement} of {totalElements}
            </div>
          )}
          {pageSizeOptions && onPageSizeChange && (
            <Select
              value={String(currentPageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={currentPageSize} />
              </SelectTrigger>
              <SelectContent side="top" align="end">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPageIndex + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

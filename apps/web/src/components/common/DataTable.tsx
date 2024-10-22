import React, { useState } from "react";

import { FiChevronsLeft, FiChevronsRight, FiSearch } from "react-icons/fi";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdownMenu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaArrowsLeftRight } from "react-icons/fa6";

import { Button } from "../ui/button";
import { Filter } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { FaPlus } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";


interface DataTableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  page: number;
  message?: string;
  limit: number;
  additionalTitles?: JSX.Element;
  ColumnsNames?: string[];
  buttonPlaceholder?: string;
  uploadButtonPlaceholder?: string;
  handleUploadButton?: () => void;
  handleButtonPress?: () => void;
  selectable?: boolean;
  type?: string;
  selectedItems?: string[] | null;
  handleItemSelection?: (itemId: string) => void;
  actions?: boolean;
  deleteAction?: boolean;
  addCartItems?: boolean;
  handleQuantityAdditionModal?: (row: Row<T>) => void;
  handleView?: (row: Row<T>) => void;
  handleDelete?: (row: Row<T>) => void;
  loading?: boolean;
  loadingMessage?:string
}

const DataTable = <T extends object>({
  data,
  columns,
  page,
  limit,
  ColumnsNames,
  buttonPlaceholder,
  handleButtonPress,
  selectable,
  message,
  actions,
  deleteAction,
  addCartItems,
  handleQuantityAdditionModal,
  handleView,
  handleDelete,
  uploadButtonPlaceholder,
  handleUploadButton,
  loading,
  loadingMessage,
  handleItemSelection
}: DataTableProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page,
    pageSize: limit,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      columnFilters,
    },
  });

  const [filter, setFilter] = useState<Filter>({ columnName: "" });
  return (
    <div>
      {ColumnsNames && (
        <div className="w-full p-2 rounded-sm border border-gray-200 flex items-center justify-between">
          <div className="flex flex-row items-center gap-1">
            <div className="flex items-center gap-1 border border-gray-200 rounded-sm w-fit pl-1">
              <FiSearch color="black" size={20} />
              <Input
                type="text"
                placeholder="Filter"
                className=" bg-transparent hover:bg-transparent border-none focus-visible:ring-0 text-black pl-2 rounded-sm"
                onChange={(event) => {
                  table
                    .getColumn(filter?.columnName)
                    ?.setFilterValue(event.target.value);
                }}
              />
            </div>
            <h2 className="text-xs text-blue-600">by</h2>
            <div className="flex items-center gap-1 border border-gray-200 rounded-sm w-fit pl-1">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button className="hover:opacity-50 !shadow-none min-w-[100px] w-fit px-2">
                    <h2 className="text-sm font-medium">
                      {filter?.columnName
                        ? filter?.columnName
                        : "No filter selected"}
                    </h2>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-white border-white/30 border rounded-3 sm:w-[200px] w-screen"
                  align="center"
                >
                  <DropdownMenuLabel className="text-black font-semibold text-[14px] leading-[20px] flex justify-between">
                    <div>Columns</div>
                  </DropdownMenuLabel>
                  <DisplayFilters
                    filter={filter}
                    setFilter={setFilter}
                    columnNames={ColumnsNames}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-3">
            { uploadButtonPlaceholder &&
              <Button
                onClick={handleUploadButton}
                variant={"secondary"}
                className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white"
              >
                <FaFileUpload className="text-white" fontSize={14} />
                <h2 className="text-white text-sm">{uploadButtonPlaceholder}</h2>
              </Button>
            }
            {buttonPlaceholder && (
              <Button
                onClick={handleButtonPress}
                variant={"secondary"}
                className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white"
              >
                <FaPlus className="text-white" fontSize={14} />
                <h2 className="text-white text-sm">{buttonPlaceholder}</h2>
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="bg-white pb-3 mb-5 rounded-2xl border mt-5 overflow-hidden">
        <div className="rounded-lg overflow-hidden w-full">
          <Table className="!border-none  rowspacing2 min-w-[824px] w-full">
            <TableHeader className="!border-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border border-gray-200"
                >
                  {selectable && (
                    <TableHead className="!text-center border border-gray-200">
                      select
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="!text-center border border-gray-200"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                  {actions && (
                    <TableHead className="!text-center border border-gray-200">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="!pt-3 !px-[13.5px] !rounded-2xl">
              {loading ? <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[250px] pl-6 py-4 pr-4 text-center"
                  >
                    {loadingMessage}
                  </TableCell>
                </TableRow> : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    // onClick={() => handleShowModal(row)}
                    data-state={row.getIsSelected() && "selected"}
                    className={` ${
                      parseInt(row.id) % 2 === 1 ? "bg-gray-100" : ""
                    } hover:!bg-blue-100`}
                  >
                    {selectable && (
                      <TableCell
                        //@ts-ignore
                        onClick={() =>handleItemSelection? handleItemSelection(row.original._id):()=>{}}
                        className={`!py-3 flex items-center justify-center`}
                      >
                        <Checkbox  />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`!py-3`}
                        onClick={() => {
                          if (
                            cell.id.split("_")[1] !== "Actions" &&
                            cell.id.split("_")[1] !== "Action"
                          ) {
                            addCartItems &&
                              handleQuantityAdditionModal &&
                              handleQuantityAdditionModal(row);

                            handleView && handleView(row);
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            onClick={() => handleView && handleView(row)}
                            className="rounded-full bg-blue-600 w-8 h-8 p-1 border border-blue-600"
                          >
                            <FaArrowsLeftRight
                              className="text-white -rotate-45"
                              fontSize={12}
                            />
                          </Button>
                          {deleteAction && (
                            <Button
                              onClick={() => handleDelete && handleDelete(row)}
                              className="rounded-full w-8 h-8 p-1 border border-red-500"
                            >
                              <MdDeleteForever
                                className="text-red-500"
                                fontSize={16}
                              />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[250px] pl-6 py-4 pr-4 text-center"
                  >
                    {message}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {table.getPageCount() > 1 && (
          <div className="flex justify-center w-full mt-[17px] mb-[12px]">
            <div className="flex items-center gap-3">
              <Button
                className="p-[10px] bg-[#f1f1f1] !font-fredoka border border-[#272625]"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FiChevronsLeft className="text-[#7f7f7f]" />
              </Button>
              {Array.from(
                { length: table.getPageCount() },
                (_, i) => i + 1
              ).map((page, idx) => (
                <Button
                  key={idx}
                  className={`rounded-lg !font-fredoka border leading-[16.8px] border-[#292828] px-[15px] py-[10px] ${
                    table.getState().pagination.pageIndex === idx
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-[#686868]"
                  }`}
                  onClick={() => table.setPageIndex(idx)}
                >
                  {page}
                </Button>
              ))}
              <Button
                className="p-[10px] bg-[#f1f1f1] !font-fredoka border border-[#272625]"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FiChevronsRight className="text-[#7f7f7f]" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;

export const DisplayFilters = ({
  filter,
  setFilter,
  columnNames,
}: {
  filter: Filter | undefined;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  columnNames: string[];
}) => {
  return (
    <div>
      <div className="flex flex-col gap-2 mt-1">
        {columnNames.map((column, idx) => {
          return (
            <div
              key={idx}
              className="font-normal flex items-center gap-3 text-[14px] leading-[20px] text-black py-1.5 px-2"
            >
              <Checkbox
                id={column.toLowerCase()}
                onCheckedChange={(checked) => {
                  if (checked) setFilter({ columnName: "" });
                  setFilter({ columnName: column });
                }}
                checked={
                  filter?.columnName.toLocaleLowerCase() ===
                  column.toLocaleLowerCase()
                }
              />
              <label
                htmlFor={column.toLowerCase()}
                className="capitalize text-black"
              >
                {column}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { items } from '@/types';
import { displayNumbers } from '@/utils/usableFunc';
import { ColumnDef } from '@tanstack/react-table';

export const CartColumns: ColumnDef<items>[] = [
  {
    accessorKey: 'name',
    header: 'Item Name',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original.name}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original.quantity.toString()}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Unit Price',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {displayNumbers(row.original.unitPrice)} frw
        </h2>
      </div>
    ),
  },
  {
    header: 'Total Price',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {displayNumbers(row.original.unitPrice * row.original.quantity)} frw
        </h2>
      </div>
    ),
  },
];

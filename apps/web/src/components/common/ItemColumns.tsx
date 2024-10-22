import { items } from '@/types';
import { cn } from '@/utils/tw-merge';
import { displayNumbers } from '@/utils/usableFunc';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';

export const ItemsColumns: ColumnDef<items>[] = [
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
          {row.original.quantity?.toString()}
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
  {
    accessorKey: 'expirationDate',
    header: 'Expiration Date',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {moment(row.original.expirationDate).format('YYYY-MM-DD')=="Invalid date"?"":moment(row.original.expirationDate).format('YYYY-MM-DD')}
        </h2>
      </div>
    ),
  },
  {
    header: 'In Stock',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2
          className={cn(
            'text-xs font-normal text-white px-2 py-1 rounded-full',
            row.original.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
          )}
        >
          {row.original.quantity > 0 ? 'In Stock' : 'Out Of Stock'}
        </h2>
      </div>
    ),
  },
];

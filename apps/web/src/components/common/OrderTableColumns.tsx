import {
  checkOrderStock,
  findTotalPricePerOrder,
  formatTimeAgo,
} from '@/utils/usableFunc';
import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types';
import { cn } from '@/utils/tw-merge';
import { Button } from '@/components/ui/button';
import { BsThreeDotsVertical } from 'react-icons/bs';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'retail_id',
    header: 'Retailer',
    cell: () => (
      <div className="flex items-center justify-center gap-1">
        {/* profile pic */}
        <div className="w-6 h-6 rounded-sm"></div>
        <h2 className="text-sm font-normal capitalize text-[#707070]">
          Stainless clothes
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'order_id',
    header: 'Order Number',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal capitalize text-[#707070]">
          #{row.original.order_id}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#707070]">
          {formatTimeAgo(new Date(row.original.createdAt))}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'item_details',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#707070]">
          frw {findTotalPricePerOrder(row.original.item_details)}
        </h2>
      </div>
    ),
  },
  {
    header: 'In stock',
    cell: ({ row }) => {
      const lowStockCount = checkOrderStock(row.original.item_details);
      return (
        <div className="flex items-center justify-center">
          {lowStockCount === 0 ? (
            <h2 className={cn('text-sm font-normal text-[#83ec8b]')}>All</h2>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-sm font-normal text-red-700">
                {lowStockCount} items
              </h2>
              <h2 className="text-sm font-normal text-red-700">
                low in the stock
              </h2>
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: '',
    accessorKey: 'customView',
    cell: () => (
      <div className="flex items-center justify-center">
        <Button
          className="py-2 px-3 rounded-sm border border-[#5aa5c1]"
          variant={'outline'}
        >
          <h2 className="text-sm font-normal text-[#5aa5c1]">View Order</h2>
        </Button>
      </div>
    ),
  },
  {
    header: 'Action',
    cell: () => (
      <div className="flex items-center justify-center">
        <Button className="py-2 px-3 rounded-sm bg-[#253463]">
          <h2 className="text-sm font-normal text-white">Accept</h2>
        </Button>
      </div>
    ),
  },
  {
    header: '',
    accessorKey: 'customKey',
    cell: () => (
      <Popover>
        <PopoverTrigger asChild>
          <Button className="!p-2 !shadow-sm !rounded-full">
            <BsThreeDotsVertical fontSize={24} className="text-black/55" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 bg-white mr-2">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2"></div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
];

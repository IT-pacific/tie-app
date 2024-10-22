import { displayNumbers } from '@/utils/usableFunc';
import { ColumnDef } from '@tanstack/react-table';
import { Order } from '@/types';
import { cn } from '@/utils/tw-merge';
import moment from 'moment';

export const OrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'retail_id',
    header: 'Customer',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original.retail_id?.companyName}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'order_id',
    header: 'Order Number',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original.order_id.toString()}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'item_details',
    header: 'Total Cost',
    cell: ({ row }) => {
      // Calculate the total price
      const totalPrice = row.original.item_details.reduce((total, item) => {
        return total + item.unitPrice * item.quantity;
      }, 0);
      return (
        <div className="flex items-center justify-center">
          <h2 className="text-sm font-normal text-[#545454]">
            {displayNumbers(totalPrice)} frw
          </h2>
        </div>
      );
    },
  },
  {
    accessorKey: 'total_quantity',
    header: 'Total Quantity',
    cell: ({ row }) => {
      const totalQuantity = row.original.item_details.reduce((total, item) => {
        return total + Number(item.quantity);
      }, 0);
      return (
        <div className="flex items-center justify-center">
          <h2 className="text-sm font-normal text-[#545454]">
            {totalQuantity}
          </h2>
        </div>
      );
    },
  },
  {
    accessorKey: 'item_details',
    header: 'Total Items',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original.item_details.length}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2
          className={cn(
            'text-xs font-normal text-white px-2 py-1 rounded-full',
            row.original.status === 'confirmed'
              ? 'bg-green-500'
              : row.original.status === 'pending'
                ? 'bg-yellow-500'
                : 'bg-red-500'
          )}
        >
          {row.original.status}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {moment(row.original.createdAt).format('yyyy-MM-DD')}
        </h2>
      </div>
    ),
  },
];

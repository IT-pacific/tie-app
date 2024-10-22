import moment from 'moment';
import { Link } from '@/types';
import { cn } from '@/utils/tw-merge';
import { ColumnDef } from '@tanstack/react-table';

export const SpecificLinkColumns: ColumnDef<Link>[] = [
  {
    accessorKey: '_id',
    header: 'Link ID',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {row.original._id}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expiry Date/ Time',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {moment(row.original.expiresAt).format('YYYY-MM-DD')}
        </h2>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <h2
            className={cn(
              'text-sm font-normal text-[#545454]',
              row.original.status === 'expired'
                ? 'text-red-500'
                : 'text-green-500'
            )}
          >
            {row.original.status}
          </h2>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <h2 className="text-sm font-normal text-[#545454]">
          {moment(row.original.createdAt).format('YYYY-MM-DD')}
        </h2>
      </div>
    ),
  },
];

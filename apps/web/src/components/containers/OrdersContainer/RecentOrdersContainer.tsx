import DataTable from '@/components/common/DataTable';
import { OrderColumns } from '@/components/common/OrderColumns';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types';
import { Row } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import OrderModal from '../OrderModals/OrderModal';
import { AppDispatch, AppState, useAppSelector } from '@/store/store';
import { useDispatch } from 'react-redux';
import { fetchOrdersFromBackend } from '@/store/actions/orderActions';
import { Loading } from '@/components/common/Loading';

const RecentOrdersContainer = ({
  hideFilter = false,
}: {
  hideFilter?: boolean;
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { orders, isLoading } = useAppSelector(
    (state: AppState) => state.order
  );

  const ColumnsName = [
    'customer',
    'order_number',
    'total_cost',
    'total_quantity',
    'total_items',
    'status',
    'Date',
  ];
  const dispatch = useDispatch<AppDispatch>();
  const handleDialogOpen = (row: Row<Order>) => {
    const selectedRow = row.original;
    setSelectedOrder(selectedRow);
    setShowDialog(true);
  };
  useEffect(() => {
    dispatch(fetchOrdersFromBackend());
  }, [dispatch]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center gap-[20px] justify-center">
        <Loading color="fill-blue-600" /> loading
      </div>
    );
  }
  return (
    <div>
      <Tabs defaultValue="pending">
        {!hideFilter ? (
          <TabsList className=" gap-4">
            <TabsTrigger value="pending" className="hover:border-b-gray-500">
              Pending
            </TabsTrigger>
            <TabsTrigger value="rejected" className="hover:border-b-gray-500">
              rejected
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="hover:border-b-gray-500">
              confirmed
            </TabsTrigger>
            <TabsTrigger value="payment-pending" className="hover:border-b-gray-500">
              Pending Payment
            </TabsTrigger>
            <TabsTrigger value="completed" className="hover:border-b-gray-500">
              Completed
            </TabsTrigger>
          </TabsList>
        ) : (
          ''
        )}

        <TabsContent value="pending">
          <DataTable<Order>
            columns={OrderColumns}
            data={
              orders
                ? hideFilter
                  ? orders.slice(0, 8)
                  : orders.filter((order) => order.status === 'pending')
                : []
            }
            message="no pending orders yet"
            limit={!hideFilter ? 4 : 8}
            page={0}
            ColumnsNames={ColumnsName}
            type="OrderType"
            actions
            handleView={handleDialogOpen}
          />
        </TabsContent>
        <TabsContent value="rejected">
          <DataTable<Order>
            columns={OrderColumns}
            data={
              orders
                ? orders.filter((order) => order.status === 'rejected')
                : []
            }
            message="No Rejected orders yet"
            limit={4}
            page={0}
            ColumnsNames={ColumnsName}
            type="OrderType"
            actions
            handleView={handleDialogOpen}
          />
        </TabsContent>
        <TabsContent value="confirmed">
          <DataTable<Order>
            columns={OrderColumns}
            data={
              orders
                ? orders.filter((order) => order.status === 'confirmed')
                : []
            }
            message="No Confirmed orders Yet"
            limit={4}
            page={0}
            ColumnsNames={ColumnsName}
            type="OrderType"
            actions
            handleView={handleDialogOpen}
          />
        </TabsContent>
        <TabsContent value="payment-pending">
          <DataTable<Order>
            columns={OrderColumns}
            data={
              orders
                ? orders.filter((order) => order.status === 'payment-pending')
                : []
            }
            message="No payment pending orders Yet"
            limit={4}
            page={0}
            ColumnsNames={ColumnsName}
            type="OrderType"
            actions
            handleView={handleDialogOpen}
          />
        </TabsContent>
        <TabsContent value="completed">
          <DataTable<Order>
            columns={OrderColumns}
            data={
              orders
                ? orders.filter((order) => order.status === 'completed')
                : []
            }
            message="No completed orders Yet"
            limit={4}
            page={0}
            ColumnsNames={ColumnsName}
            type="OrderType"
            actions
            handleView={handleDialogOpen}
          />
        </TabsContent>
      </Tabs>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {selectedOrder && (
          <OrderModal
            setShowDialog={setShowDialog}
            selectedRow={selectedOrder}
          />
        )}
      </Dialog>
    </div>
  );
};

export default RecentOrdersContainer;

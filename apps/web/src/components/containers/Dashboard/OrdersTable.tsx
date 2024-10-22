import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable from '@/components/common/DataTable';
import { columns } from '@/components/common/OrderTableColumns';
// import { orders } from '@/constants/Orders';

const OrdersTable = () => {

  const ColumnsNames = ['time', 'amount', 'in stock', 'order_id'];

  return (
    <div className="w-[calc(100vw-45px)] xl:w-[calc(100vw-315px)] overflow-x-scroll noScrollbar pt-5">
      <Tabs defaultValue="orders">
        <TabsList className=" gap-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
        </TabsList>
        {/* <TabsContent value="orders">
          <DataTable
            columns={columns}
            data={orders}
            page={0}
            limit={6}
            ColumnsNames={ColumnsNames}
          />
        </TabsContent> */}
        
      </Tabs>
    </div>
  );
};

export default OrdersTable;

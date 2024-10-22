import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecentOrdersContainer from '@/components/containers/OrdersContainer/RecentOrdersContainer';
import GeneralLinkContainer from '@/components/containers/GeneralLink/GeneralLinkContainer';
import SpecialLinks from '@/components/containers/SpecialLink/SpecialLinks';
import { AppState, useAppSelector } from '@/store/store';

const Orders = () => {
  const { user } = useAppSelector((state: AppState) => state.auth);
  const isOperator = user?.role === 'operator';
  return (
    <main className="h-full p-5">
      <Tabs defaultValue="orders">
        <TabsList className=" gap-4">
          <TabsTrigger value="orders">
            {isOperator ? 'Your Recent Orders' : 'Recent Orders'}
          </TabsTrigger>
          <TabsTrigger value="generalLinks">
            {isOperator ? 'General Links' : 'Create General Links'}
          </TabsTrigger>
          <TabsTrigger value="specificLinks">
            {isOperator ? 'Your Specific Links' : 'Create Specific Links'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <RecentOrdersContainer />
        </TabsContent>
        <TabsContent value="generalLinks">
          <GeneralLinkContainer />
        </TabsContent>
        <TabsContent value="specificLinks">
          <SpecialLinks />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Orders;

import React, { useEffect }  from "react";
import MainHeader from "@/components/common/MainHeader";
import StatsContainer from "@/components/containers/Dashboard/StatsContainer";
// import OrdersTable from "@/components/containers/Dashboard/OrdersTable";
import OrdersChartsContainer from "@/components/containers/Dashboard/OrdersChartsContainer";
import OrderRevenueGraphContainer from "@/components/containers/Dashboard/OrderRevenueGraphContainer";
import { AppDispatch, AppState, useAppSelector } from "@/store/store";
import { useDispatch } from "react-redux";
import { getAnalytics } from "@/store/actions/analyticActions";
import RecentOrdersContainer from "@/components/containers/OrdersContainer/RecentOrdersContainer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loading } from "@/components/common/Loading";
const Dashboard = () => {
  const { analytic,isLoading} = useAppSelector((state: AppState) => state.analytic);
  const dispatch=useDispatch<AppDispatch>()
  useEffect(() => {

    if (!analytic) dispatch(getAnalytics());
  }, [dispatch]);
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center gap-[20px] justify-center">
 <Loading color="fill-blue-600"/> loading
      </div>
    )
  }
  return (
    <div className="h-full p-5">
      <div className="flex flex-col lg:flex-row w-full gap-5">
        {/* Dashboard */}
        <div className=" w-full lg:w-[80%] flex flex-col gap-5">
          <MainHeader heading={"Dashboard"} />
          {/* stats cards */}
          <StatsContainer totalOrders={analytic?.totalOrders?analytic?.totalOrders:0} totalSale={analytic?.totalSales?analytic?.totalSales:0} totalInventory={analytic?.totalInventory?analytic?.totalInventory:0} totalCorporate={analytic?.totalCorporate?analytic?.totalCorporate:0} />
          {/* revenue chart */}
          <OrderRevenueGraphContainer graphData={analytic?.orderStatics?analytic.orderStatics:[]}/>
        </div>
        {/* total orders */}
        <OrdersChartsContainer orderAnalytic={analytic?.orderAnalytic?analytic.orderAnalytic:{confirmed:0,rejected:0,pending:0,cancelled:0}}  activeVsComplete={analytic?.activeVsComplete?analytic.activeVsComplete:{active:0,complete:0}} />
      </div>
      {/* orders table */}
      <Tabs defaultValue="orders">
        <TabsList className=" gap-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
        <RecentOrdersContainer hideFilter={true} />
        </TabsContent>
        <TabsContent value="payments">
        <RecentOrdersContainer hideFilter={true} />
        </TabsContent>
      </Tabs>
     
    </div>
  );
};

export default Dashboard;

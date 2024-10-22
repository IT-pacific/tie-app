import React, { Suspense } from 'react';
import Stat from '@/components/common/Stat';
import { DonutChart } from './DonutChart';
import { ChartConfig } from '@/components/ui/chart';

const ScaledDonutChart = React.lazy(
  () => import('@/components/common/ScaledDonut')
);

// Define the types for the props
interface OrdersChartsContainerProps {
  orderAnalytic?: {
    rejected: number;
    pending: number;
    cancelled: number;
    confirmed: number;
  };
  activeVsComplete?: {
    active: number;
    complete: number;
  };
}

// Define the type for chart data items
interface ChartData {
  status: string;
  orders: number;
  fill: string;
}

const OrdersChartsContainer: React.FC<OrdersChartsContainerProps> = ({
  activeVsComplete,
  orderAnalytic,
}) => {
  const chartConfig: ChartConfig = {
    confirmed: {
      label: 'confirmed',
      color: '#8566F2',
    },
    active: {
      label: 'Active',
      color: '#d0d0d0',
    },
    pending: {
      label: 'Pending',
      color: '#d0d0d0',
    },
    rejected: {
      label: 'Rejected',
      color: '#f87171',
    },
    cancelled: {
      label: 'Cancelled',
      color: '#eeeeee',
    },
    complete: {
      label: 'confirmed',
      color: '#10b981',
    },
  };

  const orderAnalyticGraphData: ChartData[] = orderAnalytic
    ? (
        Object.entries(orderAnalytic) as [keyof typeof orderAnalytic, number][]
      ).map(([status, orders]) => ({
        status,
        orders,
        fill: chartConfig[status]?.color || '#000',
      }))
    : [];

  const totalAnalyticGraph =
    (orderAnalytic?.cancelled ? orderAnalytic.cancelled : 0) +
    (orderAnalytic?.confirmed ? orderAnalytic?.confirmed : 0) +
    (orderAnalytic?.rejected ? orderAnalytic?.rejected : 0) +
    (orderAnalytic?.pending ? orderAnalytic?.pending : 0);
  const activeVsCompleteGraphData: ChartData[] = activeVsComplete
    ? (
        Object.entries(activeVsComplete) as [
          keyof typeof activeVsComplete,
          number,
        ][]
      ).map(([status, orders]) => ({
        status,
        orders,
        fill: chartConfig[status]?.color || '#000',
      }))
    : [];
  const totalActiveComplete =
    (activeVsComplete?.active ? activeVsComplete.active : 0) +
    (activeVsComplete?.complete ? activeVsComplete?.complete : 0);

  return (
    <div className="flex flex-col gap-5 w-full lg:w-[20%]">
      <h2 className="text-lg text-[#d0d0d0] capitalize font-medium">
        Total Orders
      </h2>
      <div className="flex flex-col sm:flex-row lg:flex-col w-full gap-5">
        <div className="relative w-full rounded-lg border-2 border-gray-300 p-4 flex flex-col justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <DonutChart
              total={totalActiveComplete}
              chartData={activeVsCompleteGraphData}
              chartConfig={chartConfig}
            />
          </Suspense>
          <div className="right-5 flex justify-between">
            <Stat color="text-[#d0d0d0]" status="Active Orders" />
            <Stat color="text-[#10b981]" status="Completed Orders" />
          </div>
        </div>
        <div className="relative w-full rounded-lg border-2 border-gray-300 p-4 flex flex-col justify-between">
          <Suspense fallback={<div>Loading...</div>}>
            <DonutChart
              total={totalAnalyticGraph}
              chartData={orderAnalyticGraphData}
              chartConfig={chartConfig}
            />
          </Suspense>
          <div className="left-5 right-5 grid grid-cols-2 gap-[2px]">
            <div>
              <Stat color="text-[#f87171]" status="Rejected" />
              <Stat color="text-[#8566F2]" status="confirmed" />
            </div>
            <div>
              <Stat color="text-[#d0d0d0]" status="Pending" />
              <Stat color="text-[#eeeeee]" status="Cancelled" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersChartsContainer;

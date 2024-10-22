import Stat from "@/components/common/Stat";
import { displayNumbers } from "@/utils/usableFunc";
import { OrderRevenueChart } from "./OrderRevenueChart";
import { PaidAndNotPaidData } from "@/types";

const OrderRevenueGraphContainer = ({ graphData }: { graphData: PaidAndNotPaidData[] }) => {
  return (
    <div className="flex-1 rounded-lg border-2 border-gray-300 p-4">
      <div className="flex  justify-between">
        <h2 className="text-lg font-medium text-black">Order/Revenue</h2>
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-[1px] items-end">
            <Stat color="text-[#2b3654]" status="RECIEVED ORDERS" />
            <h2 className="text-base font-semibold">845</h2>
          </div>
          <div className="flex flex-col gap-[1px] items-end">
            <Stat color="text-[#2386bc]" status="RECIEVED PAYMENTS" />
            <h2 className="text-base font-semibold">
              Frw {displayNumbers(239600)}
            </h2>
          </div>
        </div>
      </div>
      <OrderRevenueChart chartData={graphData} />
      
    </div>
  );
};

export default OrderRevenueGraphContainer;

import React from 'react'
import StatsCard from "@/components/common/StatsCard";
import { FaBoxesStacked } from "react-icons/fa6";
import { FiBarChart2 } from "react-icons/fi";
import { IoRefresh } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";

const StatsContainer = ({totalOrders,totalSale,totalInventory,totalCorporate}:{totalOrders:number,totalSale:number,totalInventory:number,totalCorporate:number}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              title="Total Orders"
              icon={<FaBoxesStacked />}
              money={false}
              amount={totalOrders}
              trend
              trendValue={4.07}
            />
            <StatsCard
              title="Total Sales"
              icon={<FiBarChart2 />}
              money={true}
              amount={totalSale}
              trend
              trendValue={4.07}
            />
            <StatsCard
              title="Total inventory"
              icon={<IoRefresh />}
              money={true}
              amount={totalInventory}
              trend={false}
              trendValue={1.64}
            />
            <StatsCard
              title="Total Coorporates"
              icon={<FaUsers />}
              money={false}
              amount={totalCorporate}
              trend
              trendValue={4.07}
            />
          </div>
  )
}

export default StatsContainer
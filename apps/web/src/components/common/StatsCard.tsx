import { cn } from "@/utils/tw-merge";
import { displayNumbers, formatPercentage } from "@/utils/usableFunc";
import React from "react";
import { PiTrendDown, PiTrendUp } from "react-icons/pi";

type Props = {
  title: string;
  icon: React.ReactNode;
  amount: number;
  money?: boolean;
  trend: boolean;
  trendValue: number;
};

const StatsCard = ({
  title,
  icon,
  amount,
  money = true,
  trend,
  trendValue,
}: Props) => {
  return (
    <div className="p-4 rounded-lg border-2 border-gray-300 flex flex-col gap-4">
      {/* heading */}
      <div className="flex items-center justify-between">
        {/* stat header */}
        <h2 className="text-sm font-normal text-[#d0d0d0] capitalize">{title}</h2>
        {/* icon */}
        <div className="w-8 h-8 rounded-full bg-[#eaf4fc] text-[#93d6f8] text-base flex items-center justify-center">
          {icon}
        </div>
      </div>
      {/* stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl xl:text-2xl font-semibold text-black">
          <span>{money ? "Frw" : ""}</span>{" "}
          {displayNumbers(amount)}
        </h2>
        <div className="flex items-center gap-1">
          {trend ? (
            <PiTrendUp fontSize={16} className="text-[#50d7a3]" />
          ) : (
            <PiTrendDown fontSize={16} className="text-[#d04d58]" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend ? "text-[#50d7a3]" : "text-[#d04d58]"
            )}
          >
            {formatPercentage(trendValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

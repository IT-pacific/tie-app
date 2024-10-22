import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PaidAndNotPaidData } from "@/types"

export const description = "A multiple bar chart"

const chartData = [
  { month: "January", totalOrder: 186, paidOrder: 13 },
  { month: "February", totalOrder: 305, paidOrder: 200 },
  { month: "March", totalOrder: 237, paidOrder: 120 },
  { month: "April", totalOrder: 73, paidOrder: 190 },
  { month: "May", totalOrder: 209, paidOrder: 130 },
  { month: "June", totalOrder: 214, paidOrder: 140 },
]

const chartConfig = {
  totalOrder: {
    label: "Total Order",
    color: "#2563eb",
  },
  paidOrder: {
    label: "Paid Order",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export function OrderRevenueChart({chartData}:{chartData:PaidAndNotPaidData[]}) {
  return (
    <div className="w-full">
    
        <ChartContainer className=" h-[300px] w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="totalOrders" fill="var(--color-totalOrder)" radius={4} />
            <Bar dataKey="paidOrders" fill="var(--color-paidOrder)" radius={4} />
          </BarChart>
        </ChartContainer>
     
    </div>
  )
}

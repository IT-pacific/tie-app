import React from "react";
import Chart from "react-apexcharts";

const ScaledDonutChart = ({ percentage }: { percentage: string }) => {
  return (
    <Chart
      options={{
        chart: {
          id: "multi-segment-donut",
          toolbar: {
            show: false,
          },
        },
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: {
          width: 0,  // Thicker outer ring // Small gap between segments
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            gradientToColors: ["#00CBE6", "#1F3BB3", "#FECBDB"], // Gradient for each segment
            stops: [0, 50, 100],
          },
        },
        colors: ["#00A5E6", "#1E2B79", "#00CBE6", "#FECBDB"],  // Specific segment colors (cyan, dark blue, light blue, pink)
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
                size: "75%",  // Thicker ring size
              labels: {
                show: true,
                name: {
                  show: false,
                },
                value: {
                  show: true,
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#3c8fbe",  // Blue color for percentage
                  formatter: (val: string) => `${val}%`,
                },
                total: {
                  show: true,
                  label: `${percentage}%`,
                  color: "#3c8fbe",
                  fontSize: "22px",
                  fontWeight: "bold",
                  formatter: () => `${percentage}%`,
                },
              },
            },
          },
        },
        labels: ["Main Progress", "Dark Blue Section", "Light Blue Section", "Pink Section"],  // Segment labels
      }}
      series={[
        Number(percentage),         // Main segment (e.g., 73%)
        100 - parseFloat((Number(percentage) / 1.5).toFixed(2)),  // Other segments distributed accordingly
        15,                          // Smaller segment (e.g., Light Blue)
        10,                          // Another small segment (e.g., Pink)
      ]}
      type="donut"
      height={"100%"}
      width={"100%"}
    />
  );
};

export default ScaledDonutChart;

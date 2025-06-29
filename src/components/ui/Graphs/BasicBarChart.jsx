import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import TopBar from "../TopBar";

const BasicBarChart = () => {
  return (
    <div className="w-full border-2 mt-5 rounded-lg p-4 sm:p-5">
      <TopBar title="Financial Progress per project" />
      <div className="overflow-x-auto">
        <BarChart
          xAxis={[{ data: ["group A", "group B", "group C"] }]}
          series={[
            { data: [4, 3, 5], label: "Total Amount", color: "#1D4ED8" },
            { data: [1, 6, 3], label: "Paid", color: "#FDBA74" },
            { data: [2, 5, 6], label: "Balance", color: "#EF4444" },
          ]}
          height={300}
          slots={{
            bar: (props) => {
              const radius = 20;
              const { x, y, width, height, ownerState, ...restProps } = props;
              const safeRadius = Math.min(radius, height / 2);

              const d = `
                M${x},${y + safeRadius}
                a${safeRadius},${safeRadius} 0 0 1 ${safeRadius},${-safeRadius}
                h${width - 2 * safeRadius}
                a${safeRadius},${safeRadius} 0 0 1 ${safeRadius},${safeRadius}
                v${height - safeRadius}
                h${-width}
                z
              `;

              return <path d={d} fill={ownerState.color} {...restProps} />;
            },
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4">
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Total Amount
          <span className="w-4 h-4 inline-block bg-blue-700 rounded-sm"></span>
        </p>
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Paid
          <span className="w-4 h-4 inline-block bg-orange-300 rounded-sm"></span>
        </p>
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Balance
          <span className="w-4 h-4 inline-block bg-red-500 rounded-sm"></span>
        </p>
      </div>
    </div>
  );
};

export default BasicBarChart;

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
            { data: [4, 3, 5] },
            { data: [1, 6, 3] },
            { data: [2, 5, 6] },
          ]}
          height={300}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4">
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Total Amount
          <span className="py-1 px-4 bg-blue-700 rounded-sm"></span>
        </p>
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Paid
          <span className="py-1 px-4 bg-orange-300 rounded-sm"></span>
        </p>
        <p className="flex items-center gap-2 text-sm sm:text-base">
          Balance
          <span className="py-1 px-4 bg-red-500 rounded-sm"></span>
        </p>
      </div>
    </div>
  );
};

export default BasicBarChart;

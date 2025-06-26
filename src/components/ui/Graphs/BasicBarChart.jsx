import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import TopBar from "../TopBar";

const BasicBarChart = () => {
  return (
    <div className=" w-full border-2 mt-5  rounded-lg p-5">
        <TopBar title="Financial Progress per project" />
      <BarChart
        xAxis={[{ data: ["group A", "group B", "group C"] }]}
        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
        height={300}
      />
      <div className="flex gap-5">
        <p className=" flex gap-2">Total Amount <span className=" py-1 px-4 bg-blue-700"></span></p>
        <p className=" flex gap-2">Paid <span className=" py-1 px-4 bg-orange-300"></span></p>
        <p className=" flex gap-2">Balance <span className=" py-1 px-4 bg-red-500"></span></p>
      </div>
    </div>
  );
};

export default BasicBarChart;

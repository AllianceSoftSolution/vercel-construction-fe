import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, valueFormatter } from "./dataset/weather";
import TopBar from "../TopBar";

const chartSetting = {
  height: 250,
};

export default function VertcleBarChart({title}) {
  return (
    <div className=" w-full border-2 mt-5  rounded-lg p-5">
      <TopBar title={title} />
      <BarChart
        dataset={dataset}
        // yAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={[{ dataKey: "seoul", label: "Seoul rainfall", valueFormatter }]}
        layout="horizontal"
        grid={{ vertical: true }}
        {...chartSetting}
      />
    </div>
  );
}
zzz
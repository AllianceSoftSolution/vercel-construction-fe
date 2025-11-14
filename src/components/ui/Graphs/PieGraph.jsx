import * as React from "react";
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import TopBar from "../TopBar";

export default function PieGraph({ pieTitle, data = [] }) {
  // Safety check: don't render if data is empty or invalid
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="max-w-lg w-full border-2 mt-5 rounded-lg p-5">
        <TopBar title={pieTitle} />
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full border-2 mt-5 rounded-lg p-5">
      <TopBar title={pieTitle} />
      <Stack direction="row" flexWrap="wrap">
        <PieChart
          series={[
            {
              paddingAngle: 5,
              innerRadius: 60,
              outerRadius: 80,
              cornerRadius: 12,
              data,
            },
          ]}
          width={200}
          height={200}
          hideLegend
        />
      </Stack>
      <div className="flex justify-between">
        {data.map((d) => (
          <p className="flex flex-col" key={d.label}>
            <span className="text-3xl">{d.value}</span> {d.label}
          </p>
        ))}
      </div>
    </div>
  );
}

import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import TopBar from "../TopBar";

const CHART_COLORS = [
  "#22c55e",
  "#ef4444",
  "#f59e42",
  "#eab308",
  "#8b5cf6",
  "#0ea5e9",
  "#0252AD",
  "#7a0b4a",
  "#f97316",
  "#06b6d4",
];

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

  const coloredData = data.map((d, i) => ({
    ...d,
    color: d.color || CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="max-w-lg w-full border-2 mt-5 rounded-lg p-5">
      <TopBar title={pieTitle} />
      <div className="flex items-center justify-center">
        <PieChart
          series={[
            {
              paddingAngle: 5,
              innerRadius: 60,
              outerRadius: 80,
              cornerRadius: 12,
              data: coloredData,
            },
          ]}
          width={220}
          height={220}
          hideLegend
        />
      </div>
      <ul className="mt-4 w-full space-y-2">
        {coloredData.map((d) => (
          <li key={d.label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-sm text-gray-700">
                {d.label.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-sm font-semibold">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

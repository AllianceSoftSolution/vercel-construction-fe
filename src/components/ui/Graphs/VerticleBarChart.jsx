import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, valueFormatter } from "./dataset/weather";
import TopBar from "../TopBar";

const chartSetting = {
  height: 250,
};

export default function VertcleBarChart({ verTitle }) {
  return (
    <div className=" w-full border-2 mt-5  rounded-lg p-5">
      <TopBar title={verTitle} />
      <BarChart
        dataset={dataset}
        // yAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={[{ dataKey: "seoul", label: "Seoul rainfall", valueFormatter }]}
        layout="vertical"
        grid={{ vertical: true }}
        {...chartSetting}
        slots={{
          bar: (props) => {
            const radius =20; 
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
  );
}

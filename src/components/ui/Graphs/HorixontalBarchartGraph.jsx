import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, valueFormatter } from "./dataset/weather";
import TopBar from "../TopBar";

const chartSetting = {
  height: 250,
};

export default function VertcleBarChart({ title }) {
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
        slots={{
          bar: (props) => {
            const radius = 12;
            const { x, y, height, width, ownerState, ...restProps } = props;
            const d = `M${x},${y} h${
              width - radius
            }a${radius},${radius} 0 0 1 ${radius},${radius} v${
              height - 2 * radius
            } a${radius},${radius} 0 0 1 ${-radius},${radius} h${
              radius - width
            }z`;
            return <path d={d} fill={ownerState.color} {...restProps} />;
          },
        }}
      />
    </div>
  );
}

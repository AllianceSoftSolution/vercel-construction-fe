import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import TopBar from "../TopBar";

const chartSetting = {
  height: 250,
};

export default function HorixontalBarchartGraph({ title, dataset = [], series = [{ dataKey: "value", label: "Value" }] }) {
  return (
    <div className=" w-full border-2 mt-5  rounded-lg p-5">
      <TopBar title={title} />
      <BarChart
        dataset={dataset}
        series={series}
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

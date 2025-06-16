import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { formatToK } from "../modules/helpers";
const ConversionsBarChart = ({ data }) => {
  const ChartData = [
    {
      name: `${data?.sent?.count} Sent`,
      "Number of proposals": data?.sent?.count,
      value: formatToK(data?.sent?.total),
    },
    {
      name: `${data?.accepted?.count} Accepted`,
      "Number of proposals": data?.accepted?.count,
      value: formatToK(data?.sent?.total),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={200} className="pp">
      <BarChart
        data={ChartData}
        // width={300}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={50} // Set the bar size
        style={{ paddingInline: 10 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="Number of proposals" fill="#8884d8">
          {/* Adding LabelList to display values on top of each bar */}
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ConversionsBarChart;

const CustomTooltip = ({ active, payload, label, ...props }) => {
  console.log(payload, "props");
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white mt-[8rem] border border-gray-200 p-4 rounded-lg shadow-lg w-72"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="text-center text-md font-semibold text-gray-700 mb-2">
          {payload[0].value + " " + "Proposals" + " " + label}
        </p>

        <div className="border-t border-gray-200 mb-3"></div>

        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-gray-800 mb-2 text-sm"
          >
            <span className="font-medium flex-1">
              {entry?.payload?.name?.split("")[0].toUpperCase() +
                entry?.payload?.name?.slice(1)}
              :
            </span>
            <span className="font-semibold text-right flex-1">
              $ {entry?.payload?.value.toLocaleString()}
            </span>
          </div>
        ))}

        {/* Footer with total */}
        <div className="border-t border-gray-200 mt-3 pt-2 text-sm text-gray-500 text-center">
          {/* Tooltip styled for modern UI */}
        </div>
      </div>
    );
  }

  return null;
};

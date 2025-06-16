import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import chroma from "chroma-js";

const RevenueBarChart = ({ data, baseColor = "#8884d8" }) => {
  // Generate color shades using chroma-js
  const shades = chroma
    .scale([
      chroma(baseColor).brighten(1),
      baseColor,
      chroma(baseColor).darken(1),
    ])
    .colors(4);

    

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="month" interval={0} />
        <Tooltip />
        <Bar dataKey="totalProposals" stackId="a" fill={shades[0]} />
        <Bar dataKey="totalPrice" stackId="a" fill={shades[1]} />
        <Line
          type="monotone"
          dataKey="Budget"
          stroke="#000"
          strokeWidth={2}
          dot={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueBarChart;
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        <p style={{ fontWeight: "bold" }}>{label}</p> {/* Displays month */}
        <p>
          <span style={{ color: payload[0].stroke }}>● </span>
          {`No of Clients: ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

const RevenueLineChart = ({ data }) => {
  const chartData = data?.map((item) => ({
    month: item.monthName, // using monthName for X axis labels
    "No of Clients": item.count, // using count for the Y axis data (previously Budget)
  }));

  return (
    <ResponsiveContainer width={"100%"} height={200} style={{ padding: 6 }}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="month" interval={0} />{" "}
        {/* Ensures all months are displayed */}
        <Tooltip content={<CustomTooltip />} /> {/* Custom Tooltip */}
        <Legend />
        <Line
          type="monotone"
          dataKey="No of Clients"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;

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
} from "recharts";

// const data = [
//   { name: "Sent", "Number of proposals": 2 },
//   { name: "Accepted", "Number of proposals": 3 },
// ];

const ClientConversionsBarChart = ({data}) => {
 
  console.log(data , "30days");

  
  

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barSize={50} // Set the bar size
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Number of proposals" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClientConversionsBarChart;

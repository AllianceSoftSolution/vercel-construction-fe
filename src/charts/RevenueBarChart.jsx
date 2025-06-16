import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import chroma from "chroma-js";

const data = [
  {
    month: "Jan",
    Budget: 4000,
    CreditCard: 0,
    DirectDebit: 0,
    CreditCardScheduled: 10000,
    Others: 300,
  },
  {
    month: "Feb",
    Budget: 3000,
    CreditCard: 0,
    DirectDebit: 0,
    CreditCardScheduled: 7000,
    Others: 200,
  },
  {
    month: "Mar",
    Budget: 5000,
    CreditCard: 0,
    DirectDebit: 0,
    CreditCardScheduled: 9000,
    Others: 300,
  },
  {
    month: "Apr",
    Budget: 4000,
    CreditCard: 0,
    DirectDebit: 0,
    CreditCardScheduled: 9000,
    Others: 300,
  },
  {
    month: "May",
    Budget: 6000,
    CreditCard: 0,
    DirectDebit: 0,
    CreditCardScheduled: 8000,
    Others: 300,
  },
  {
    month: "Jun",
    Budget: 7000,
    CreditCard: 3000,
    DirectDebit: 2200,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Jul",
    Budget: 5000,
    CreditCard: 2000,
    DirectDebit: 1600,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Aug",
    Budget: 4000,
    CreditCard: 1500,
    DirectDebit: 1200,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Sep",
    Budget: 3000,
    CreditCard: 1000,
    DirectDebit: 1100,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Oct",
    Budget: 6000,
    CreditCard: 2500,
    DirectDebit: 2000,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Nov",
    Budget: 7000,
    CreditCard: 3000,
    DirectDebit: 2200,
    CreditCardScheduled: 0,
    Others: 0,
  },
  {
    month: "Dec",
    Budget: 8000,
    CreditCard: 200,
    DirectDebit: 2500,
    CreditCardScheduled: 0,
    Others: 0,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white mt-[8rem] border border-gray-200 p-4 rounded-lg shadow-lg w-72"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p className="text-center text-lg font-semibold text-gray-700 mb-2">
          {label} 2024
        </p>

        <div className="border-t border-gray-200 mb-3"></div>

        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-gray-800 mb-2 text-sm"
          >
            <span className="font-medium flex-1">
              {entry.name?.split("")[0].toUpperCase() + entry.name?.slice(1)}:
            </span>
            <span className="font-semibold text-right flex-1">
              ${entry.value.toLocaleString()}
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

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div
//         style={{
//           backgroundColor: "#fff",
//           border: "1px solid #ccc",
//           padding: "10px",
//           borderRadius: "5px",
//           width:290,
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <p className="text-center" style={{ margin: 0, }}>{label} 2024</p>
//         {payload.map((entry, index) => (
//           <div
//           key={index}
//           className="flex items-between text-black justify-between"
//           >
//           <span className="font-bold text-xs" >{entry.name}:</span>
//           <span >${entry.value}</span>

//           </div>
//         ))}
//       </div>
//     );
//   }

//   return null;
// };
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const RevenueBarChart = ({ baseColor = "#5A51E7", data: propData }) => {
  // console.log(propData, "haisam");
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
        data={
          propData?.map((item) => ({
            ...item,
            month: months[item.month - 1],
          })) || []
        }
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barCategoryGap="1%" // Decrease spacing between bar categories
        barGap={2} // Decrease spacing between individual bars
      >
        <XAxis dataKey="month" interval={0} />
        <Tooltip content={<CustomTooltip />} /> {/* Use custom tooltip */}
        <Bar dataKey="total" stackId="a" fill={shades[0]} label="Total" />
        <Bar dataKey="DirectDebit" stackId="a" fill={shades[0]} />
        <Bar dataKey="CreditCardScheduled" stackId="a" fill={shades[1]} />
        <Bar dataKey="Others" stackId="a" fill={shades[1]} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#000"
          strokeWidth={2}
          dot={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
// const RevenueBarChart = ({ baseColor = "#7169EA"  }) => {
//   // Generate color shades using chroma-js
//   const shades = chroma
//     .scale([
//       chroma(baseColor).brighten(1),
//       baseColor,
//       chroma(baseColor).darken(1),
//     ])
//     .colors(4);
//   console.log(shades);
//   return (
//     <ResponsiveContainer width="100%" height={180}>
//       <BarChart
//         data={data}
//         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//       >
//         <XAxis dataKey="month" interval={0} />
//         {/* <YAxis /> */}
//         <Tooltip />
//         {/* <Legend /> */}
//         {/* Stack Bars for each category with color shades */}
//         <Bar dataKey="CreditCard" stackId="a" fill={shades[0]} />
//         <Bar dataKey="DirectDebit" stackId="a" fill={shades[0]} />
//         <Bar dataKey="CreditCardScheduled" stackId="a" fill={shades[1]} />
//         <Bar dataKey="Others" stackId="a" fill={shades[1]} />
//         {/* Line for Budget */}
//         <Line
//           type="monotone"
//           dataKey="Budget"
//           stroke="#000"
//           strokeWidth={2}
//           dot={false}
//         />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

export default RevenueBarChart;

import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomLegend = ({ labels, data }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
      {labels.map((label, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: data[index],
              borderRadius: "50%", 
              marginRight: "10px",
            }}
          ></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ data = [400, 300], labels = ["Group A", "Group B"] }) => {
  // Check if data and labels length match
  if (data.length !== labels.length) {
    console.error("Data and labels length mismatch");
    return null; // Or you can return some error UI
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "My Dataset",
        data: data,
        backgroundColor: ["#0074BD", "#4299A0"],
        hoverBackgroundColor: ["#0074BD", "#4299A0"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="flex items-center ml-[10rem]">
      <div style={{ width: "200px", height: "200px" }}>
        <Pie data={chartData} options={options} />
      </div>
      <CustomLegend labels={labels} data={["#0074BD", "#4299A0"]} />
    </div>
  );
};

export default PieChart;

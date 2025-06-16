import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = () => {
  const data = {
    labels: [
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Current financial year (excl. tax)",
        data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // Flat line data
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "#3b3b98", // Dark blue color for the line
        borderWidth: 2,
        pointBackgroundColor: "#3b3b98", // Color for the points
        pointBorderColor: "#3b3b98",
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // Hide gridlines on x-axis
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false, // Hide gridlines on y-axis
        },
        ticks: {
          display: false, // Hide y-axis labels
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend (since it's in your graph image)
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
} from "recharts";
import chroma from "chroma-js";

// Helper to flatten API data into recharts grouped bar format
function transformPaymentsData(apiData) {
  // Find all unique section codes/names for color mapping
  const sectionKeys = Array.from(
    new Set(
      apiData.flatMap((project) =>
        project.sections.map((section) => section.sectionName || section.sectionCode)
      )
    )
  );

  // Build recharts data array
  const data = apiData.map((project) => {
    const row = {
      project: `${project.projectName} (${project.projectCode})`,
      total: project.totalAmount,
    };
    project.sections.forEach((section) => {
      row[section.sectionName || section.sectionCode] = section.amount;
    });
    return row;
  });

  return { data, sectionKeys };
}

const COLORS = [
  "#5A51E7", "#FDBA74", "#EF4444", "#22c55e", "#0ea5e9", "#8b5cf6", "#eab308", "#7a0b4a"
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-lg w-72">
        <p className="text-center text-lg font-semibold text-gray-700 mb-2">{label}</p>
        <div className="border-t border-gray-200 mb-3"></div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center text-gray-800 mb-2 text-sm">
            <span className="font-medium flex-1">{entry.name}:</span>
            <span className="font-semibold text-right flex-1">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const GroupedProjectSectionBarChart = ({ apiData, height = 400 }) => {
  const { data, sectionKeys } = transformPaymentsData(apiData || []);
  // Generate color palette for sections
  const colorScale = chroma.scale(["#5A51E7", "#FDBA74", "#EF4444", "#22c55e", "#0ea5e9", "#8b5cf6", "#eab308", "#7a0b4a"]).colors(sectionKeys.length);

  return (
    <div className="w-full border-2 mt-5 rounded-lg p-4 sm:p-5">
      <h3 className="text-lg font-semibold mb-2">Payments by Project & Section</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
          barGap={4}
          barCategoryGap="20%"
        >
          <XAxis dataKey="project" interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          {/* Show total per project above each group */}
          <Bar dataKey="total" fill="#8884d8" opacity={0} isAnimationActive={false} >
            <LabelList dataKey="total" position="top" formatter={(v) => v && v.toLocaleString()} />
          </Bar>
          {sectionKeys.map((section, idx) => (
            <Bar
              key={section}
              dataKey={section}
              name={section}
              fill={colorScale[idx % colorScale.length]}
              stackId={null}
              maxBarSize={40}
              radius={[6, 6, 0, 0]}
            />
          ))}
          {/* Add a line for total per project */}
          <Line type="monotone" dataKey="total" stroke="#000" strokeWidth={2} dot={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GroupedProjectSectionBarChart; 
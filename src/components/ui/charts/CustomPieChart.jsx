import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const CustomPieChart = ({
    data,
    colors = ['#B4DFC5', '#052654', '#FFBB28', '#FF8042'],
    width = 280,
    height = 280,
    innerRadius = 60,
    outerRadius = 80,
    cx = 80,
    cy = 140,
    centerText = '', // Prop for the center text
}) => {
    return (
        <PieChart width={width} height={height}>
            {/* Pie Chart */}
            <Pie
                data={data}
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip />

            {/* Center Text */}
            <text
                x={cx + 5} // Center the text horizontally
                y={cy + 5} // Center the text vertically
                textAnchor="middle" // Align text to the center
                dominantBaseline="middle" // Vertically center the text
                style={{ fontSize: '20px', fill: '#052654' }} // Customize text style
            >
                {centerText}
            </text>
        </PieChart>
    );
};

export default CustomPieChart;
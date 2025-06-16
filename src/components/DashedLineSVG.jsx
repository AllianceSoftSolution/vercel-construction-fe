import React from "react";

const DashedLineSVG = ({
  width = "100%",
  height = "2px",
  dashWidth = "5",
  spaceWidth = "5",
}) => (
  <svg width={width} height={height}>
    <line
      x1="0"
      y1="0"
      x2="100%"
      y2="0"
      stroke="rgba(0,0,0,0.3)"
      strokeWidth={height}
      strokeDasharray={`${dashWidth}, ${spaceWidth}`}
    />
  </svg>
);

export default DashedLineSVG;

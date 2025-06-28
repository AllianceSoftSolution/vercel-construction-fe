import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const Divider = ({ orientation = "horizontal", thickness = "1px", color = "#e5e7eb", className = "" }) => {
  const isVertical = orientation === "vertical";

  return (
    <div
      className={clsx(
        isVertical ? "h-full w-px" : "w-full h-px",
        "bg-gray-300",
        className
      )}
      style={{
        backgroundColor: color,
        height: isVertical ? "100%" : thickness,
        width: isVertical ? thickness : "100%",
      }}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  thickness: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Divider;

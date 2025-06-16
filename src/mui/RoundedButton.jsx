import { Tooltip } from "@mui/material"; // Import Tooltip
import React from "react";
import { cn } from "../utils/tailwindCN";

const RoundedButton = ({
  children,
  onClick,
  disabled,
  className,
  tooltipTitle,
  showTooltip,
  ...props
}) => {
  // Button element definition
  const buttonElement = (
    <button
      onClick={onClick}
      style={{ marginTop: showTooltip ? -3 : 0 }}
      className={cn(
        "px-8 py-2 rounded-lg  text-white",
        className,
        disabled ? "bg-[#0074BD]/70" : "bg-[#0074BD]"
      )}
      {...props}
      disabled={disabled}
    >
      {children}
    </button>
  );

  return (
    <Tooltip title={showTooltip ? tooltipTitle : ""} placement="top">
      <span>{buttonElement} </span>
    </Tooltip>
  );
};

export default RoundedButton;

// import { Button } from "@mui/material";
// import React from "react";
// import { cn } from "../utils/tailwindCN";

// const RoundedButton = ({
//   children,
//   onClick,
//   disabled,
//   className,
//   ...props
// }) => {
//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "px-8 py-2 rounded-lg text-white",
//         className,
//         disabled ? "bg-[#0074BD]/70" : "bg-[#0074BD] "
//       )}
//       {...props}
//       disabled={disabled}
//     >
//       {children}
//     </button>
//   );
// };

// export default RoundedButton;

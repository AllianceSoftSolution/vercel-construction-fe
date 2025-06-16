// SnackbarComponent.js
import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
// Create a styled Alert component for Snackbar
const StyledAlert = styled(MuiAlert)(({ severity }) => ({
  backgroundColor:
    severity === "success"
      ? "#4caf50" // Green for success
      : severity === "error"
      ? "#f44336" // Red for error
      : severity === "warning"
      ? "#ff9800" // Orange for warning
      : "white", // Default Blue for info
  //   color: "#fff", // White text color
  color: "", // White text color

  fontWeight: "bold",
  borderRadius: "8px",
  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
  display: "flex", // Use flexbox for layout
  alignItems: "center", // Center items vertically
}));

// PositionedSnackbar component
const CustomSnackbar = ({
  open,
  onClose,
  duration,
  severity,
  customContent, // New prop for custom JSX content
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      onClose={onClose}
      autoHideDuration={duration}
    >
      <StyledAlert
        onClose={onClose}
        severity={severity}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {customContent} {/* Display the custom JSX content */}
      </StyledAlert>
    </Snackbar>
  );
};
const PositionedSnackbar = ({
  showSnackbar,
  message = "This is a default message!",
  severity = "info",
  duration = 6000,
  action = null,
  position = { vertical: "top", horizontal: "center" },
}) => {
  const [state, setState] = React.useState({
    open: showSnackbar,
    vertical: position.vertical,
    horizontal: position.horizontal,
  });
  const { vertical, horizontal, open } = state;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, open: false });
  };

  React.useEffect(() => {
    setState((prev) => ({ ...prev, open: showSnackbar }));
  }, [showSnackbar]); // Update Snackbar open state based on prop change

  return (
    <Box sx={{ width: 500 }}>
      <CustomSnackbar
        open={open}
        onClose={handleClose}
        duration={duration}
        severity={severity} // Use the severity prop
        customContent={
          <Box display="flex" gap={3} alignItems="center">
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {message} {/* Use the custom message */}
            </Typography>
            {"  "}
            {action} {/* Render the action button or link */}
          </Box>
        }
        position={position} // Set the position dynamically
      />
    </Box>
  );
};

export default PositionedSnackbar;

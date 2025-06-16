// import React, { useState } from "react";
// import { Modal, Box, Typography, Button } from "@mui/material";

// const SimpleModal = ({open, handleClose}) => {
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const style = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     width: 400,
//     bgcolor: "background.paper",
//     border: "2px solid #000",
//     boxShadow: 24,
//     p: 4,
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="simple-modal-title"
//       aria-describedby="simple-modal-description"
//     >
//       <Box sx={style}>
//         <Typography id="simple-modal-title" variant="h6" component="h2">
//           Simple Modal
//         </Typography>
//         <Typography id="simple-modal-description" sx={{ mt: 2 }}>
//           This is a simple modal example using Material-UI. You can put any
//           content here.
//         </Typography>
//         <Button
//           onClick={handleClose}
//           sx={{ mt: 2 }}
//           variant="contained"
//           color="secondary"
//         >
//           Close
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default SimpleModal;
import React from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomModal = ({
  open,
  onClose,
  title = "Default Title", // Customizable title
  children, // Dynamic content passed as children
  footer = null, // Optional footer for actions like "Save", "Cancel"
  width = 400, // Default width
  height = 300, // Default height
  backgroundColor = "#fff", // Default background color
  titleColor = "#000", // Customizable title color
  closeIcon = true, // Option to display close icon
  showFooter = true, // Toggle for footer visibility
  disableBackdropClick = false, // Control closing modal on backdrop click
}) => {
  return (
    <Modal
      open={open}
      onClose={disableBackdropClick ? null : onClose}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box
        sx={{
          width,
          height,
          backgroundColor,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            id="custom-modal-title"
            variant="h6"
            component="h2"
            color={titleColor}
          >
            {title}
          </Typography>
          {closeIcon && (
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Body Section */}
        <Box id="custom-modal-description" mb={2}>
          {children}
        </Box>

        {/* Footer Section */}
        {showFooter && (
          <Box display="flex" justifyContent="flex-end" mt={3}>
            {footer || (
              <Button variant="contained" onClick={onClose}>
                Close
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;

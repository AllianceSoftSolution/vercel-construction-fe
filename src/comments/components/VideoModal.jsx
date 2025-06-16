import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

export const VideoModal = ({video ,open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <WarningIcon sx={{ mr: 1, color: 'red' }} /> */}
          Watch Video
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography><video src={video} controls /></Typography>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose} className='bg-[#0074BD] text-white px-4 py-2 mt-3 rounded'>
          Close
        </button>
        {/* <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          color="error"
        >
          Yes
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

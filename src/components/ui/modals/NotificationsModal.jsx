import React from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import { Close } from "@mui/icons-material";

function NotificationsModal({
  open,
  onClose,
  notifications,
  loading,
  onScroll,
  onMarkRead,
}) {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isMediumScreen = useMediaQuery("(max-width: 768px)");
  // Scroll handler for infinite scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && onScroll) {
      onScroll();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isSmallScreen ? "90%" : isMediumScreen ? "80%" : "60%",
          height: isSmallScreen ? "90vh" : "70vh",
          bgcolor: "white",
          boxShadow: 24,
          p: isSmallScreen ? 2 : 2,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-2">
          <Typography variant="h5" fontWeight={700}>
            Notifications
          </Typography>
          <div>
            <Close className="text-black cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* Notifications List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            borderRadius: 2,
            background: "#f7f7f7",
            p: 1,
          }}
          onScroll={handleScroll}
        >
          {notifications && notifications.length === 0 && !loading && (
            <Typography align="center" color="text.secondary" mt={4}>
              No notifications
            </Typography>
          )}
          {notifications &&
            notifications.map((item, index) => (
              <Box
                key={item.id || index}
                onClick={() => onMarkRead && onMarkRead(item)}
                sx={{
                  position: "relative",
                  mt: 2,
                  mb: 2,
                  height: "auto",
                  minHeight: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  bgcolor: item.read ? "#fff" : "#e3f2fd",
                  boxShadow: item.read
                    ? "none"
                    : "0 2px 8px rgba(33,150,243,0.08)",
                  borderLeft: item.read
                    ? "4px solid #eee"
                    : "4px solid #1976d2",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: isSmallScreen ? 15 : 18,
                      fontWeight: item.read ? 400 : 700,
                    }}
                  >
                    {item.title || item.text || "Notification"}
                  </Typography>
                  {item.body && (
                    <Typography
                      sx={{ fontSize: isSmallScreen ? 13 : 15, color: "#555" }}
                    >
                      {item.body}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {item.timeAgo || item.time || ""}
                  </Typography>
                </Box>
              </Box>
            ))}
          {loading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress size={28} />
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

export default NotificationsModal;

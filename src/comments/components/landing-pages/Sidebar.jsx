import React from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import logo_3percenttaxold_1 from "../../assets/logo-3percenttaxold 1.png"
const Sidebar = ({ open, onClose, logo }) => {
const navigate = useNavigate(); 

  const menuItems = [
    { text: "Home", link: "/" },
    { text: "Features", link: "/features" },
    { text: "Pricing", link: "/pricing" },
    { text: "About", link: "/about-us" },
    { text: "FAQs", link: "/faqs" },
    { text: "Contact Us", link: "/contact-us" },
  ];

  const handleNavigation = (link) => {
    navigate(link); // Navigate to the specified link
    onClose(); // Close the sidebar after navigation
  };

  return (
    <div>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 250, // Set the width of the sidebar
            padding: 2, // Add some padding
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo Section */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <img
              src={logo_3percenttaxold_1}
              alt="Logo"
              style={{ width: "100%", maxWidth: "180px" }}
            />
          </Box>

          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleNavigation(item.link)}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem>
            <CustomButton sx={{ px: 8 }} onClick={() => navigate("/login")}>
            Sign In
            </CustomButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;

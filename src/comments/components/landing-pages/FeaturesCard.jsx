import React from "react";
import trophy from "../../assets/trophy.png"

import {
  Box,
  Card,
  CardContent,
  List,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled } from "@mui/material/styles";

// Styled Card Component
const StyledCard = styled(Card)(({ borderColor, hoverBgColor }) => ({
  border: "1px solid transparent", // Default border
  height:"420px",
  borderRadius: "18px",
boxShadow:"  rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px" ,  
//  backgroundColor: "red",
  m: 8,
  transition: "border 0.3s, background-color 0.3s, box-shadow 0.3s", // Smooth transition
  "&:hover": {
    borderColor: borderColor || "#007bff", // Blue border on hover
    // backgroundColor: hoverBgColor || "rgba(0, 123, 255, 0.1)", // Light blue background on hover
    boxShadow: `0 1px 20px ${borderColor || "#007bff"}`, // Shadow effect on hover
  },
}));

// Prop-Based Hoverable Card Component

function HoverableCard({
  title,
  items,
  buttonLabel,
  borderColor,
  hoverBgColor,
  imgSrc,
}) {
  return (
    <StyledCard borderColor={borderColor} hoverBgColor={hoverBgColor}>
      <CardContent sx={{ p: { sx: 5, md: 5 } }}>
        <Box component="img" src= {trophy} alt="Trophy Image" />
        <Typography mt={2} variant={"h5"} fontSize={20} fontWeight={"bold"}>
          {title}
        </Typography>
        <Box sx={{ height: 220, overflowY: "hidden" }}>
          <ul className="w-full bg-white">
            {" "}
            {items?.map((item, index) => (
              <li key={index} className="flex items-start py-2">
                <span className="text-3xl -mt-1 text-[gray] mr-2">•</span>{" "}
                {/* Adjust text size and margin as needed */}
                <span className="text-base text-[gray]">{item}</span>{" "}
              </li>
            ))}
          </ul>
        </Box>

        {/* <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {items?.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <span style={{ fontSize: "1.5rem", marginTop: -2 }}>•</span>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body1">{item}</Typography>}
              />
            </ListItem>
          ))}
        </List> */}
        <Box display="flex" justifyContent="flex-end" mt={2}>
          {/* <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              backgroundColor: "white",
              color: "#0074BD",
              "&:hover": {
                border: "none",
                backgroundColor: "#f0f0f0", 
              },
              border: "none",
              marginTop: 2,
            }}
          >
            <Typography variant="button">{buttonLabel}</Typography>
          </Button> */}
        </Box>



      </CardContent>
    </StyledCard>
  );
}

export default HoverableCard;

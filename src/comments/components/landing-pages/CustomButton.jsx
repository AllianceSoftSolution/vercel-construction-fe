import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

// Create the custom button component
const CustomButton = styled(
  ({ fullWidth, variant, hoverColor, hoverTextColor, onClick, ...props }) => (
    <Button {...props} variant={variant} fullWidth={false} onClick={onClick} />
  )
)(({ theme, hoverColor, hoverTextColor }) => ({
  // backgroundColor: "#AC2625",
  // color: "#fff",
  // borderRadius: "8px",
  // padding: "14px 46px",
  // fontSize: theme.breakpoints.down("sm") ? "12px" : "14px",
  // transition: "background-color 0.3s, color 0.3s",
  // "&:hover": {
  //   backgroundColor: hoverColor || "#B71C1C", 
  //   color: hoverTextColor || "#FFF", 
  backgroundColor: "#AC2625",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 10px",
  
  fontSize: { xs: "12px", md: "14px" },
  "&:hover": {
    backgroundColor: "#B71C1C",
  },
}));

export default CustomButton;



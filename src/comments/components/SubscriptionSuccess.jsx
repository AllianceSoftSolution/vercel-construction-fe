import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { CircularProgress } from "@mui/material";

import { Box, Typography, Button, Container } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/system";
import { Link, useLocation } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "@/components/landing-pages/Sidebar";
import toast from "react-hot-toast";
import apiClient from "@/api/apiClient";

// Styled logo image
const Logo = styled("img")({
  height: "40px",
  marginRight: "20px",
});

// Styled navigation link with hover and active underline
const NavLink = styled(({ isActive, ...props }) => <Link {...props} />)(
  ({ theme, isActive }) => ({
    position: "relative",
    margin: theme.spacing(0, 2),
    color: isActive ? "#2C91C6" : "black",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    fontSize: { xs: "14px", md: "16px" },

    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -2,
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "#0074BD",
      transform: isActive ? "scaleX(1)" : "scaleX(0)",
      transition: "transform 0.3s ease",
    },

    "&:hover::after": {
      transform: "scaleX(1)",
    },

    "&:hover": {
      color: "#0074BD",
    },
  })
);

// Styled Sign In button
const SignInButton = styled(Button)({
  backgroundColor: "#D32F2F",
  color: "#fff",
  borderRadius: "8px",
  padding: "6px 16px",
  fontSize: { xs: "12px", md: "14px" },
  "&:hover": {
    backgroundColor: "#B71C1C",
  },
});

// Styled Demo button
const DemoButton = styled(Button)({
  backgroundColor: "#AC2625",
  color: "#fff",
  borderRadius: "8px",
  padding: "14px 46px",
  fontSize: { xs: "12px", md: "14px" },
  "&:hover": {
    backgroundColor: "#B71C1C",
  },
});

const subjects = ["General Inquiry", "Support", "Feedback", "Testing"];

const ContactUs = () => {
  const [selectedSubject, setSelectedSubject] = useState("");

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const location = useLocation(); // Get the current route
  const [anchorEl, setAnchorEl] = useState(null); // State for the menu

  // Function to render specific content based on the pathname
  const renderContent = () => {
    switch (location.pathname) {
      case "/":
        return (
          <Box
            display="flex"
            flexDirection={"column"}
            width={{ xs: "100%", md: "60%" }}
            justifyContent={"center"}
            mt={4}
          >
            <Typography
              color="white"
              fontWeight={"bold"}
              textAlign={"center"}
              lineHeight={1.2}
              variant="h2"
            >
              From Compliance to Advisory <br /> Deliver “3% Tax Truths” Savings{" "}
              <br />
              Results For Your Clients
            </Typography>
            <Typography color="white" textAlign={"center"} lineHeight={1.4}>
              Take your tax services to the next level by offering
              sophisticated, client-focused <br /> tax advice with our “3% Tax
              Truths” Tax Planning Software.
            </Typography>
            <Box display={"flex"} gap={3} justifyContent={"center"} mt={4}>
              <DemoButton variant="contained">Book Demo</DemoButton>
              <Button
                variant="outlined"
                sx={{
                  padding: "14px 40px",
                  borderRadius: "8px",
                  borderColor: "white", // Set the outline color to white
                  color: "white", // Set the text color to white
                  "&:hover": {
                    borderColor: "white", // Keep the outline color white on hover
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional: Add a slight background on hover
                  },
                }}
                endIcon={<ArrowForwardIcon sx={{ color: "white" }} />} // Arrow icon at the end
              >
                Free Trial
              </Button>
            </Box>
          </Box>
        );
    }
  };

  // Handle menu opening
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu closing
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const isFormValid = Object.values(formData).every(
      (field) => field.trim() !== ""
    );

    if (!isFormValid) {
      toast.error("Please fill out all fields.");
      // console.log("Please fill out all details.")
      return;
    }

    setLoading(true); // Start loading

    // form submit
    try {
      const response = await apiClient.post("/form/contactMessage", formData);
      if (response.ok) {
        console.log(response.data);
        // toast success
        toast.success("Your message has been sent successfully!");
      } else {
        throw new Error("All Fields Required!");
      }
    } catch (error) {
      console.error("Error:", error); // Log the error to the console
      toast.error(
        error.message || "Failed to send a message! Please try again."
      ); // Error toast
    } finally {
      setLoading(false);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <>
      <div
        className=" font-sans flex flex-col bg-no-repeat bg-cover bg-[url('/Bg_Hero.png')] pt-2 pb-28  px-2 md:px-8 md:pt-8  "
        style={{
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col  items-center justify-center text-center   mb-20 px-8  text-white">
          <div className="flex flex-col items-center font-semibold justify-center text-center text-white   px-2 md:px-8">
            <h1 className="text-[30px] md:text-[40px] md:mt-40 font-bold  text-white">
              {/* Contact Us */}
            </h1>
            <p className="text-lg font-[500]   ">
              {/* Any question or remarks? Just write us a message! */}
            </p>
          </div>
        </div>
      </div>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          //   height: "60vh",
          my: { xs: 0, md: 10 },
          textAlign: "center",
          p: 3,
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: "#4caf50",
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 1,
          }}
        >
          Subscription Successful!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#555",
            mb: 4,
          }}
        >
          Thank you for subscribing! Your plan is now active. <br /> Please
          check your email for confirmation details and instructions on how to
          get started.
          {/* Thank you for subscribing! Your plan is now active. */}
        </Typography>
      </Box>
    </>
  );
};

export default ContactUs;

import React from "react";
import Slider from "react-slick";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Star, StarBorder } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
// Custom Arrow Components
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: -30,
        transform: "translateY(-50%)",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "50%",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          backgroundColor: "#0056b3",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        },
        width: 48,
        height: 48,
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: -30,
        transform: "translateY(-50%)",
        backgroundColor: "#007bff",
        color: "white",
        borderRadius: "50%",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        "&:hover": {
          backgroundColor: "#0056b3",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        },
        width: 48,
        height: 48,
      }}
    >
      <ArrowBackIosIcon fontSize="small" />
    </IconButton>
  );
};
const CustomSlider = () => {
  // Slider settings
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Targets screens smaller than 'sm'
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // Targets only 'sm' to 'md'

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 6,
          "& li": {
            margin: "0 8px", // Spacing between dots
          },
          "& button": {
            width: "9px !important", // Forces larger dot width
            height: "9px !important", // Forces larger dot height
            backgroundColor: "gray !important", // Dot color
            borderRadius: "50% !important",
          },
          "& .slick-active button": {
            backgroundColor: "#0074BD !important", // Active dot color
          },
        }}
      >
        {dots}
      </Box>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const testimonials = [
    {
      rating: 5,
      description:
        "This service has completely transformed our workflow. Highly recommended!",
      userName: "Alice Johnson",
      userImage: "https://randomuser.me/api/portraits/women/1.jpg",
      location: "Los Angeles, USA",
    },
    {
      rating: 4,
      description:
        "Great experience! The support team is very responsive and helpful.",
      userName: "Mark Smith",
      userImage: "https://randomuser.me/api/portraits/men/2.jpg",
      location: "Toronto, Canada",
    },
    {
      rating: 5,
      description:
        "Excellent service and a fantastic product! I couldn't be happier.",
      userName: "Sophia Brown",
      userImage: "https://randomuser.me/api/portraits/women/2.jpg",
      location: "London, UK",
    },
    {
      rating: 3,
      description:
        "Good overall, but there are a few features I'd like to see improved.",
      userName: "David Wilson",
      userImage: "https://randomuser.me/api/portraits/men/3.jpg",
      location: "Sydney, Australia",
    },
    {
      rating: 4,
      description: "Very user-friendly interface and great customer service.",
      userName: "Emily Davis",
      userImage: "https://randomuser.me/api/portraits/women/3.jpg",
      location: "Dublin, Ireland",
    },
  ];
  return (
    <Box width={{ xs: "80%", sm: "80%", md: "90%" }} mx="auto" py={4}>
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <Box display="flex" flexWrap={"wrap"} key={index} px={2}>
            <TestimonialCard
              rating={testimonial.rating}
              description={testimonial.description}
              userName={testimonial.userName}
              userImage={testimonial.userImage} // Replace with actual user image URL
              location={testimonial.location}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

function TestimonialCard({
  rating,
  description,
  userName,
  userImage,
  location,
}) {
  // Function to render stars based on the rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <Star key={i} sx={{ color: "#42A8DF" }} /> // Filled star
        ) : (
          <StarBorder key={i} sx={{ color: "#42A8DF" }} /> // Empty star
        )
      );
    }
    return stars;
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        mx: "auto",
        bgcolor: "#F7F5FF",
        borderRadius: 3,
        p: 2,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent>
        {/* Rating Stars */}
        <Box display="flex" justifyContent="start" mb={2}>
          {renderStars()}
        </Box>

        {/* Testimonial Text */}
        <Typography variant="body1" color="black" align="left" mb={2}>
          "{description}"
        </Typography>

        {/* User Avatar and Name */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={userImage}
            alt={userName}
            sx={{ width: 60, height: 60 }}
          />
          <Stack direction="column">
            <Typography variant="body1" fontWeight="bold">
              {userName}
            </Typography>
            <Typography variant="subtitle1" color="gray">
              {location} {/* Display user location */}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Testimonials() {
  return <Box display="flex" justifyContent="center" mt={4}></Box>;
}
export default CustomSlider;

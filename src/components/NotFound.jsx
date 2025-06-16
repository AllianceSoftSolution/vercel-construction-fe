// src/pages/PageNotFound.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <Box sx={{ textAlign: "center", padding: 3 }}>
            <Typography variant="h3" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="h6" paragraph>
                Sorry, the page you're looking for does not exist.
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/">
                Go to Home
            </Button>
        </Box>
    );
};

export default PageNotFound;

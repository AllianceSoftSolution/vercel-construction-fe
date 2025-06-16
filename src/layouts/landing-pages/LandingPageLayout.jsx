import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPageLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth/login");
  }, []);
  return <div></div>;
};

export default LandingPageLayout;

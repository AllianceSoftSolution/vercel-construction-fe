import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import phone_icon from "@/assets/phone_icon.png";
import location_icon from "@/assets/location.png";
import email_icon from "@/assets/email.png";

import {
  Box,
  Button,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "@/components/landing-pages/Sidebar";
import toast from "react-hot-toast";
import apiClient from "@/api/apiClient";
import small_ellipse from "@/assets/small_ellipse.png";
import big_ellipse from "@/assets/big_ellipse.png";

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

const NDA = () => {
  const { id } = useParams(); // route parameter
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const couponCode = params.get("coupon_code");
  const selectedPriceId = id || "";
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div
        className=" font-sans flex flex-col bg-no-repeat bg-cover md:bg-[url('@/assets/Bg_Hero.png')] bg-[url('@/assets/Bg-mob.png')] pt-8 pb-4 sm:pb-28  px-2 md:px-8 md:pt-8  "
        style={{
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col  items-center justify-center text-center mt-20  mb-20 px-8  text-white">
          <div className="flex flex-col items-center font-semibold justify-center text-center text-white   px-2 md:px-8">
            {/* <h1 className="text-[30px] md:text-[40px] font-bold  text-white">
              Contact Us
            </h1>
            <p className="text-lg font-[500] my-3  ">
              Any question or remarks? Just write us a message!
            </p> */}
            <h1 className="text-3xl sm:text-4xl   font-extrabold text-center mb-6">
              Non-Disclosure Agreement (NDA)
            </h1>
            <p className="text-center  ">
              This Agreement is entered into as of{" "}
              <span className="font-medium">[Insert Date]</span> by and between:
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-0 sm:px-8 py-4 md:py-8">
        <div
          className="   bg-gray-300 bg-white/40 backdrop-blur-md bg-opacity-30  p-4 border mb-12 border-white border-opacity-20 rounded-lg mt-[-100px] sm:mt-[-200px]"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          }}
        >
          <div className=" min-h-screen py-10 px-4 sm:px-8">
            <div className="max-w-4xl mx-auto  p-2 rounded-lg ">
              {/* Header */}

              {/* Parties Information */}
              {/* <div className="space-y-6">
                <div>
                  <h2 className="text-2xl  font-semibold ">
                    Disclosing Party:
                  </h2>
                  <p className="text-gray-600 pl-4">
                    [Your Business Name/Norman Dotch]
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl  font-semibold ">Receiving Party:</h2>
                  <p className="text-gray-600 pl-4">
                    [Name of Recipient/Entity]
                  </p>
                </div>
              </div> */}
              {/* Purpose */}
              <section className="mt-2">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  1. Purpose
                </h2>
                <p className="text-gray-600 mb-4">
                  The purpose of this NDA is to protect proprietary,
                  confidential, and trade secret information related to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Vera Tributum Tax Planning Software</li>
                  <li>"3% Tax Truths" Tax Planning Software</li>
                  <li>"Operating Cost Model"</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  The information shared is to be used exclusively for
                  evaluating and/or collaborating on projects involving the
                  above software and systems.
                </p>
              </section>
              {/* Definitions */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  2. Definitions
                </h2>

                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  2.1 Confidential Information
                </h3>
                <p className="text-gray-600 mb-3">
                  Includes, but is not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    Proprietary algorithms, methodologies, software code,
                    designs, formulas, concepts, and operational workflows.
                  </li>
                  <li>
                    Training materials, user guides, business models, financial
                    projections, pricing, and strategies.
                  </li>
                  <li>
                    Client lists, marketing plans, and operational processes.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">
                  2.2 Exclusions
                </h3>
                <p className="text-gray-600 mb-3">
                  Confidential Information does not include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    Publicly available information through no fault of the
                    Receiving Party.
                  </li>
                  <li>
                    Information independently developed by the Receiving Party
                    without using the Disclosing Party's Confidential
                    Information.
                  </li>
                  <li>
                    Information disclosed under legal obligation, provided the
                    Receiving Party gives prior written notice to the Disclosing
                    Party.
                  </li>
                </ul>
              </section>
              {/* Obligations */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  3. Obligations of the Receiving Party
                </h2>
                <ul className="list-decimal list-inside text-gray-600 space-y-3">
                  <li>
                    To keep all Confidential Information strictly confidential
                    and not disclose it to any third party without prior written
                    consent.
                  </li>
                  <li>
                    To use the Confidential Information solely for its intended
                    purpose as agreed by both parties.
                  </li>
                  <li>
                    Not to reproduce, copy, reverse-engineer, or share the
                    software, models, or concepts without written approval.
                  </li>
                  <li>
                    To return or securely destroy all Confidential Information
                    upon request by the Disclosing Party.
                  </li>
                </ul>
              </section>
              {/* Consequences of Breach */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  4. Consequences of Breach
                </h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>
                    <strong>Injunction and Damages:</strong> The Disclosing
                    Party is entitled to seek immediate injunctive relief and
                    recover monetary damages resulting from the breach.
                  </li>
                  <li>
                    <strong>Penalty for Sharing or Copying:</strong> A penalty
                    of $500,000 per incident for sharing or unauthorized copying
                    of proprietary materials, algorithms, or workflows.
                  </li>
                  <li>
                    <strong>Legal and Financial Repercussions:</strong> Full
                    liability for any financial loss, reputational harm, or
                    intellectual property theft caused by the breach.
                  </li>
                  <li>
                    <strong>Termination of Access:</strong> Immediate revocation
                    of access to any proprietary software, training, or systems.
                  </li>
                  <li>
                    <strong>Criminal Prosecution:</strong> In cases of
                    intentional misconduct, criminal prosecution under
                    applicable intellectual property and trade secret laws.
                  </li>
                </ul>
              </section>
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  5. Ownership of Intellectual Property
                </h2>
                <p className="text-gray-600">
                  The Disclosing Party retains sole ownership of all rights,
                  titles, and interests in:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-3 mb-4">
                  <li>Vera Tributum Tax Planning Software</li>
                  <li>"3% Tax Truths" Tax Planning Software</li>
                  <li>"Operating Cost Model"</li>
                </ul>
                <p className="text-gray-600">
                  Any enhancements or derivative works created based on these
                  products remain the property of the Disclosing Party.
                </p>
              </section>
              {/* Term and Termination */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  6. Term and Termination
                </h2>
                <p className="text-gray-600">
                  This Agreement begins on the Effective Date and remains in
                  effect for a period of five (5) years unless terminated
                  earlier by mutual consent.
                </p>
                <p className="text-gray-600 mt-3">
                  Obligations to protect Confidential Information survive
                  indefinitely.
                </p>
              </section>
              {/* Jurisdiction */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                  8. Entire Agreement
                </h2>
                <p className="text-gray-600">
                  This NDA constitutes the entire agreement between the parties
                  regarding the protection of Confidential Information and
                  supersedes any prior agreements.
                </p>
              </section>

              {/* Footer */}
              <div className="mt-12 text-center flex justify-end">
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                      if (couponCode) {
                        navigate(
                          `/plan-details/${selectedPriceId}?coupon_code=${couponCode}`
                        );
                      } else {
                        navigate(`/plan-details/${selectedPriceId}`);
                      }
                    }}
                    size="large"
                    // disabled={loading}
                    sx={{
                      padding: {
                        xs: "8px 10px",
                        sm: "8px 15px",
                        md: "10px 20px",
                        lg: "8px 20px",
                      },
                      fontSize: {
                        xs: "12px",
                        sm: "14px",
                        md: "16",
                        lg: "16px",
                      },
                      borderRadius: "5px",
                      margin: "10px 0px",
                      display: "flex",
                      alignItems: "right",
                      justifyContent: "right",
                      bgcolor: "#0074BD",
                    }}
                    disableElevation
                  >
                    {/* {loading && (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ marginRight: "8px" }}
                      />
                    )} */}
                    Accept Agreement and Continue
                  </Button>
                </div>
                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105">
                  
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NDA;

// import React from "react";
// const NDA = () => {
//   return (
//   );
// };

// export default NDA;

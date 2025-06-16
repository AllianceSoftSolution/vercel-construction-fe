import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Box,
  styled,
} from "@mui/material";
import Overview from "./preview-steps/Introduction";
import Introduction from "./preview-steps/Introduction";
import Services from "./preview-steps/Services";
import Pricing from "./preview-steps/Pricing";
import Terms from "./preview-steps/Terms";
import NextSteps from "./preview-steps/NextSteps";
import apiClient from "../../../../../api/apiClient";
import toast from "react-hot-toast";

// Custom Stepper Styles
const PreviewStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: "transparent",
  padding: "0",
}));

const PreviewStep = styled(Step)(({ theme }) => ({
  "& .MuiStepLabel-root": {
    color: "#bdbdbd",
    "& .Mui-active": {
      color: "#1976d2", // Active step color (blue)
      fontWeight: "bold", // Bold text for active step
    },
    "& .Mui-completed": {
      color: "#1976d2", // Completed step color (blue)
    },
  },
}));

const PreviewStepLabel = styled(StepLabel)(({ theme }) => ({
  "& .MuiStepIcon-root": {
    display: "none", // Hide default step icons
  },
  "& .MuiStepLabel-labelContainer": {
    display: "flex",
    alignItems: "center",
  },
  "& .MuiStepLabel-label": {
    fontSize: "12px", // Set font size to 8px
    fontWeight: "500", // Optional: Adjust font weight
    cursor: "pointer", // Add pointer cursor for clicking
    // textWrap: "nowrap"
  },
}));

const PreviewStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: "#bdbdbd", // Customize connector color
    borderTopWidth: 2,
    borderStyle: "solid",
  },
}));

// Preview steps labels
const previewSteps = [
  "Introduction",
  "Services",
  "Pricing",
  "Terms",
  "Next steps",
];

const PreviewSection = ({values}) => {
  const clientId = localStorage.getItem('ClientIdForPurposal')
  const [activePreviewStep, setActivePreviewStep] = useState(0);
  const [client, setclient] = useState([]);
  const [loading, setloading] = useState(false);
  const fetchData = async () => {
    setloading(true);
    const result = await apiClient.get(`client/${clientId}`);
    if (!result.ok) {
      toast.error("Something went wrong");
      setloading(false);
      return;
    }
    setclient(result.data.client);
    console.log(result)

    setloading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleNextPreviewStep = () => {
    setActivePreviewStep((prevStep) =>
      Math.min(prevStep + 1, previewSteps.length - 1)
  );
  };

  const handleBackPreviewStep = () => {
    setActivePreviewStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleStepClick = (index) => {
    setActivePreviewStep(index);
  };

  const previewContent = {
    Introduction: <Introduction values={values} client={client} />,
    Services: <Services values={values} client={client} />,
    Pricing: <Pricing values={values} client={client} />,
    Terms: <Terms values={values} client={client} />,
    "Next steps": <NextSteps values={values} client={client} />,
  };
  return (
    <div className="bg-white border-[1px] border-black/20 p-5 w-[48%] rounded-[8px] flex flex-col gap-y-2">
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Stepper for Preview Sections */}
        <PreviewStepper
          activeStep={activePreviewStep}
          connector={<PreviewStepConnector />}
          sx={{ width: "100%" }}
        >
          {previewSteps.map((label, index) => (
            <PreviewStep key={label} onClick={() => handleStepClick(index)}>
              <PreviewStepLabel>{label}</PreviewStepLabel>
            </PreviewStep>
          ))}
        </PreviewStepper>

        {/* Preview Step Content */}
        <Box sx={{ my: 2, width: "100%" }}>
          {previewContent[previewSteps[activePreviewStep]]}
        </Box>

        {/* Navigation Buttons (Optional) */}
        {/* <div className="flex justify-between w-full">
          <button
            className={`btn-prev ${
              activePreviewStep === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleBackPreviewStep}
            disabled={activePreviewStep === 0}
          >
            Back
          </button>
          <button
            className={`btn-next ${
              activePreviewStep === previewSteps.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNextPreviewStep}
            disabled={activePreviewStep === previewSteps.length - 1}
          >
            Next
          </button>
        </div> */}
      </Box>
    </div>
  );
};

export default PreviewSection;

import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

import ProjectInformationTab from "./tabs/ProjectInformationTab";
import AssociatedMembersTab from "./tabs/AssociatedMembersTab";
import SectionTab from "./tabs/SiSectionTab";

const SiProjectDetailPage = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <TopBar
        title="Project Details"
        showIcon={true}
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        // buttonText="Create Project"
        // onButtonClick={() =>
        //   navigate("/store-incharge-dashboard/project-management/addProject")
        // }
      />

      <Box
        sx={{
          mt: 2,
          backgroundColor: "#f7f7f7",
          borderRadius: "12px",
          px: 2,
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#FC8908",
              height: 4,
              borderRadius: "4px",
            },
          }}
          aria-label="project detail tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              color: "#6B7280",
            },
            "& .Mui-selected": {
              color: "#FC8908 !important",
            },
          }}
        >
          <Tab label="Project Information" />
          <Tab label="Associated Members" />
          <Tab label="Sections" />
        </Tabs>
      </Box>

      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ProjectInformationTab />}
        {tabIndex === 1 && <AssociatedMembersTab />}
        {tabIndex === 2 && <SectionTab />}
      </Box>
    </div>
  );
};

export default SiProjectDetailPage;

import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

import SectionTab from "./tabs/SectionTab";
import ProjectInformationTab from "./tabs/ProjectInformationTab";
import AssociatedMembersTab from "./tabs/AssociatedMembersTab";

const PmProjectDetailPage = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="p-2 sm:p-4">
      {/* TopBar Component */}
      <TopBar
        title="Project Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      {/* Tab Navigation Box */}
      <Box
        sx={{
          mt: 2,
          backgroundColor: "#f7f7f7",
          borderRadius: "12px",
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
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
              minWidth: 100,
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

      {/* Tab Content Section */}
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && <ProjectInformationTab />}
        {tabIndex === 1 && <AssociatedMembersTab />}
        {tabIndex === 2 && <SectionTab />}
      </Box>
    </div>
  );
};

export default PmProjectDetailPage;

import React, { useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";

import ProjectInformationTab from "./tabs/ProjectInformationTab";
import AssociatedMembersTab from "./tabs/AssociatedMembersTab";
import SectionTab from "./tabs/CmSectionTab";

const CmProjectDetailPage = () => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      <TopBar
        title="Project Details"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
      />

      <Box
        sx={{
          mt: 3,
          backgroundColor: "#f7f7f7",
          borderRadius: "12px",
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 1, sm: 2 },
          overflowX: "auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
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
            minHeight: 48,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "0.85rem", sm: "1rem" },
              px: { xs: 1, sm: 2, md: 3 },
              minWidth: "max-content",
              whiteSpace: "nowrap",
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

      <div className="mt-6">
        {tabIndex === 0 && <ProjectInformationTab />}
        {tabIndex === 1 && <AssociatedMembersTab />}
        {tabIndex === 2 && <SectionTab />}
      </div>
    </div>
  );
};

export default CmProjectDetailPage;

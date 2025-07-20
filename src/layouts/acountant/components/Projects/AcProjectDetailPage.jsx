import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import { Tabs, Tab, Box } from "@mui/material";
import ProjectInformationTab from "./tabs/ProjectInformationTab";
import AssociatedMembersTab from "./tabs/AssociatedMembersTab";
import SectionTab from "./tabs/SectionTab";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const AcProjectDetailPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [projectData, setProjectData] = useState(null);
  const { id } = useParams();

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchProjectDetail = async () => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      if (response.ok) {
        setProjectData(response.data.project);
      } else {
        toast.error("Failed to fetch project details.");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Something went wrong while fetching details.");
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetail();
  }, [id]);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
      <TopBar
        title="Project Details"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

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
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
                md: "1rem",
              },
              minWidth: "auto",
              px: { xs: 1, sm: 2, md: 3 },
              color: "#6B7280",
            },
            "& .Mui-selected": {
              color: "#FC8908 !important",
            },
          }}
        >
          <Tab label="Project Information" />
          {/* <Tab label="Associated Members" /> */}
          <Tab label="Sections" />
        </Tabs>
      </Box>

      <Box sx={{ mt: { xs: 2, md: 3 } }}>
        {tabIndex === 0 && <ProjectInformationTab data={projectData} />}
        {/* {tabIndex === 1 && <AssociatedMembersTab />} */}
        {tabIndex === 1 && <SectionTab data={projectData?.sections} />}
      </Box>
    </div>
  );
};

export default AcProjectDetailPage;

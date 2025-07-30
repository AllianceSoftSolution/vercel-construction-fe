import React, { useState, useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import Loader from "../../../../components/ui/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

import SectionTab from "./tabs/SectionTab";
import ProjectInformationTab from "./tabs/ProjectInformationTab";
import AssociatedMembersTab from "./tabs/AssociatedMembersTab";
import CAPTab from "./tabs/CAPTab";

const PmProjectDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const fetchProjectDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/projects/${id}`);
      if (response.ok) {
        setProjectData(response.data.project);
      } else {
        toast.error("Failed to fetch project details.");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProjectDetail();
  }, [id]);

  return (
    <div className="p-2 sm:p-4">
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loader />
        </div>
      ) : (
        <>
          {/* TopBar Component */}
          <TopBar
            title="Project Details"
            // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
            // showExport={true}
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
              <Tab label="CAP" />
            </Tabs>
          </Box>

          {/* Tab Content Section */}
          <Box sx={{ mt: 3 }}>
            {tabIndex === 0 && <ProjectInformationTab data={projectData} />}
            {tabIndex === 1 && <AssociatedMembersTab data={projectData} />}
            {tabIndex === 2 && (
              <SectionTab data={projectData?.sections} />
            )}
            {tabIndex === 3 && <CAPTab data={projectData} loading={loading} projectId={id}  />}
          </Box>
        </>
      )}
    </div>
  );
};

export default PmProjectDetailPage;

import React, { useEffect, useState } from "react";
import {
  FaBoxesStacked,
  FaEye,
  FaHandHoldingHeart,
  FaTrash,
} from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiExport } from "react-icons/ci";
import { FaToolbox, FaUserEdit } from "react-icons/fa";
import { IoStorefrontSharp } from "react-icons/io5";
import TopBar from "../../../components/ui/TopBar";
import AnalyticsCard from "../../../mui/AnalyticsCard";
import PieGraph from "../../../components/ui/Graphs/PieGraph";
import HorixontalBarchartGraph from "../../../components/ui/Graphs/HorixontalBarchartGraph";
import SimpleTable from "../../../components/SimpleTable";
import SectionCard from "../../../components/ui/SectionCard";
import Loader from "../../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";
import { Chip } from "@mui/material";
import { formatDateDMY } from "../../../utils";

// Status color mapping for demand status
const statusColorMap = {
  APPROVED: "#22c55e", // green
  REJECTED: "#ef4444", // red
  PENDING: "#f59e42", // orange
  PARTIALLY_APPROVED: "#eab308", // yellow
  PO_CREATED: "#8b5cf6", // purple
  default: "#0252AD", // fallback blue
};

const StatusChip = ({ value }) => {
  const status = (value || "PENDING").toUpperCase();
  const color = statusColorMap[status] || statusColorMap.default;
  return (
    <Chip
      label={status.replace(/_/g, " ")}
      size="small"
      sx={{ bgcolor: color, color: "#fff", fontWeight: 600, letterSpacing: 0.5 }}
    />
  );
};

function CmDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user);

  // Analytics and chart data states
  const [projectStats, setProjectStats] = useState([
    { label: "Total Projects", icon: FaBoxesStacked, count: 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/project-management")},
    { label: "Total Demands", icon: FaHandHoldingHeart, count: 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/demands")},
    { label: "Total POs Created", icon: FaHandHoldingHeart, count: 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/pOS")},
  ]);
  const [demandBreakdown, setDemandBreakdown] = useState([]);
  const [fulfillmentProgress, setFulfillmentProgress] = useState([]);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/demands");
        if (response.ok) {
          const data = response.data.demands.map((demand, index) => ({
            refNo: demand.referenceNumber || `REF-${index + 1}`,
            project: demand.section?.project?.name || "N/A",
            material: demand.material?.name || "N/A",
            section: demand.section?.name || "N/A",
            qty: demand.quantity || "N/A",
            status: demand.status || "N/A",
            cmName: demand.creator?.name || "N/A",
            date: demand.createdAt ? formatDateDMY(demand.createdAt) : "N/A",
          }));
          setDemands(data);
        } else {
          toast.error("Failed to fetch demands");
        }
      } catch (error) {
        toast.error("Error fetching demands");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDemands();
  }, []);

  // Fetch sections and filter for current CM
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/sections");
        if (response.ok) {
          const allSections = response.data.sections;
          
          // Get current user ID from Redux store
          const currentUserId = currentUser?.id;
          
          // Debug logs
          console.log("Current User from Redux:", currentUser);
          console.log("Current User ID from Redux:", currentUserId);
          console.log("All sections:", allSections);
          
          // Filter sections where current CM is assigned to a CM_STORE
          const assignedSections = allSections.filter(section => {
            // Check if section has any stores
            if (!section.stores || section.stores.length === 0) {
              console.log(`Section ${section.name} has no stores`);
              return false;
            }
            
            // Look for CM_STORE assignments
            const cmStoreAssignments = section.stores.filter(store => {
              const isCMStore = store.type === "CM_STORE";
              const isAssignedToCurrentUser = store.cmUserId === currentUserId;
              const isActive = store.isActive === true;
              
              // Debug log for each store
              console.log(`Section: ${section.name}, Store: ${store.name}, Type: ${store.type}, CM User ID: ${store.cmUserId}, Current User ID: ${currentUserId}, Is Assigned: ${isAssignedToCurrentUser}, Is Active: ${isActive}`);
              
              return isCMStore && isAssignedToCurrentUser && isActive;
            });
            
            const hasAssignment = cmStoreAssignments.length > 0;
            console.log(`Section ${section.name} has ${cmStoreAssignments.length} CM store assignment(s) to current user:`, hasAssignment);
            
            if (hasAssignment) {
              console.log(`CM Store assignments for ${section.name}:`, cmStoreAssignments);
            }
            
            return hasAssignment;
          });
          
          console.log("Final filtered assigned sections:", assignedSections);
          console.log(`Total sections assigned to CM ${currentUser?.name}: ${assignedSections.length}`);
          
          setSections(assignedSections);
        } else {
          toast.error("Failed to fetch sections");
          setSections([]);
        }
      } catch (error) {
        toast.error("Error fetching sections");
        console.error(error);
        setSections([]);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchSections();
  }, [currentUser]);

  useEffect(() => {
    // Fetch analytics and chart data
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get("/analytics/construction-manager/dashboard");
        if (response.ok && response.data?.data?.summary) {
          const summary = response.data.data.summary;
          const charts = response.data.data.charts || {};
          setProjectStats([
            { label: "Assigned Sections", icon: FaBoxesStacked, count: summary.assignedSections || 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/project-management/sections") },
            { label: "Total Demands", icon: FaHandHoldingHeart, count: summary.totalDemands || 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/demands")},
            { label: "Total POs Created", icon: FaHandHoldingHeart, count: summary.totalPOsCreated || 0, percentage: 0 , onClick: () => navigate("/construction-manager-dashboard/pOS")},
          ]);
          setDemandBreakdown((charts.demandBreakdown || []).map((item) => ({ label: item.status, value: item.count })));
          setFulfillmentProgress(charts.fulfillmentProgress || []);
        } else {
          toast.error("Failed to fetch analytics data");
        }
      } catch (error) {
        toast.error("Error fetching analytics data");
        console.error(error);
      }
    };
    fetchAnalytics();
  }, []);


  const columns = [
    { headerName: "Ref No", field: "refNo" },
    { headerName: "Projects", field: "project" },
    { headerName: "Materials", field: "material" },
    { headerName: "Sections", field: "section" },
    { headerName: "Qty", field: "qty" },
    { headerName: "Status", field: "status" },
    { headerName: "CM Name", field: "cmName" },
    { headerName: "Date", field: "date" },
  ];

  // Helper for section actions
  const sectionActions = (sec) => [
    {
      label: "View Section Detail",
      icon: <FaEye />,
      onClick: () => navigate(`/construction-manager-dashboard/sections/${sec.id}`),
    },
    // {
    //   label: "Edit Project Section",
    //   icon: <FaUserEdit />,
    //   onClick: () => console.log(`Edit clicked for section ${sec.id}`),
    // },
    // {
    //   label: "Delete Project Section",
    //   icon: <FaTrash />,
    //   onClick: () => console.log(`Delete clicked for section ${sec.id}`),
    // },
  ];

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="">
    
      <TopBar
        title="Construction Manager"
        // detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
      />

      <div className="h-[1px] bg-[#CDCDCD] w-full my-4" />

      <h2 className="text-2xl font-semibold text-primary mb-4">Overview</h2>

      <div className="border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projectStats.map((item, index) => {
          return (
            <div
              key={index}
              className={`relative after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-[#E0E0E0] `}
            >
              <AnalyticsCard
                label={item.label}
                icon={item.icon}
                count={item.count}
                percentage={item.percentage}
                onClick={item.onClick}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col  lg:flex-row gap-6">
        <PieGraph pieTitle="Demand Status" data={demandBreakdown} />
        <HorixontalBarchartGraph
          title={"Fulfillment Progress"}
          dataset={fulfillmentProgress}
          series={[{ dataKey: "progress", label: "Progress" }]}
        />
      </div>
      
      {/* Section Cards */}
      <div className="w-full mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Your Assigned Sections</h2>
          <div className="text-sm text-gray-600">
            Showing {sections.length} section{sections.length !== 1 ? 's' : ''} assigned to you
          </div>
        </div>
        
        {sections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No sections assigned to you</div>
            <div className="text-gray-500 text-sm">
              Contact your administrator to get assigned to project sections
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
            {sections.map((sec, index) => {
              // Find CM store assignments for this section
              const cmStores = sec.stores?.filter(store => 
                store.type === "CM_STORE" && 
                store.cmUserId === currentUser?.id &&
                store.isActive === true
              ) || [];
              
              return (
                <div key={sec.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <SectionCard
                    sectionNo={index + 1}
                    sectionName={sec.name}
                    code={sec.code}
                    description={sec.description}
                    // dropdownActions={sectionActions(sec)}
                  />
                  
                  {/* Show CM Store Assignment Details */}
                  {cmStores.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Your CM Stores:</strong>
                      </div>
                      {cmStores.map((store, storeIndex) => (
                        <div key={store.id} className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-1">
                          <div>• {store.name}</div>
                          <div className="text-gray-400">Store ID: {store.id}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Project Info */}
                  {sec.project && (
                    <div className="mt-2 text-xs text-gray-500">
                      <strong>Project:</strong> {sec.project.name} ({sec.project.code})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={demands} loading={loading} cellComponents={{ status: StatusChip }} />
      </div>
    </div>
  );
}

export default CmDashboard;

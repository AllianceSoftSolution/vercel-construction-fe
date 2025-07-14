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
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

function CmDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  // Analytics and chart data states
  const [projectStats, setProjectStats] = useState([
    { label: "Total Projects", icon: FaBoxesStacked, count: 0, percentage: 0 },
    { label: "Total Demands", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
    { label: "Total POs Created", icon: FaHandHoldingHeart, count: 0, percentage: 0 },
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
            date: demand.createdAt ? new Date(demand.createdAt).toLocaleDateString() : "N/A",
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

  // Fetch only sections assigned to the current CM
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        // Try to get only assigned sections (adjust endpoint as needed)
        let response = await apiClient.get("/sections?assignedToMe=true");
        if (response.ok) {
          setSections(response.data.sections);
        } else {
          // Fallback: fetch all and filter by current user
          response = await apiClient.get("/sections");
          if (response.ok) {
            // Assume userId is stored in localStorage (adjust as needed)
            const userId = localStorage.getItem("userId");
            setSections(
              response.data.sections.filter(
                (section) =>
                  section.assignedCMId === userId ||
                  (section.assignedCMs && section.assignedCMs.some((cm) => cm.id === userId))
              )
            );
          } else {
            setSections([]);
          }
        }
      } catch (error) {
        toast.error("Error fetching sections");
        setSections([]);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    // Fetch analytics and chart data
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.get("/analytics/construction-manager/dashboard");
        if (response.ok && response.data?.data?.summary) {
          const summary = response.data.data.summary;
          const charts = response.data.data.charts || {};
          setProjectStats([
            { label: "Total Projects", icon: FaBoxesStacked, count: summary.totalProjects || 0, percentage: 0 },
            { label: "Total Demands", icon: FaHandHoldingHeart, count: summary.totalDemands || 0, percentage: 0 },
            { label: "Total POs Created", icon: FaHandHoldingHeart, count: summary.totalPOsCreated || 0, percentage: 0 },
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

  const actions = [
    // {
    //   label: "View Section Detail",
    //   icon: <FaEye />,
    //   onClick: () => navigate("/construction-manager-dashboard/sections/23232"),
    // },
    {
      label: "Edit Project Section",
      icon: <FaUserEdit />,
      onClick: () => console.log("Edit clicked"),
    },
    {
      label: "Delete Project Section",
      icon: <FaTrash />,
      onClick: () => console.log("Delete clicked"),
    },
  ];
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
    {
      label: "Edit Project Section",
      icon: <FaUserEdit />,
      onClick: () => console.log(`Edit clicked for section ${sec.id}`),
    },
    {
      label: "Delete Project Section",
      icon: <FaTrash />,
      onClick: () => console.log(`Delete clicked for section ${sec.id}`),
    },
  ];

  // Get current CM user ID (adjust as needed)
  const currentUserId = localStorage.getItem("userId");

  // Only show sections assigned to this CM
  const assignedSections = sections.filter(section =>
    section.stores && section.stores.some(
      store => store.type === "CM_STORE" && store.cmUserId === currentUserId
    )
  );

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
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
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
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {assignedSections.length === 0 ? (
          <div className="text-gray-400 text-center col-span-2">No sections available.</div>
        ) : (
          assignedSections.map((sec, index) => (
            <SectionCard
              key={sec.id}
              sectionNo={index + 1}
              sectionName={sec.name}
              code={sec.code}
              description={sec.description}
              dropdownActions={sectionActions(sec)}
            />
          ))
        )}
      </div>

      <div className="overflow-x-auto mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Demands</h2>
        <SimpleTable columns={columns} data={demands} loading={loading} cellComponents={{}} />
      </div>
    </div>
  );
}

export default CmDashboard;

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
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import toast from "react-hot-toast";

function CmDashboard() {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const projectStats = [
    {
      label: "Total Projects",
      icon: FaBoxesStacked,
      count: 10,
      percentage: 10,
    },
    {
      label: "Approved Demands",
      icon: FaHandHoldingHeart,
      count: 10,
      percentage: 10,
    },
    {
      label: "Rejected Demands",
      icon: FaHandHoldingHeart,
      count: 10,
      percentage: 10,
    },
  ];

  // Remove the hardcoded SectionCard and render dynamically if you have section data
  // For now, use a placeholder empty array for sections
  const sections = [];

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
        <PieGraph />

        <HorixontalBarchartGraph title={"Fulfillment Progress"} />
      </div>
      {/* Section Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {sections.length === 0 ? (
          <div className="text-gray-400 text-center col-span-2">No sections available.</div>
        ) : (
          sections.map((sec, index) => (
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

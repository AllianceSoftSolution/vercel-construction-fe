import React, { useEffect, useState } from "react";
import TopBar from "../../../../components/ui/TopBar";
import manager from "../../../../assets/construction/manager.png";
import { FaWhatsapp } from "react-icons/fa";
import flag from "../../../../assets/construction/flag.jpg";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";
import { useParams } from "react-router-dom";
import apiClient from "../../../../api/apiClient";
import toast from "react-hot-toast";

const SinMemberDetailPage = () => {
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to format role for display
  const formatRole = (role) => {
    if (!role) return "-";
    
    // Convert role to title case and replace underscores with spaces
    return role
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  const data = [  
    {
      id: 1,
      no: "1",
      projectName: "Bridge Construction",
      code: 9909,
      location: "London",
      section: "A1",
      amount: 120000,
      status: "Pending",
      date: "2025-06-15",
      action: "id-here",
    },
    {
      id: 2,
      no: "2",
      projectName: "Highway Expansion",
      code: 9909,
      location: "New York",
      section: "B2",
      amount: 2500000,
      status: "Approved",
      date: "2025-06-14",
      action: "id-here",
    },
    {
      id: 3,
      no: "3",
      projectName: "Metro Rail",
      code: 9909,
      location: "Paris",
      section: "C3",
      amount: 3000000,
      status: "In Progress",
      date: "2025-06-13",
      action: "id-here",
    },
  ];

  const columns = [
    { headerName: "No", field: "no" },
    { headerName: "Project Name", field: "projectName" },
    { headerName: "Code", field: "code" },
    { headerName: "Location", field: "location" },
    { headerName: "Sections", field: "section" },
    { headerName: "Construction Amount", field: "amount" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/auth/users/${id}`);
      if (response.ok) {
        setMemberData(response.data.user);
      } else {
        toast.error("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Something went wrong while fetching details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMemberDetails();
    }
  }, [id]);

    return (
    <div className="px-4 md:px-6 py-4">
      <TopBar title="Member Detail" detail="lorem ipsum" showExport={true} />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2"></div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/3 border-[0.5px] border-[#CDCDCD] rounded-xl p-4">
          <div className="flex flex-col items-center gap-y-2">
            <img src={manager} className="w-[100px] h-[100px] rounded-full" />
            <h3 className="text-lg font-semibold">{memberData?.name || "-"}</h3>
            <div className="flex items-center gap-1 text-[#979797] text-sm">
              <FaWhatsapp className="w-5 h-5" />
              <span>{memberData?.phone || "-"}</span>
            </div>
            <div className="h-[1px] w-full bg-[#CDCDCD] my-2"></div>
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-[#BF1017] font-semibold">General Information</h3>
            <InfoRow label="Email" value={memberData?.email || "-"} />
            <InfoRow label="Joining Date" value={memberData?.createdAt ? new Date(memberData.createdAt).toLocaleDateString() : "-"} />
            <InfoRow label="Employee ID" value={memberData?.employeeId || "-"} />
            <InfoRow label="Role" value={formatRole(memberData?.role)} />
            <InfoRow label="Status" value={memberData?.isActive ? "Active" : "Inactive"} />
            <InfoRow label="Created By" value={memberData?.creator?.name || "-"} />
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#BF1017]">Overview</h3>
            <div className="flex gap-x-2">
              <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              <MdEdit className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
            </div>
          </div>

          <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <AnalyticsCard label={"Total Projects"} icon={FaBoxesStacked} count={memberData?.createdUsers?.length || 0} />
          </div>
{/* 
          <div>
            <h3 className="text-xl font-semibold text-[#BF1017] mt-4">
              Project History
            </h3>
            <div className="overflow-x-auto mt-2">
              <SimpleTable data={data} columns={columns} cellComponents={{}} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <p className="font-semibold">{label}</p>
    <p>{value}</p>
  </div>
);

export default SinMemberDetailPage;

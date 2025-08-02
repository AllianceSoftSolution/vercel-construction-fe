import React, { useState } from "react";
import { useEffect } from "react";
import TopBar from "../../../../components/ui/TopBar";
import manager from "../../../../assets/construction/manager.png";
import { FaWhatsapp } from "react-icons/fa";
import flag from "../../../../assets/construction/flag.jpg";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";
import apiClient from "../../../../api/apiClient";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const MemberDetailPage = () => {
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
    <div className="p-4 w-full">
      <TopBar title="Member Detail"
      showIcon={true}
      //  detail="lorem ipsum" 
      //  showExport={true} 
       />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2"></div>

      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        <div className="w-full lg:w-[30%] border-[0.5px] border-[#CDCDCD] rounded-xl p-4">
          <div className="flex flex-col items-center gap-y-2">
            <img src={manager} className="w-[100px] h-[100px] rounded-full" />
            <h3 className="text-lg font-semibold">{memberData?.name || "-"}</h3>
            <div className="flex items-center text-sm text-[#979797]">
              <FaWhatsapp className="w-5 h-5 mr-1" />
              <span>{memberData?.phone || "-"}</span>
            </div>
            <div className="h-[1px] w-full bg-[#CDCDCD] my-4"></div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[#BF1017] font-semibold">
              General Information
            </h3>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Email</p>
              <p>{memberData?.email || "-"}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Joining Date</p>
              <p>{memberData?.createdAt ? new Date(memberData.createdAt).toLocaleDateString() : "-"}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Employee ID</p>
              <p>{memberData?.employeeId || "-"}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Role</p>
              <p>{formatRole(memberData?.role)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Status</p>
              <p>{memberData?.isActive ? "Active" : "Inactive"}</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Created By</p>
              <p>{memberData?.creator?.name || "-"}</p>
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>

        <div className="w-full lg:w-[70%] flex flex-col gap-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-[#BF1017]">Overview</h3>
            {/* <div className="flex gap-2">
              <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              <MdEdit className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
            </div> */}
          </div>

          <div className="border-[0.5px] border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnalyticsCard
              label="Total Projects"
              icon={FaBoxesStacked}
              count={memberData?.createdUsers?.length || 0}
            />
          </div>
{/* 
          <div>
            <h3 className="text-xl font-semibold text-[#BF1017] mt-4">
              Projects History
            </h3>
            <SimpleTable data={data} columns={columns} cellComponents={{}} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;

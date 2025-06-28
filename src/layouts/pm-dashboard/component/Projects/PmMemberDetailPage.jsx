import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import manager from "../../../../assets/construction/manager.png";
import { FaWhatsapp } from "react-icons/fa";
import flag from "../../../../assets/construction/flag.jpg";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";

const PmMemberDetailPage = () => {
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

  return (
    <div className="p-2">
      <TopBar
        title="Site Manager"
        detail="lorem ipsum"
        showExport={true}
      />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2"></div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Section */}
        <div className="w-full md:w-[30%] border border-[#CDCDCD] rounded-xl p-4 mt-4">
          <div className="flex flex-col items-center gap-y-2">
            <img src={manager} className="w-[100px] h-[100px]" />
            <h3>Manager Name Here</h3>
            <div className="flex items-start mt-1">
              <FaWhatsapp className="w-5 h-5 mr-1 mt-[2px]" />
              <span className="text-sm text-[#979797]">1234567890</span>
            </div>
            <div className="h-[1px] w-full bg-[#CDCDCD] my-2"></div>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <h3 className="text-[#BF1017] font-semibold">General Information</h3>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Email</p>
              <p>example@gmail.com</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Joining Date</p>
              <p>12/04/2025</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Manager ID</p>
              <p>9090</p>
            </div>
            <div className="flex justify-between text-sm">
              <p className="font-semibold">Language</p>
              <p>English</p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <p className="font-semibold">Country</p>
              <div className="flex items-center gap-1">
                <p>Pakistan</p>
                <img src={flag} className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[70%] mt-2 p-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="text-xl font-semibold text-[#BF1017]">Overview</h3>
            <div className="flex gap-x-2 mt-2 sm:mt-0">
              <MdDelete className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
              <MdEdit className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer" />
            </div>
          </div>

          <div className="border mt-4 border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <AnalyticsCard label={"Total Projects "} icon={FaBoxesStacked} count={10} />
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold text-[#BF1017]">Projects History</h3>
            <div className="overflow-x-auto mt-2">
              <SimpleTable data={data} columns={columns} cellComponents={{}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PmMemberDetailPage;

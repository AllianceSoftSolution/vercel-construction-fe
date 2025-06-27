import React from "react";
import TopBar from "../../../../components/ui/TopBar";
import manager from "../../../../assets/construction/manager.png";
import { FaWhatsapp } from "react-icons/fa";
import flag from "../../../../assets/construction/flag.jpg";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaBoxesStacked } from "react-icons/fa6";
import AnalyticsCard from "../../../../mui/AnalyticsCard";
import SimpleTable from "../../../../components/SimpleTable";

const MemberDetailPage = () => {
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
    <div>
      <TopBar
        title="Member Detail"
        detail="lorem ipsum"
        showExport={true}
        // buttonText="Assign New Project"
      />
      <div className="h-[1px] w-full bg-[#CDCDCD] mt-2"></div>
      <div className="flex  ">
        <div className="h-fit w-[30%] border-[0.5px] border-[#CDCDCD] rounded-xl p-2 mt-4 ">
          <div className="flex flex-col items-center mt-6 gap-y-2">
            <img src={manager} className="w-[100px] h-[100px]" />
            <h3>Manager Name Here</h3>
            <div className="flex items-start mt-1">
              <FaWhatsapp className="w-5 h-5 mr-1 mt-[2px]" />
              <span className="text-sm items-center text-[#979797]">
                1234567890
              </span>
            </div>
            <div className="h-[1px] w-full bg-[#CDCDCD]"></div>
          </div>{" "}
          <div className="mt-2 flex flex-col p-2">
            <div>
              <h3 className="text-[#BF1017] font-semibold">
                General Information
              </h3>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Email</p>
              <p>example@gmail.com</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Joining Date</p>
              <p>12/04/2025</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Manager ID</p>
              <p>9090</p>
            </div>{" "}
            <div className="flex justify-between">
              <p className="font-semibold">Language</p>
              <p>English</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Country</p>
              <div className="flex">
                <p>Pakistan</p>
                <img src={flag} className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-[70%] mt-2 p-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold text-[#BF1017]">OverView</h3>
            <div className="flex gap-x-2">
              <MdDelete
                // onClick={onDelete}
                className="text-white bg-[#EF0404] w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
              <MdEdit
                // onClick={onEdit}
                className="text-white bg-primary w-10 h-10 p-2 rounded-tl-xl rounded-br-xl cursor-pointer"
              />
            </div>
          </div>
          <div className="border-[0.5px] mt-4 border-[#CDC9C9] rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AnalyticsCard
              label={"Total Projects "}
              icon={FaBoxesStacked}
              count={10}
              // percentage={10}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#BF1017] mt-4">
              Projects Histroy{" "}
            </h3>
            <SimpleTable data={data} columns={columns} cellComponents={{}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;

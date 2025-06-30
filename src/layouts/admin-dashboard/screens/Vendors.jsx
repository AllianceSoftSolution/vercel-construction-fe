import React from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import DropdownButton from "@/comments/components/DropdownButton";
import { BsThreeDotsVertical } from "react-icons/bs";

const Vendors = () => {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      vendorId: "001",
      vendorName: "Fatima Khan",
      companyName: "Bridge Construction",
      phone: +911234567890,
      email: "A@gmail.com",
      address: "address here",
      status: "Pending",
      date: "2025-06-15",
    },
    {
      id: 2,
      vendorId: "002",
      vendorName: "Fatima Khan",
      companyName: "Highway Expansion",
      phone: +911234567890,
      email: "A@gmail.com",
      address: "address here",
      status: "Approved",
      date: "2025-06-14",
    },
    {
      id: 3,
      vendorId: "003",
      vendorName: "Fatima Khan",
      companyName: "Metro Rail",
      phone: +911234567890,
      email: "A@gmail.com",
      address: "address here",
      status: "In Progress",
      date: "2025-06-13",
    },
  ];
  const columns = [
    { headerName: "Vendor Id", field: "vendorId" },
    { headerName: "Vendor Name", field: "vendorName" },
    { headerName: "Company Name", field: "companyName" },
    { headerName: "Phone", field: "phone" },
    { headerName: "Email", field: "email" },
    { headerName: "Address", field: "address" },
    { headerName: "Status", field: "status" },
    { headerName: "Date", field: "date" },
    { headerName: "Action", field: "action" },
  ];
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View Detail",
            onClick: () => navigate("123"),
            // icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            // onClick: () => alert("Delete"),
            // icon: <FaTrash />,
          },
        ]}
        // onClick={handleActionClick}
      >
        <IconButton>
          <BsThreeDotsVertical />
        </IconButton>
      </DropdownButton>
    );
  };
  return (
    <div className="h-full">
      <TopBar
        title="Vendors"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["Active", "Inactive"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Add Vendors"
        onButtonClick={() => navigate("/admin-dashboard/vendors/addVendor")}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable
          columns={columns}
          data={data}
          cellComponents={{ action: CustomActionComponent }}
        />
      </div>
    </div>
  );
};

export default Vendors;

import React from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";

const Vendors = () => {
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
  ];
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="Vendors"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        buttonText="Add Vendors"
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
};

export default Vendors;

import React from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";

const Materials = () => {
  const navigate = useNavigate();
  const data = [
    {
      id: 1,
      iD: "001",
      productName: "Bridge Construction",
      unit: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 2,
      iD: "002",
      productName: "Highway Expansion",
      unit: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 3,
      iD: "003",
      productName: "Metro Rail",
      unit: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];
  const columns = [
    { headerName: "ID", field: "iD" },
    { headerName: "Product Name", field: "productName" },
    { headerName: "Unit", field: "unit" },
  ];
  return (
    <div className="h-full ">
      <TopBar
        title="Materials"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        showExport={true}
        // showFilter={true}
        buttonText="Add Product"
        onButtonClick={() => navigate("/admin-dashboard/materials/addProduct")}
      />
      <div className="h-[1px] bg-[#CDCDCD] w-full my-4"></div>
      {/* table */}
      <div className="overflow-x-auto">
        <SimpleTable columns={columns} data={data} cellComponents={{}} />
      </div>
    </div>
  );
};

export default Materials;

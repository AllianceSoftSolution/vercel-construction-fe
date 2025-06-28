import React, { useState } from "react";
import TopBar from "../../../components/ui/TopBar";
import SimpleTable from "../../../components/SimpleTable";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";
import DropdownButton from "../../../comments/components/DropdownButton";
import AddMemberModal from "./users/modals/AddMemberModal";

const SinStores = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLinkClick = () => {
    setShowModal(true);
  };
  const CustomActionComponent = ({ data }) => {
    return (
      <DropdownButton
        className="bg-[#FF0000] font-semibold"
        items={[
          {
            label: "View",
            onClick: () => navigate("123"),
            icon: <FaUserEdit />,
          },
          {
            label: "Delete ",
            onClick: () => alert("Delete"),
            icon: <FaUserEdit />,
          },
          {
            label: "Assign Store Incharge",
            onClick: () => handleLinkClick(),
            icon: <FaUserEdit />,
          },
          {
            label: "Assign Accountant",
            onClick: () => navigate("123"),
            icon: <FaUserEdit />,
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
  const data = [
    {
      id: 1,
      storeId: "ST-001",
      storeName: "name here",
      project: "Bridge Construction",
      storeHead: "Ahmad",
      storeIncharge: "Ali",
      manager: "Hasan",
      accountant: "Ahmed",
      status: "Pending",
    },
    {
      id: 2,
      storeId: "ST-001",
      storeName: "name here",
      project: "Bridge Construction",
      storeHead: "Ahmad",
      storeIncharge: "Ali",
      manager: "Hasan",
      accountant: "Ahmed",
      status: "Pending",
    },
    {
      id: 3,
      storeId: "ST-001",
      storeName: "name here",
      project: "Bridge Construction",
      storeHead: "Ahmad",
      storeIncharge: "Ali",
      manager: "Hasan",
      accountant: "Ahmed",
      status: "Pending",
    },
    {
      id: 4,
      storeId: "ST-001",
      storeName: "name here",
      project: "Bridge Construction",
      storeHead: "Ahmad",
      storeIncharge: "Ali",
      manager: "Hasan",
      accountant: "Ahmed",
      status: "Pending",
    },
  ];
  const columns = [
    { headerName: "Store Id", field: "storeId" },
    { headerName: "Store Name", field: "storeName" },
    { headerName: "Project", field: "project" },
    { headerName: "Store Head", field: "storeHead" },
    { headerName: "Store Incharge", field: "storeIncharge" },
    { headerName: "Manager", field: "manager" },
    { headerName: "Accountant", field: "accountant" },
    { headerName: "Status", field: "status" },
    { headerName: "Action", field: "action" },
  ];
  return (
    <div className="md:px-2 mx-2 h-full md:mx-0">
      <TopBar
        title="Stores"
        detail="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        // showExport={true}
        showFilter={true}
        filterOptions={["ON-GOING", "Pending", "Not Started"]}
        onFilterChange={(selected) =>
          console.log("Selected Filters:", selected)
        }
        buttonText="Add New Store"
        onButtonClick={() => navigate("/siteincharge-dashboard/store/addStore")}
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
      {showModal && <AddMemberModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default SinStores;
